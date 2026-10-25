import prisma from '../prismaClient.js';
import { sendResponse, sendError } from '../utils/responseHelper.js';

export const listNotifications = async (req, res) => {
    try {
        const { role } = req.query;
        let where = {};
        if (role) {
            const r = role.toUpperCase();
            // Match role specifically or null (broadcast)
            where = {
                OR: [
                    { forRole: r },
                    { forRole: null }
                ]
            };
        }
        const notifications = await prisma.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 20
        });
        return sendResponse(res, 200, notifications);
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });
        return sendResponse(res, 200, notification);
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const markAllAsRead = async (req, res) => {
    try {
        await prisma.notification.updateMany({
            where: { isRead: false },
            data: { isRead: true }
        });
        return sendResponse(res, 200, { message: 'All notifications marked as read' });
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const createNotification = async (req, res) => {
    try {
        const { title, message, type, link, userId } = req.body;
        const notification = await prisma.notification.create({
            data: {
                title,
                message,
                type: type || 'ASSIGNMENT',
                link: link || '/student/submit',
                userId: userId || null
            }
        });
        return sendResponse(res, 201, notification);
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};
