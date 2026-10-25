import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import StatCard from '../../components/StatCard';
import { MdPeople, MdAssignmentTurnedIn, MdPendingActions, MdScore, MdTimer, MdWarning, MdPublic, MdArrowForward } from 'react-icons/md';
import { teacherStats, recentActivity } from '../../data/mockTeacherData';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/apiConfig';

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const slideRight = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
};

export default function TeacherDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/assignments`);
                const data = await res.json();
                if (data.success) setAssignments(data.data);
            } catch (err) {
                console.warn('⚠️ Backend unreachable, using mock data for teacher dashboard.');
            }
        };
        fetchTeacherData();
    }, []);

    const handleComingSoon = () => {
        toast.info('🚀 Feature coming soon!');
    };

    return (
        <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6 max-w-7xl mx-auto pt-2"
        >
            {/* Faculty Welcome Banner — clean, light, airy */}
            <motion.div
                variants={fadeUp}
                className="rounded-2xl px-7 py-6 flex items-center gap-5 bg-white border border-slate-100"
                style={{
                    background: 'linear-gradient(135deg, #f0fdf4 0%, #f7fbf8 50%, #f0f4ff 100%)',
                }}
            >
                <motion.img
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Teacher')}&background=d1fae5&color=065f46`}
                    alt="Avatar"
                    className="w-14 h-14 rounded-2xl border border-slate-200 object-cover shadow-sm hidden sm:block"
                />
                <div className="flex-1 min-w-0">
                    <motion.p variants={slideRight} className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Faculty Portal · Active Term
                    </motion.p>
                    <motion.h1 variants={slideRight} className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
                        Good morning, {user?.name || 'Professor'}! 👩‍🏫
                    </motion.h1>
                    <motion.p variants={slideRight} className="text-sm text-slate-500 mt-0.5">
                        Overview of your class submissions and AI-graded assessments.
                    </motion.p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate('/teacher/assignments')}
                    className="hidden sm:flex items-center gap-1.5 shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all"
                    style={{ background: 'linear-gradient(135deg, #6b9f8e, #5a8f7e)' }}
                >
                    New Assignment <MdArrowForward />
                </motion.button>
            </motion.div>

            {/* AI Time Saved — soft info panel */}
            <motion.div 
                variants={fadeUp} 
                whileHover={{ scale: 1.005 }}
                className="flex items-center gap-4 p-4 rounded-xl border border-sky-100 bg-sky-50/50"
            >
                <div className="p-2.5 rounded-xl text-white shadow-sm shrink-0" style={{ background: 'linear-gradient(135deg, #6ba3c2, #5a93b2)' }}>
                    <MdTimer className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <span className="font-semibold text-slate-700 text-sm">AI Grading Saved You Time This Week</span>
                    <p className="text-slate-500 text-xs mt-0.5">
                        Automated rubric checking saved <strong className="text-slate-700">4.2 hours</strong> of manual grading — keep publishing assignments!
                    </p>
                </div>
            </motion.div>

            {/* Stats Grid — with staggered entrance */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <StatCard
                    title="Enrolled Students"
                    value={teacherStats?.totalStudents || 32}
                    icon={<MdPeople className="w-5 h-5" />}
                    colorClass="text-blue-600" 
                    bgClass="bg-blue-50 border-blue-100"
                />
                <StatCard
                    title="Active Assignments"
                    value={assignments.length || 8}
                    icon={<MdAssignmentTurnedIn className="w-5 h-5" />}
                    trend={100}
                    colorClass="text-emerald-600" 
                    bgClass="bg-emerald-50 border-emerald-100"
                />
                <StatCard
                    title="Pending Review"
                    value={teacherStats?.pendingReview || 5}
                    icon={<MdPendingActions className="w-5 h-5" />}
                    colorClass="text-indigo-600" 
                    bgClass="bg-indigo-50 border-indigo-100"
                />
                <StatCard
                    title="Class Average"
                    value={`${teacherStats?.classAverage || 85}%`}
                    icon={<MdScore className="w-5 h-5" />}
                    trend={4}
                    colorClass="text-sky-600" 
                    bgClass="bg-sky-50 border-sky-100"
                />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Class Activity Feed */}
                <motion.div variants={fadeUp} className="lg:col-span-2 glass-card p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Recent Class Activity</h2>
                            <p className="text-xs text-slate-400">Live submission updates and student check-ins</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleComingSoon}
                            className="text-xs font-semibold text-slate-500 hover:text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl transition-colors"
                        >
                            View All
                        </motion.button>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-7 top-4 bottom-4 w-0.5 bg-slate-100 rounded-full"></div>

                        <div className="space-y-5">
                            {recentActivity.map((activity, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                    key={activity.id} 
                                    className="relative flex gap-5 items-start pl-3 group"
                                >
                                    <motion.div 
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.4 + index * 0.1, type: "spring", stiffness: 300 }}
                                        className="absolute left-0 w-6 h-6 rounded-full bg-white border-[2.5px] border-emerald-400 mt-1.5 z-10 shadow-sm"
                                    />
                                    <motion.div 
                                        whileHover={{ y: -2, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                                        className="bg-white p-4 rounded-xl border border-slate-100 flex-1 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start gap-3">
                                            <div>
                                                <p className="text-slate-600 text-sm">
                                                    <span className="font-bold text-slate-800">{activity.student}</span>
                                                    {' '}
                                                    {activity.error ? (
                                                        <span className="text-rose-500 font-semibold text-xs flex items-center gap-1 inline-flex"><MdWarning /> flagged for manual review</span>
                                                    ) : (
                                                        <>&nbsp;{activity.action === 'submitted' ? 'submitted' : 'viewed feedback for'}</>
                                                    )}
                                                    {' '}
                                                    <span className="font-semibold text-slate-700">{activity.assignment}</span>
                                                </p>
                                                <span className="text-[11px] font-medium text-slate-400 mt-1 block">{activity.time}</span>
                                            </div>
                                            {activity.grade && (
                                                <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg font-bold text-sm bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                                                    {activity.grade}
                                                </span>
                                            )}
                                            {activity.error && (
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleComingSoon} 
                                                    className="text-rose-500 border border-rose-200 bg-rose-50 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-rose-100 transition-colors shrink-0"
                                                >
                                                    Grade Manually
                                                </motion.button>
                                            )}
                                        </div>
                                    </motion.div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions & Smart Insights */}
                <motion.div variants={staggerContainer} className="space-y-5">
                    <motion.div variants={fadeUp} className="glass-card p-6">
                        <h2 className="text-base font-bold text-slate-800 mb-4 tracking-tight">Quick Actions</h2>
                        <div className="space-y-2.5">
                            <motion.button 
                                whileHover={{ x: 4, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/teacher/assignments')} 
                                className="w-full text-left px-4 py-3 rounded-xl bg-emerald-50/70 hover:bg-emerald-50 text-emerald-700 font-semibold text-sm transition-all border border-emerald-100 flex items-center justify-between"
                            >
                                <span>+ Create New Assignment</span>
                                <MdArrowForward className="w-4 h-4 text-emerald-500" />
                            </motion.button>
                            <motion.button 
                                whileHover={{ x: 4, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleComingSoon} 
                                className="w-full text-left px-4 py-3 rounded-xl bg-blue-50/70 hover:bg-blue-50 text-blue-700 font-semibold text-sm transition-all border border-blue-100 flex items-center justify-between"
                            >
                                <span>✉️ Message Parents</span>
                                <MdArrowForward className="w-4 h-4 text-blue-500" />
                            </motion.button>
                            <motion.button 
                                whileHover={{ x: 4, scale: 1.01 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/teacher/reports')} 
                                className="w-full text-left px-4 py-3 rounded-xl border border-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all bg-white flex items-center justify-between"
                            >
                                <span>📊 Generate Term Report</span>
                                <MdArrowForward className="w-4 h-4 text-slate-400" />
                            </motion.button>
                        </div>
                    </motion.div>

                    {/* Smart Insights — LIGHT card, no more dark amber */}
                    <motion.div 
                        variants={fadeUp}
                        whileHover={{ y: -3 }}
                        className="rounded-2xl p-5 border border-blue-100 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 relative overflow-hidden"
                    >
                        <div className="absolute right-3 bottom-2 text-5xl opacity-10">💡</div>
                        <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                            Smart Faculty Insights
                        </h3>
                        <p className="text-slate-500 text-xs mb-4 leading-relaxed">
                            Based on recent submissions, <strong className="text-slate-700 bg-blue-100 px-1.5 py-0.5 rounded border border-blue-200">15 students</strong> are having difficulty with "Directional Derivatives". Consider scheduling a brief revision segment.
                        </p>
                        <motion.button 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleComingSoon} 
                            className="text-xs font-semibold text-blue-700 bg-blue-100/80 border border-blue-200 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors w-full"
                        >
                            Generate Revision Outline
                        </motion.button>
                    </motion.div>

                    {/* SDG 4 Alignment — LIGHT card, no more dark navy */}
                    <motion.div 
                        variants={fadeUp}
                        whileHover={{ y: -3 }}
                        className="rounded-2xl p-5 border border-emerald-100 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/50 flex flex-col gap-3 relative overflow-hidden"
                    >
                        <div className="flex items-center gap-3 relative z-10">
                            <div className="p-2.5 bg-emerald-100 rounded-xl border border-emerald-200">
                                <MdPublic className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-800 tracking-tight">UN SDG 4 Aligned</h3>
                                <p className="text-[11px] text-slate-400">Quality Education Standard</p>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                SmartGrade AI adheres to non-biased scoring and accessible rubric design.
                            </p>
                            <motion.button 
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleComingSoon} 
                                className="w-full text-xs font-semibold text-emerald-700 border border-emerald-200 bg-emerald-100/60 px-3 py-2 rounded-xl hover:bg-emerald-100 transition-all"
                            >
                                View Compliance Metrics
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.div>
    );
}