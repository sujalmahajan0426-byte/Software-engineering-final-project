import fetch from 'node-fetch';

/**
 * SmartGrade AI Grading Service
 * Uses Groq API with Qwen 2.5/3.8 Multimodal Vision model (qwen/qwen3.8-27b)
 * to evaluate student submissions including:
 *   - Typed text answers
 *   - Handwritten image submissions
 *   - Teacher question images/problem sheets
 */

export const gradeWithAI = async ({
    subject,
    question,
    studentAnswer,
    base64Image = null,
    mimeType = null,
    questionImage = null,
    questionImageMime = null,
}) => {
    const API_KEY = process.env.GROQ_API_KEY;

    if (!API_KEY) {
        throw new Error('GROQ_API_KEY is not set in environment variables.');
    }

    const URL = 'https://api.groq.com/openai/v1/chat/completions';
    // Active multimodal model on Groq that supports both text and images
    const MODEL = 'qwen/qwen3.8-27b';

    const systemPrompt = `You are SmartGrade AI, an elite educational evaluation system for Indian universities and schools.
Your job is to read and grade the student's submission carefully, whether submitted as text or handwritten image.
You MUST respond ONLY with valid JSON conforming to the requested schema. Do NOT include markdown fences, backticks, or explanatory text.`;

    const gradingInstructions = `
Subject: ${subject}
Question / Problem: ${question}
Student's Submitted Text: ${studentAnswer || '[Student uploaded image notes]'}

INSTRUCTIONS FOR EVALUATION:
1. If a Question Image is attached, extract the question/problem criteria from it.
2. If a Student Answer Image is attached, transcribe and read the student's handwritten work thoroughly.
3. If the handwriting is completely blurry or unreadable (>80% illegible), set "error": "ILLEGIBLE_HANDWRITING" and score to null.
4. Otherwise, evaluate accuracy, depth, clarity, terminology, and correctness on a 0-100 scale.
5. Provide constructive, motivating, and specific feedback addressing strengths and exact areas for improvement.

REQUIRED JSON OUTPUT FORMAT (Strict JSON only, no backticks):
{
  "score": <integer between 0 and 100>,
  "grade": "<A+|A|B+|B|C|D|F>",
  "percentage": <integer between 0 and 100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "feedback": "<2-3 paragraph detailed evaluation>",
  "detailed_feedback": "<same as feedback>",
  "tips": ["<actionable tip 1>", "<actionable tip 2>", "<actionable tip 3>", "<actionable tip 4>"],
  "improvement_tips": ["<actionable tip 1>", "<actionable tip 2>", "<actionable tip 3>", "<actionable tip 4>"],
  "topics": ["<recommended study topic 1>", "<recommended study topic 2>", "<recommended study topic 3>"],
  "recommended_topics": ["<recommended study topic 1>", "<recommended study topic 2>", "<recommended study topic 3>"],
  "encouragement": "<positive closing sentence>",
  "encouragement_message": "<same as encouragement>",
  "knowledge_gaps": ["<gap 1>", "<gap 2>"],
  "weak_topics": ["<weak topic 1>", "<weak topic 2>"],
  "learning_path": {
    "step1": "<immediate concept to review>",
    "step2": "<practice problem to try>",
    "step3": "<next advanced topic>"
  },
  "emotion_tone": "Encouraging",
  "time_to_complete": "< 60 seconds",
  "error": null
}`;

    const userContent = [];

    // Always add instructions text
    userContent.push({ type: 'text', text: gradingInstructions });

    // If teacher attached a question image
    if (questionImage && questionImageMime) {
        userContent.push({
            type: 'text',
            text: '--- Attached Teacher Question Image ---'
        });
        userContent.push({
            type: 'image_url',
            image_url: {
                url: `data:${questionImageMime};base64,${questionImage}`
            }
        });
    }

    // If student attached a handwritten answer image
    if (base64Image && mimeType) {
        userContent.push({
            type: 'text',
            text: '--- Attached Student Handwritten Answer Image ---'
        });
        userContent.push({
            type: 'image_url',
            image_url: {
                url: `data:${mimeType};base64,${base64Image}`
            }
        });
    }

    const requestBody = {
        model: MODEL,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userContent }
        ],
        temperature: 0.2,
        max_tokens: 2500,
        response_format: { type: 'json_object' }
    };

    console.log(`\n🤖 Calling Groq AI API...`);
    console.log(`   Model: ${MODEL}`);
    console.log(`   Subject: ${subject}`);
    console.log(`   Teacher Question Image: ${Boolean(questionImage)}`);
    console.log(`   Student Answer Image: ${Boolean(base64Image)}`);

    const response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Groq API Error Status:', response.status);
        console.error('❌ Groq API Error Body:', errorText);
        throw new Error(`Groq API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content;

    if (!rawContent) {
        throw new Error('Groq returned empty response content');
    }

    console.log('✅ Groq AI response received successfully!');

    // Parse JSON safely
    const cleaned = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let result = JSON.parse(cleaned);

    // Normalize field aliases so frontend gets all expected keys
    result.feedback = result.feedback || result.detailed_feedback || 'Submission successfully graded.';
    result.detailed_feedback = result.detailed_feedback || result.feedback;
    result.tips = result.tips || result.improvement_tips || [];
    result.improvement_tips = result.improvement_tips || result.tips;
    result.topics = result.topics || result.recommended_topics || [];
    result.recommended_topics = result.recommended_topics || result.topics;
    result.encouragement = result.encouragement || result.encouragement_message || 'Keep practicing!';
    result.encouragement_message = result.encouragement_message || result.encouragement;
    result.percentage = typeof result.percentage === 'number' ? result.percentage : (result.score || 0);

    return result;
};

export const gradeWithGemini = gradeWithAI;
