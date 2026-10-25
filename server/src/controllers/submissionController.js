import { createSubmission, updateSubmission } from '../services/submissionService.js';
import { getAssignmentById } from '../services/assignmentService.js';
import { sendResponse, sendError } from '../utils/responseHelper.js';
import { gradeWithAI } from '../services/aiService.js';

export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, studentId, studentAnswer, base64Image, mimeType } = req.body;

        // 1. Fetch assignment details for context
        const assignment = await getAssignmentById(assignmentId);
        if (!assignment) {
            return sendError(res, 404, 'Assignment not found', 'ASSIGNMENT_NOT_FOUND');
        }

        // 2. Create pending submission
        let submission = await createSubmission({
            assignmentId,
            studentId,
            studentAnswer: studentAnswer || '[Handwritten image submitted]',
            status: 'PENDING',
        });

        // 3. Call Groq AI Grading Service
        try {
            console.log(`\n📝 Grading submission ${submission.id} for assignment "${assignment.title}"`);

            const gradingResult = await gradeWithAI({
                subject: assignment.subject,
                question: assignment.question,
                studentAnswer: studentAnswer || '',
                base64Image: base64Image || null,
                mimeType: mimeType || null,
                questionImage: assignment.questionImage || null,
                questionImageMime: assignment.questionImageMime || null,
            });

            // 4. Update submission with results
            submission = await updateSubmission(submission.id, {
                score: gradingResult.score,
                grade: gradingResult.grade,
                percentage: gradingResult.percentage,
                strengths: gradingResult.strengths || [],
                weaknesses: gradingResult.weaknesses || [],
                feedback: gradingResult.feedback || gradingResult.detailed_feedback || '',
                tips: gradingResult.tips || gradingResult.improvement_tips || [],
                topics: gradingResult.topics || gradingResult.recommended_topics || [],
                encouragement: gradingResult.encouragement || gradingResult.encouragement_message || '',
                status: gradingResult.error === 'ILLEGIBLE_HANDWRITING' ? 'NEEDS_MANUAL_REVIEW' : 'GRADED',
                error: gradingResult.error || null,
            });

            // Merge the full gradingResult into the response so frontend gets everything
            const responseData = {
                ...submission,
                ...gradingResult,
            };

            return sendResponse(res, 201, responseData);
        } catch (aiError) {
            console.error('❌ AI Grading failed:', aiError.message);
            return sendError(res, 502, `AI Grading Error: ${aiError.message}`, 'AI_GRADING_FAILED');
        }
    } catch (error) {
        console.error('❌ Submission error:', error);
        return sendError(res, 500, error.message);
    }
};
