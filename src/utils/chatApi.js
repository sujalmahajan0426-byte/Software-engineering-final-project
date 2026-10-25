const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_MODEL  = 'qwen/qwen3.8-27b';

export async function sendChatMessage(role, history, textMessage) {
    if (role === 'parent') {
        return "Chat support is currently only available for Students and Teachers.";
    }

    // Define persona system instructions based on role
    const systemInstruction = role === 'student'
        ? "You are the SmartGrade AI Student Tutor. You are friendly, encouraging, and explain academic concepts simply using Indian examples. Never give the direct answer; always guide the student to learn it themselves. Keep answers concise — under 3 paragraphs."
        : "You are the SmartGrade AI Teacher Coach. You assist teachers with lesson planning, grading rubrics, pedagogy tips, and handling at-risk students. Maintain a professional and efficient tone. Keep answers concise — under 3 paragraphs.";

    // Format history for Groq (OpenAI-compatible format)
    const formattedMessages = [
        { role: 'system', content: systemInstruction },
        ...history.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'assistant',
            content: msg.text
        })),
        { role: 'user', content: textMessage }
    ];

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: formattedMessages,
                max_tokens: 512,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const err = await response.json().catch(() => ({}));
            console.error("Groq Chat API failed", response.status, err);
            return "Sorry, I'm having trouble connecting right now. Please try again later.";
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error("Groq Chat Error:", error);
        return "Oops! My brain got disconnected. Check your internet connection!";
    }
}
