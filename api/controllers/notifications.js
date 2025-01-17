import client from 'amqplib';
import dotenv from "dotenv";
import getNotificationModel from '../models/notifications.js';
import { get } from 'mongoose';

dotenv.config();

/**
 * RabbitMQ
 */



/**
 * @openapi
 * /{tenant}/notifications/{user_id}:
 *  get:
 *    summary: Get user notifications
 *    description: Get all notifications for a user
 *    tags: [Notifications]
 *    parameters:
 *      - in: path
 *        name: tenant
 *        required: true
 *        description: The tenant name
 *        schema:
 *          type: string
 *      - in: path
 *        name: user_id
 *        required: true
 *        description: The user ID
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: OK
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/Notification'
 *      400:
 *        description: Bad Request
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 *      500:
 *        description: Internal Server Error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorMessage'
 */

const getUserNotifications = async (req, res) => {
    try {
        const tenant = req.params.tenant;
        const user_id = req.params.user_id;
        if (!tenant) {
            res.status(400).json({ message: "Tenant is required" });
            return;
        }
        if (!user_id) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        const notificationsModel = await getNotificationModel(tenant);
        // get notifications where user is buyer
        const notifications = await notificationsModel.find({ buyer_id: user_id });
        // get notifications where user is seller
        const notifications2 = await notificationsModel.find({ seller_id: user_id });
        // merge notifications
        const allNotifications = notifications.concat(notifications2);
        res.status(200).json(allNotifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export default {
    getUserNotifications,
};