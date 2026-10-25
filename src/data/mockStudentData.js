export const studentStats = {
    submitted: 12,
    avgScore: 76,
    pending: 2,
    badges: 5
};

export const assignments = [
    { id: 'a1', title: 'Calculus II: Multiple Integrals', subject: 'Calculus', dueDate: '2025-04-10', status: 'pending', teacherNotes: 'Show all steps for partial differentiation.' },
    { id: 'a2', title: 'REST API Implementation', subject: 'Java Programming', dueDate: '2025-04-12', status: 'pending' },
    { id: 'a3', title: 'Agile Methodology Essay', subject: 'Software Engineering', dueDate: '2025-04-15', status: 'pending' },
    { id: 'a4', title: 'TCP/IP Socket Programming', subject: 'Computer Networks', dueDate: '2025-04-18', status: 'pending' },
    { id: 'a5', title: 'Machine Learning Basics', subject: 'Python', dueDate: '2025-04-20', status: 'pending' },
];

export const feedbackHistory = [
    { id: 'f1', title: 'Dijkstra Algorithm Quiz', subject: 'Data Structures', date: '2025-03-20', score: 85, grade: 'B+', status: 'reviewed' },
    { id: 'f2', title: 'Matrix Algebra', subject: 'Calculus', date: '2025-03-18', score: 92, grade: 'A', status: 'reviewed' },
    { id: 'f3', title: 'Design Patterns', subject: 'Software Engineering', date: '2025-03-15', score: 78, grade: 'B', status: 'reviewed' },
    { id: 'f4', title: 'Subnetting Lab', subject: 'Computer Networks', date: '2025-03-10', score: 65, grade: 'C+', status: 'reviewed' },
    { id: 'f5', title: 'Pandas Data Analysis', subject: 'Python', date: '2025-03-05', score: 88, grade: 'B+', status: 'reviewed' },
    { id: 'f6', title: 'Spring Boot Basics', subject: 'Java Programming', date: '2025-02-28', score: 62, grade: 'C', status: 'reviewed' },
    { id: 'f7', title: 'Binary Trees', subject: 'Data Structures', date: '2025-02-20', score: 95, grade: 'A+', status: 'reviewed' },
];

export const progressData = {
    trend: [
        { date: 'Jan 15', score: 65 },
        { date: 'Feb 01', score: 68 },
        { date: 'Feb 15', score: 72 },
        { date: 'Mar 01', score: 70 },
        { date: 'Mar 15', score: 75 },
        { date: 'Mar 30', score: 82 },
    ],
    bySubject: [
        { subject: 'Data Structures', score: 85, fullMark: 100 },
        { subject: 'Calculus', score: 78, fullMark: 100 },
        { subject: 'Software Eng', score: 82, fullMark: 100 },
        { subject: 'Comp Networks', score: 68, fullMark: 100 },
        { subject: 'Python', score: 88, fullMark: 100 },
    ],
    radar: [
        { subject: 'Data Structures', A: 85, fullMark: 100 },
        { subject: 'Calculus', A: 78, fullMark: 100 },
        { subject: 'Software Eng', A: 82, fullMark: 100 },
        { subject: 'Comp Networks', A: 68, fullMark: 100 },
        { subject: 'Python', A: 88, fullMark: 100 },
    ]
};

export const badges = [
    { id: 'b1', title: 'First Submission', icon: '🏆', earned: true, date: 'Feb 10, 2025' },
    { id: 'b2', title: 'Speed Coder', icon: '⚡', earned: true, date: 'Mar 01, 2025', desc: 'Submitted 5 lab assignments early' },
    { id: 'b3', title: 'Improver', icon: '📈', earned: true, date: 'Mar 15, 2025', desc: 'Score improved 3 times in a row' },
    { id: 'b4', title: 'Perfect Score', icon: '🎯', earned: false, desc: 'Score 100% on any major project' },
    { id: 'b5', title: '7-Day Streak', icon: '🔥', earned: true, date: 'Mar 25, 2025', desc: 'Logged in 7 days in a row' },
    { id: 'b6', title: 'Top of Batch', icon: '🌟', earned: false, desc: 'Achieve highest score in semester' },
];

export const streakData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    active: Math.random() > 0.3 
}));

// Lecture-wise attendance summary for subjects
export const attendanceSummary = [
    { subject: 'Software Engineering', total: 36, present: 33 },
    { subject: 'Data Wrangling', total: 32, present: 29 },
    { subject: 'DSA', total: 40, present: 36 },
    { subject: 'PS', total: 28, present: 24 },
    { subject: 'OS', total: 35, present: 30 },
];

// Recent individual lectures
const recentSubjects = ['Software Engineering', 'Data Wrangling', 'DSA', 'PS', 'OS'];
export const attendanceData = Array.from({ length: 20 }, (_, i) => {
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
