import prisma from '../prismaClient.js';
import { sendResponse, sendError } from '../utils/responseHelper.js';

// POST /api/messages — send a message
export const sendMessage = async (req, res) => {
    try {
        const { content, senderRole, senderName } = req.body;
        if (!content || !senderRole) {
            return sendError(res, 400, 'content and senderRole are required');
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderRole: senderRole.toUpperCase(),
                senderName: senderName || (senderRole === 'PARENT' ? 'Mr. Patil' : 'Prof. Sharma')
            }
        });

        // Create a notification for the other side
        const forRole = senderRole.toUpperCase() === 'PARENT' ? 'TEACHER' : 'PARENT';
        const notifTitle = senderRole.toUpperCase() === 'PARENT'
            ? `💬 Message from Arjun Patil's parent`
            : `💬 Message from Prof. Sharma`;

        await prisma.notification.create({
            data: {
                title: notifTitle,
                message: content.length > 80 ? content.substring(0, 80) + '...' : content,
                type: 'MESSAGE',
                link: forRole === 'TEACHER' ? '/teacher/messages' : '/parent/message',
                forRole,
                isRead: false
            }
        });

        return sendResponse(res, 201, message);
    } catch (error) {
        console.error('Error sending message:', error);
        return sendError(res, 500, error.message);
    }
};

// GET /api/messages — get all messages (chat thread)
export const getMessages = async (req, res) => {
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'asc' }
        });
        return sendResponse(res, 200, messages);
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

// POST /api/messages/alert-parent — teacher alerts parent about a student
export const alertParent = async (req, res) => {
    try {
        const { studentName, subject, score, trend } = req.body;

        // Create notification for parent
        await prisma.notification.create({
            data: {
                title: `⚠️ Alert from Prof. Sharma`,
                message: `Your child ${studentName || 'Arjun Patil'} is flagged as at-risk in ${subject || 'a subject'}. Current score: ${score || 'N/A'}%, Trend: ${trend || 'N/A'}%.`,
                type: 'ALERT',
                link: '/parent/message',
                forRole: 'PARENT',
                isRead: false
            }
        });

        return sendResponse(res, 201, { message: `Alert sent to ${studentName || 'Arjun Patil'}'s parent` });
    } catch (error) {
        console.error('Error alerting parent:', error);
        return sendError(res, 500, error.message);
    }
};
