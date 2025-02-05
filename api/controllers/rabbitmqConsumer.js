import client from 'amqplib';
import dotenv from "dotenv";
import getNotificationModel from '../models/notifications.js';

dotenv.config();

const queueName = 'order';

/**
 * @openapi
 * components:
 *  schemas:
 *   rabbitMQMessage:
 *    type: object
 *    description: A message to be sent to RabbitMQ
 *    properties:
 *     order_id:
 *      type: string
 *      description: The order ID
 *      example: "100000000000000000000000"
 *     buyer_id:
 *      type: string
 *      description: The buyer ID
 *      example: "000000000000000000000002"
 *     seller_id:
 *      type: string
 *      description: The seller ID
 *      example: "000000000000000000000001"
 *     tenant:
 *      type: string
 *      description: The tenant name
 *      example: "tenant1"
 *     time:
 *      type: string
 *      format: date-time
 *      description: The time the message was created
 */

const startConsumer = async () => {
    let connection;
    const maxRetries = 5;
    let retries = 0;

    while (retries < maxRetries) {
        try {
            connection = await client.connect('amqp://guest:guest@rabbitmq:5672');
            const channel = await connection.createChannel();
            await channel.assertQueue(queueName);

            console.log(`Waiting for messages in queue: ${queueName}`);

            channel.consume(queueName, async (msg) => {
                if (msg !== null) {
                    const messageContent = JSON.parse(msg.content.toString());
                    console.log('Received message:', messageContent);

                    // Save the message to the database
                    const notificationsModel = await getNotificationModel(messageContent.tenant);
                    const notification = new notificationsModel(messageContent);
                    await notification.save();

                    // Acknowledge the message
                    channel.ack(msg);
                }
            });
            break; // Exit the loop if connection is successful
        } catch (error) {
            retries++;
            console.error(`Error in RabbitMQ consumer (attempt ${retries}):`, error);
            if (retries < maxRetries) {
                console.log(`Retrying to connect in 5 seconds...`);
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else {
                console.error('Max retries reached. Could not connect to RabbitMQ.');
            }
        }
    }
};

export { startConsumer };