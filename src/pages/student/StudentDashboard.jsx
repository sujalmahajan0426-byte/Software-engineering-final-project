import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import {
    MdAssignmentTurnedIn,
    MdPendingActions,
    MdBadge,
    MdArrowForward,
    MdAccessTime,
    MdSchool,
    MdLocalFireDepartment,
    MdInbox,
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/apiConfig';

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function StudentDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAssignments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/assignments`);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) setAssignments(data.data);
        } catch {
            // Backend unreachable — keep empty
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
        const iv = setInterval(fetchAssignments, 15000);
        return () => clearInterval(iv);
    }, []);

    const handleComingSoon = () => toast.info('🚀 Feature coming soon!');

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-5 max-w-7xl mx-auto pt-2"
        >
            {/* ── Welcome Banner ── clean, light, human ── */}
            <motion.div
                variants={fadeUp}
                whileHover={{ scale: 1.003 }}
                className="rounded-2xl px-7 py-6 flex items-center gap-5 border border-slate-200/80 animate-glow"
                style={{
                    background: 'linear-gradient(135deg, #f0f4ff 0%, #f7fbf8 50%, #fdfaf5 100%)',
                }}
            >
                <motion.img
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Student')}&background=dbeafe&color=1e40af`}
                    alt="Avatar"
                    className="w-14 h-14 rounded-2xl border border-slate-200 object-cover shadow-sm hidden sm:block"
                />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        B.Tech Computer Science • 2nd Year
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                        Hello, {user?.name || 'Student'} 👋
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                        {assignments.length > 0
                            ? <><strong className="text-slate-700">{assignments.length} assignment{assignments.length > 1 ? 's' : ''}</strong> waiting for your submission.</>
                            : 'No pending assignments right now. Great work!'}
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.06, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/student/submit')}
                    className="btn-primary hidden sm:flex items-center gap-1.5 shrink-0"
                >
                    Submit Work <MdArrowForward />
                </motion.button>
            </motion.div>

            {/* ── Stat Cards ── */}
            <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Active Assignments"
                    value={assignments.length}
                    icon={<MdAssignmentTurnedIn className="w-5 h-5" />}
                    trend={assignments.length > 0 ? 100 : 0}
                    colorClass="text-blue-600"
                    bgClass="bg-blue-50 border-blue-100"
                />
                <StatCard
                    title="Attendance"
                    value="84%"
                    icon={<MdSchool className="w-5 h-5" />}
                    trend={4}
                    colorClass="text-emerald-600"
                    bgClass="bg-emerald-50 border-emerald-100"
                />
                <StatCard
                    title="Evaluated"
                    value={2}
                    icon={<MdPendingActions className="w-5 h-5" />}
                    colorClass="text-indigo-600"
                    bgClass="bg-indigo-50 border-indigo-100"
                />
                <StatCard
                    title="Badges"
                    value={5}
                    icon={<MdBadge className="w-5 h-5" />}
                    colorClass="text-teal-600"
                    bgClass="bg-teal-50 border-teal-100"
                />
            </motion.div>

            {/* ── Assigned Coursework ── */}
            <motion.div variants={fadeUp} className="glass-card p-6">
                <div className="flex items-center justify-between gap-3 mb-5">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            Assigned Coursework
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                                Live
                            </span>
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">Assignments published by faculty, graded by Groq Vision AI</p>
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/student/submit')} 
                        className="btn-primary flex items-center gap-1.5 shrink-0"
                    >
                        Submit Assignment <MdArrowForward />
                    </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignments.length > 0 ? (
                        assignments.map((a) => (
                            <motion.div
                                key={a.id}
                                whileHover={{ y: -3 }}
                                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                className="flex flex-col justify-between p-4 rounded-xl border border-slate-200/80 bg-white shadow-xs hover:shadow-md hover:border-slate-300 transition-shadow"
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                            {a.subject}
                                        </span>
                                        <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                            <MdAccessTime className="w-3 h-3" />
                                            {a.dueDate ? new Date(a.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Due soon'}
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">{a.title}</h3>
                                    <p className="text-xs text-slate-400 line-clamp-2 mb-2 leading-relaxed">
                                        {a.question || 'Answer the prompt using text or upload handwritten notes for AI review.'}
                                    </p>
                                    {a.questionImage && (
                                        <div className="mb-3 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                                            📷 Question image attached
                                        </div>
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => navigate('/student/submit', { state: { selectedAssignmentId: a.id } })}
                                    className="w-full py-2 rounded-lg bg-slate-50 hover:bg-slate-800 hover:text-white border border-slate-200 text-xs font-semibold text-slate-600 transition-all"
                                >
                                    Solve & Submit →
                                </motion.button>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-3 text-center py-10 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <p className="text-slate-500 text-sm font-medium">No pending assignments right now.</p>
                            <p className="text-xs text-slate-400 mt-1">New ones will appear here instantly when faculty publishes them.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* ── Feedback & Quick Actions ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Recent AI Feedback */}
                <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-base font-bold text-slate-800">Recent AI Feedback</h2>
                            <p className="text-xs text-slate-400">Your latest assignment evaluations</p>
                        </div>
                        <button onClick={() => navigate('/student/feedback')} className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                            View All
                        </button>
                    </div>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
                            <MdInbox className="w-7 h-7 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">No feedback yet</p>
                        <p className="text-xs text-slate-400 mt-1 max-w-xs">Submit an assignment and Groq AI will evaluate it instantly with detailed feedback, score & suggestions.</p>
                        <motion.button
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/student/submit')}
                            className="btn-primary mt-4 text-xs px-4 py-2"
                        >
                            Submit Your First Assignment →
                        </motion.button>
                    </div>
                </motion.div>

                {/* Quick Info */}
                <motion.div variants={fadeUp} className="glass-card p-6">
                    <h2 className="text-base font-bold text-slate-800 mb-4">How It Works</h2>
                    <div className="space-y-3">
                        {[
                            { step: '1', text: 'Teacher publishes an assignment', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                            { step: '2', text: 'You type or upload handwritten answer', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                            { step: '3', text: 'Groq AI grades it with vision', color: 'bg-indigo-50 text-indigo-700 border-indigo-100' },
                            { step: '4', text: 'Get score, feedback & tips instantly', color: 'bg-teal-50 text-teal-700 border-teal-100' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black border ${item.color}`}>
                                    {item.step}
                                </div>
                                <p className="text-xs text-slate-600">{item.text}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}