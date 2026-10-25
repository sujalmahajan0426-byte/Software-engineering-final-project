export const parentStats = {
    avgScore: 76,
    weeklySubmissions: 3,
    improvement: 8,
    attendance: 92
};

export const childInfo = {
    name: 'Arjun Patil',
    class: 'B.Tech AIML (2nd Year)',
    school: "SVKM's NMIMS Shirpur",
    rollNo: 'C250'
};

export const subjectPerformance = [
    { subject: 'Software Engineering', score: 84, status: 'excellent' },
    { subject: 'Data Wrangling', score: 79, status: 'good' },
    { subject: 'DSA', score: 76, status: 'good' },
    { subject: 'PS', score: 71, status: 'average' },
    { subject: 'OS', score: 82, status: 'excellent' }
];

export const progressTrend = [
    { date: 'Week 1', score: 68 },
    { date: 'Week 2', score: 70 },
    { date: 'Week 3', score: 75 },
    { date: 'Week 4', score: 76 }
];

export const notifications = [
    { id: 1, type: 'critical', text: '📉 Arjun scored below 50% in Calculus II Mid-Term', time: '3 days ago', read: false },
    { id: 2, type: 'success', text: '✅ Arjun\'s Python score improved by 15%!', time: '1 week ago', read: true },
    { id: 3, type: 'info', text: '📝 New project submitted: REST API Implementation', time: 'Yesterday', read: false },
    { id: 4, type: 'warning', text: '🚨 Professor flagged Arjun for low attendance in Calculus II', time: '2 days ago', read: true },
    { id: 5, type: 'info', text: '🏫 College tech fest dates announced for next month', time: 'Today', read: true }
];

export const recentFeedback = [
    { id: 'f1', subject: 'Calculus II', score: 48, date: '2025-03-20', title: 'Mid-Term Exam', summary: 'Arjun struggled with multiple integrals. Needs to practice partial differentiation.' },
    { id: 'f2', subject: 'Python Programming', score: 92, date: '2025-03-18', title: 'Data Analysis Lab', summary: 'Excellent understanding of Pandas and NumPy. Great analytical skills.' },
    { id: 'f3', subject: 'Software Engineering', score: 85, date: '2025-03-15', title: 'Agile Essay', summary: 'Good grasp of agile methodologies. Essay was well-structured.' }
];

// Lecture-wise attendance summary for subjects
export const attendanceSummary = [
    { subject: 'Software Engineering', total: 36, present: 33 },
    { subject: 'Data Wrangling', total: 32, present: 29 },
    { subject: 'DSA', total: 40, present: 36 },
    { subject: 'PS', total: 28, present: 24 },
    { subject: 'OS', total: 35, present: 30 },
];

const recentSubjects = ['Software Engineering', 'Data Wrangling', 'DSA', 'PS', 'OS'];
export const attendanceTracker = Array.from({ length: 20 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(i / 3)); // roughly 3 lectures a day
    return {
        id: `lec-${i}`,
        date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        subject: recentSubjects[i % 5],
        type: i % 4 === 0 ? 'Lab' : 'Lecture',
        status: Math.random() > 0.15 ? 'present' : 'absent'
    };
});

export const chatMessages = [
    { id: 1, sender: 'teacher', text: 'Hello Mr. Patel! Just checking in regarding Arjun\'s recent Calculus exam.', time: '10:30 AM' },
    { id: 2, sender: 'parent', text: 'Hi Prof. Sharma. Yes, I saw the notification. He seems to be struggling with integration.', time: '11:15 AM' },
    { id: 3, sender: 'teacher', text: 'Yes, exactly. I\'ve suggested some extra practice problems via the portal. Could you encourage him to attend the TA sessions?', time: '11:20 AM' }
];
