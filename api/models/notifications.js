import mongoose, { Mongoose } from 'mongoose';
import { connectToDatabase } from './db.js';

/**
 * @openapi
 * components:
 *  schemas:
 *   Notification:
 *    type: object
 *    description: A notification of an order
 *    properties:
 *      _id:
 *        type: string
 *        description: The auto-generated ID of the order
 *        example: "000000000000000000000001"
 *      order_id:
 *        type: string
 *        description: The order's ID
 *        example: "000000000000000000000004"
 *      buyer_id:
 *        type: string
 *        description: The buyer's ID
 *        example: "000000000000000000000002"
 *      seller_id:
 *        type: string
 *        description: The seller's ID
 *        example: "000000000000000000000001"
 *      tenant:
 *        type: string
 *        description: The tenant name
 *        example: "tenant1"
 *      time:
 *        type: string
 *        description: The date time the order was created
 *        example: "2021-09-01T12:00:00.000Z"
 *    required:
 *      - order_id
 *      - buyer_id
 *      - seller_id
 *      - tenant
 *      - time
 */

const notificationSchema = new mongoose.Schema({
    order_id: { type: String, required: true },
    buyer_id: { type: String, required: true },
    seller_id: { type: String, required: true },
    tenant: { type: String, required: true },
    time: { type: Date, required: true }
});

const getNotificationModel = async (dbName) => {
    const connection = await connectToDatabase(dbName);
    return connection.model('Notification', notificationSchema, 'Notifications');
};

export default getNotificationModel;