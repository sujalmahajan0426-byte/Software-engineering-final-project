export const teacherStats = {
    studentsTotal: 45,
    gradedToday: 23,
    pending: 4,
    classAvg: 72
};

export const assignments = [
    { id: 'a1', title: 'Calculus: Derivatives Practice', subject: 'Maths', dueDate: '2025-04-10', submitted: 38, total: 45, avgScore: 82 },
    { id: 'a2', title: 'Cell Biology Essay', subject: 'Science', dueDate: '2025-04-12', submitted: 42, total: 45, avgScore: 78 },
    { id: 'a3', title: 'Shakespeare Sonnet Analysis', subject: 'English', dueDate: '2025-04-15', submitted: 25, total: 45, avgScore: 75 },
    { id: 'a4', title: 'History of the Maratha Empire', subject: 'History', dueDate: '2025-04-18', submitted: 10, total: 45, avgScore: null },
];

export const recentActivity = [
    { id: 6, student: 'Pravin K.', action: 'flagged for manual review', assignment: 'Calculus: Derivatives Practice', time: 'Just now', error: true },
    { id: 1, student: 'Arjun P.', action: 'submitted', assignment: 'Maths Chapter 4 Quiz', time: '10 mins ago', grade: 'A+' },
    { id: 2, student: 'Priya S.', action: 'viewed feedback', assignment: 'Science Lab Report', time: '45 mins ago' },
    { id: 3, student: 'Rohan K.', action: 'submitted', assignment: 'Maths Chapter 4 Quiz', time: '1 hour ago', grade: 'B-' },
    { id: 4, student: 'Ananya D.', action: 'submitted', assignment: 'English Essay', time: '2 hours ago', grade: 'A' },
    { id: 5, student: 'Vikram M.', action: 'viewed feedback', assignment: 'History Chapter 2', time: '3 hours ago' }
];

export const atRiskStudents = [
    { id: 's0', name: 'Arjun Patil', rollNo: 'C250', class: 'AIML 2nd Year', subject: 'DSA', score: 42, trend: -14, status: 'critical' },
    { id: 's1', name: 'Rohan Kumar', rollNo: '12', class: 'AIML 2nd Year', subject: 'Maths', score: 45, trend: -12, status: 'critical' },
    { id: 's2', name: 'Neha Sharma', rollNo: '24', class: 'AIML 2nd Year', subject: 'Science', score: 48, trend: -8, status: 'warning' },
    { id: 's3', name: 'Aditya Patel', rollNo: '05', class: 'AIML 2nd Year', subject: 'History', score: 52, trend: -15, status: 'warning' },
    { id: 's4', name: 'Isha Gupta', rollNo: '18', class: 'AIML 2nd Year', subject: 'English', score: 40, trend: -5, status: 'critical' },
    { id: 's5', name: 'Kabir Singh', rollNo: '31', class: 'AIML 2nd Year', subject: 'Maths', score: 55, trend: -10, status: 'warning' }
];

export const classAnalytics = {
    distribution: [
        { name: 'A+ (90-100)', value: 12, fill: '#34A853' },
        { name: 'A (80-89)', value: 18, fill: '#4285F4' },
        { name: 'B (70-79)', value: 8, fill: '#FBBC05' },
        { name: 'C (60-69)', value: 5, fill: '#EA4335' },
        { name: 'Needs Help (<60)', value: 2, fill: '#C5192D' }
    ],
    subjectAverages: [
        { subject: 'Software Engineering', avg: 82, target: 75 },
        { subject: 'Data Wrangling', avg: 78, target: 75 },
        { subject: 'DSA', avg: 74, target: 75 },
        { subject: 'PS', avg: 72, target: 75 },
        { subject: 'OS', avg: 80, target: 75 }
    ],
    performanceOverTime: [
        { week: 'W1', avgScore: 68 },
        { week: 'W2', avgScore: 70 },
        { week: 'W3', avgScore: 69 },
        { week: 'W4', avgScore: 72 },
        { week: 'W5', avgScore: 75 }
    ],
    sentiment: [
        { emotion: 'Motivated', value: 45, fill: '#34A853' },
        { emotion: 'Stressed', value: 20, fill: '#EA4335' },
        { emotion: 'Confused', value: 15, fill: '#FBBC05' },
        { emotion: 'Bored', value: 10, fill: '#94A3B8' },
        { emotion: 'Curious', value: 10, fill: '#4285F4' }
    ]
};

// Generate 45 mock students for the roster
export const roster = Array.from({ length: 45 }, (_, i) => ({
    id: `stu-${i + 1}`,
    name: `Student ${i + 1}`,
    rollNo: String(i + 1).padStart(2, '0'),
    class: 'AIML 2nd Year',
    avgScore: Math.floor(Math.random() * (95 - 55 + 1) + 55),
    attendance: Math.floor(Math.random() * (100 - 85 + 1) + 85)
}));
