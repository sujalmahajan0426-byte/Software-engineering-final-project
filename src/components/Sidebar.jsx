import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    MdDashboard, MdAssignment, MdFeedback, MdTrendingUp,
    MdBadge, MdLanguage, MdPeople, MdAnalytics, MdWarning,
    MdMessage, MdNotifications, MdInsertChartOutlined, MdCalendarToday
} from 'react-icons/md';

const getLinks = (role) => {
    switch (role) {
        case 'student':
            return [
                { path: '/student', label: 'Dashboard', icon: <MdDashboard /> },
                { path: '/student/submit', label: 'Submit Assignment', icon: <MdAssignment /> },
                { path: '/student/feedback', label: 'My Feedback', icon: <MdFeedback /> },
                { path: '/student/progress', label: 'My Progress', icon: <MdTrendingUp /> },
                { path: '/student/attendance', label: 'My Attendance', icon: <MdCalendarToday /> },
                { path: '/student/badges', label: 'My Badges', icon: <MdBadge /> },
                { path: '/student/language', label: 'Language Settings', icon: <MdLanguage /> },
            ];
        case 'teacher':
            return [
                { path: '/teacher', label: 'Dashboard', icon: <MdDashboard /> },
                { path: '/teacher/assignments', label: 'Assignments', icon: <MdAssignment /> },
                { path: '/teacher/students', label: 'My Students', icon: <MdPeople /> },
                { path: '/teacher/analytics', label: 'Class Analytics', icon: <MdAnalytics /> },
                { path: '/teacher/at-risk', label: 'At-Risk Students', icon: <MdWarning /> },
                { path: '/teacher/messages', label: 'Parent Messages', icon: <MdMessage /> },
                { path: '/teacher/reports', label: 'Reports', icon: <MdInsertChartOutlined /> },
            ];
        case 'parent':
            return [
                { path: '/parent', label: 'Dashboard', icon: <MdDashboard /> },
                { path: '/parent/progress', label: 'Child Progress', icon: <MdTrendingUp /> },
                { path: '/parent/attendance', label: 'Child Attendance', icon: <MdCalendarToday /> },
                { path: '/parent/feedback', label: 'Recent Feedback', icon: <MdFeedback /> },
                { path: '/parent/notifications', label: 'Notifications', icon: <MdNotifications /> },
                { path: '/parent/message', label: 'Message Teacher', icon: <MdMessage /> },
            ];
        default:
            return [];
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
};

const slideRight = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0 }
};

export default function Sidebar({ role }) {
    const links = getLinks(role);

    const getThemeClass = (isActive) => {
        if (!isActive) return "text-slate-600 hover:bg-slate-50 hover:text-slate-900";
        if (role === 'student') return "bg-blue-50 text-blue-700 shadow-xs font-bold border-l-4 border-blue-500";
        if (role === 'teacher') return "bg-emerald-50 text-emerald-700 shadow-xs font-bold border-l-4 border-emerald-500";
        if (role === 'parent') return "bg-indigo-50 text-indigo-700 shadow-xs font-bold border-l-4 border-indigo-500";
        return "bg-slate-50 text-slate-900 font-bold border-l-4 border-slate-700";
    };

    return (
        <aside className="w-64 hidden md:block h-full shrink-0 relative z-10 pt-4">
            <div className="sticky top-[96px] h-[calc(100vh-120px)] p-4 pr-0">
                <div className="glass-panel h-full rounded-2xl rounded-r-none overflow-hidden shadow-xs bg-white/80">
                    <motion.nav 
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                        className="p-3 space-y-1.5 mt-2 overflow-y-auto h-full"
                    >
                        {links.map((link) => (
                            <motion.div key={link.path} variants={slideRight}>
                                <NavLink
                                    to={link.path}
                                    end={link.path === `/${role}`}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-200 ${getThemeClass(isActive)}`
                                    }
                                >
                                    <span className="text-xl transition-transform duration-200 group-hover:scale-105">{link.icon}</span>
                                    <span className="tracking-wide text-sm font-semibold">{link.label}</span>
                                </NavLink>
                            </motion.div>
                        ))}
                    </motion.nav>
                </div>
            </div>
        </aside>
    );
}