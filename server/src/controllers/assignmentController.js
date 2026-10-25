import prisma from '../prismaClient.js';
import { getAllAssignments, createAssignment } from '../services/assignmentService.js';
import { sendResponse, sendError } from '../utils/responseHelper.js';

export const listAssignments = async (req, res) => {
    try {
        const { classId } = req.query;
        const assignments = await getAllAssignments(classId);
        return sendResponse(res, 200, assignments);
    } catch (error) {
        return sendError(res, 500, error.message);
    }
};

export const addAssignment = async (req, res) => {
    try {
        let { title, question, subject, dueDate, classId, teacherId, teacherNotes, questionImage, questionImageMime } = req.body;

        if (!title || !subject) {
            return sendError(res, 400, 'Title and subject are required', 'MISSING_FIELDS');
        }

        if (!question && !questionImage) {
            return sendError(res, 400, 'Either a question text or question image is required', 'MISSING_FIELDS');
        }

        // Find or create class for subject
        if (!classId) {
            let cls = await prisma.class.findFirst({
                where: { subject }
            });
            if (!cls) {
                cls = await prisma.class.create({
                    data: {
                        name: `${subject} - Class A`,
                        subject
                    }
                });
            }
            classId = cls.id;
        }

        // Find teacher if not provided
        if (!teacherId) {
            const teacher = await prisma.user.findFirst({
                where: { role: 'TEACHER' }
            });
            if (teacher) {
                teacherId = teacher.id;
            } else {
                const anyUser = await prisma.user.findFirst();
                teacherId = anyUser ? anyUser.id : null;
            }
        }

        const formattedDueDate = dueDate ? new Date(dueDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const assignment = await createAssignment({
            title,
            question: question || '[Question provided as image]',
            subject,
            dueDate: formattedDueDate,
            classId,
            teacherId,
            questionImage: questionImage || null,
            questionImageMime: questionImageMime || null,
        });

        // Create notification for students
        try {
            await prisma.notification.create({
                data: {
                    title: `New Assignment: ${title}`,
                    message: `Prof. posted a new ${subject} assignment. Due date: ${formattedDueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`,
                    type: 'ASSIGNMENT',
                    link: '/student/submit'
                }
            });
        } catch (notifErr) {
            console.warn('Could not create notification record:', notifErr.message);
        }

        return sendResponse(res, 201, assignment);
    } catch (error) {
        console.error('Error in addAssignment:', error);
        return sendError(res, 500, error.message);
    }
};
