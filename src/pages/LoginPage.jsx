import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
    MdSchool,
    MdPerson,
    MdFamilyRestroom,
    MdArrowBack,
    MdLock,
    MdEmail,
    MdArrowForward,
    MdVerified,
} from 'react-icons/md';
import { toast } from 'react-toastify';

/* ─────────────────────────────────────────────────────
   Portal definitions — vibrant, rich, clear contrast
   with soothing pastel card backgrounds & glowing accents
───────────────────────────────────────────────────── */
const PORTALS = [
    {
        id: 'student',
        label: 'Student Portal',
        badge: 'Learner',
        desc: 'Submit assignments, receive AI feedback & track progress',
        icon: MdSchool,
        bgGradient: 'from-blue-50/90 via-sky-50/40 to-white',
        hoverBg: 'from-blue-100/90 via-sky-100/50 to-white',
        borderClass: 'border-blue-200/90 hover:border-blue-400',
        iconGradient: 'from-blue-500 to-indigo-600',
        iconShadow: '0 6px 18px rgba(37, 99, 235, 0.35)',
        badgeClass: 'bg-blue-100 text-blue-700 border border-blue-300 font-bold',
        accentColor: '#2563EB',
        accentGradient: 'from-blue-600 to-indigo-600',
        glowColor: 'rgba(37, 99, 235, 0.22)',
        lineGradient: 'from-blue-500 to-indigo-600',
        arrowColor: 'text-blue-600',
        demoBg: '#EFF6FF',
        demoBorder: '#BFDBFE',
        demoText: '#1D4ED8',
    },
    {
        id: 'teacher',
        label: 'Faculty & Teacher',
        badge: 'Educator',
        desc: 'Create assignments, review AI grades & monitor the class',
        icon: MdPerson,
        bgGradient: 'from-emerald-50/90 via-teal-50/40 to-white',
        hoverBg: 'from-emerald-100/90 via-teal-100/50 to-white',
        borderClass: 'border-emerald-200/90 hover:border-emerald-400',
        iconGradient: 'from-emerald-500 to-teal-600',
        iconShadow: '0 6px 18px rgba(5, 150, 105, 0.35)',
        badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold',
        accentColor: '#059669',
        accentGradient: 'from-emerald-600 to-teal-600',
        glowColor: 'rgba(5, 150, 105, 0.22)',
        lineGradient: 'from-emerald-500 to-teal-600',
        arrowColor: 'text-emerald-600',
        demoBg: '#ECFDF5',
        demoBorder: '#A7F3D0',
        demoText: '#047857',
    },
    {
        id: 'parent',
        label: 'Parent & Guardian',
        badge: 'Guardian',
        desc: "View child's marks, attendance & message faculty directly",
        icon: MdFamilyRestroom,
        bgGradient: 'from-amber-50/90 via-orange-50/40 to-white',
        hoverBg: 'from-amber-100/90 via-orange-100/50 to-white',
        borderClass: 'border-amber-200/90 hover:border-amber-400',
        iconGradient: 'from-amber-500 to-orange-500',
        iconShadow: '0 6px 18px rgba(217, 119, 6, 0.35)',
        badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold',
        accentColor: '#D97706',
        accentGradient: 'from-amber-600 to-orange-600',
        glowColor: 'rgba(217, 119, 6, 0.22)',
        lineGradient: 'from-amber-500 to-orange-500',
        arrowColor: 'text-amber-600',
        demoBg: '#FFFBEB',
        demoBorder: '#FDE68A',
        demoText: '#B45309',
    },
];

/* ─── Animation variants ─────────────────────────── */
const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const pageIn = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

const slideInRight = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

const slideInLeft = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: 30, transition: { duration: 0.25 } },
};

/* ─── Portal Card component ──────────────────────── */
function PortalCard({ portal, onSelect }) {
    const [hovered, setHovered] = useState(false);
    const Icon = portal.icon;

    return (
        <motion.button
            variants={cardVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.985, y: 0 }}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            onClick={() => onSelect(portal.id)}
            className={`w-full text-left relative flex items-center gap-4 px-5 py-4 rounded-2xl border ${portal.borderClass} transition-all duration-300 group overflow-hidden bg-gradient-to-r ${hovered ? portal.hoverBg : portal.bgGradient}`}
            style={{
                boxShadow: hovered
                    ? `0 10px 28px ${portal.glowColor}, 0 2px 8px rgba(0,0,0,0.04)`
                    : '0 2px 8px rgba(0,0,0,0.03)',
            }}
        >
            {/* Left color bar — vibrant and expands smoothly on hover */}
            <motion.div
                className={`absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-gradient-to-b ${portal.lineGradient}`}
                animate={{
                    scaleY: hovered ? 1 : 0.65,
                    opacity: hovered ? 1 : 0.85,
                }}
                transition={{ duration: 0.25 }}
            />

            {/* Glowing Icon Container */}
            <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${portal.iconGradient} text-white flex items-center justify-center shrink-0`}
                style={{ boxShadow: portal.iconShadow }}
                animate={hovered ? { scale: 1.08, rotate: -3 } : { scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
            >
                <Icon className="w-6 h-6 text-white drop-shadow-xs" />
            </motion.div>

            {/* Content with high-contrast, clear, readable text */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
                        {portal.label}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${portal.badgeClass}`}>
                        {portal.badge}
                    </span>
                </div>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {portal.desc}
                </p>
            </div>

            {/* Arrow with smooth hover slide */}
            <motion.div
                animate={hovered ? { x: 4, opacity: 1 } : { x: 0, opacity: 0.65 }}
                transition={{ duration: 0.2 }}
            >
                <MdArrowForward className={`w-5 h-5 ${portal.arrowColor} shrink-0`} />
            </motion.div>

            {/* Soothing shimmer reflection sweep */}
            <div className="absolute inset-0 rounded-2xl pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute inset-0"
                    animate={hovered
                        ? { backgroundPosition: ['200% 0', '-100% 0'] }
                        : { backgroundPosition: '200% 0' }}
                    transition={{ duration: 0.85, ease: 'easeInOut' }}
                    style={{
                        background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.7) 50%, transparent 65%)',
                        backgroundSize: '250% 100%',
                    }}
                />
            </div>
        </motion.button>
    );
}

/* ─── Main page ──────────────────────────────────── */
export default function LoginPage() {
    const [selectedRole, setSelectedRole] = useState(null);
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const portal = PORTALS.find(p => p.id === selectedRole);

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
        setLoginEmail(`${role}@demo.com`);
        setLoginPassword('demo123');
    };

    const handleBack = () => {
        setSelectedRole(null);
        setLoginEmail('');
        setLoginPassword('');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await login(selectedRole, loginEmail, loginPassword);
            if (!res.success) {
                toast.error(res.message || 'Invalid credentials.');
                setIsLoading(false);
            }
        } catch {
            toast.error('Connection error. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 relative z-10">
            <motion.div
                variants={pageIn}
                initial="hidden"
                animate="visible"
                className="w-full max-w-[430px] relative"
            >
                {/* ── Soothing multi-color ambient aura halo behind the card ── */}
                <div
                    aria-hidden="true"
                    className="absolute -inset-2 rounded-[36px] bg-gradient-to-r from-blue-400/35 via-indigo-400/30 to-purple-400/35 blur-2xl opacity-75 animate-pulse pointer-events-none"
                    style={{ animationDuration: '8s' }}
                />

                {/* ── The main card ── */}
                <div
                    className="relative rounded-3xl border border-white/80 overflow-hidden shadow-[0_12px_40px_rgba(15,23,42,0.08),_0_24px_70px_rgba(99,102,241,0.12)] bg-white/95 backdrop-blur-2xl"
                >
                    <AnimatePresence mode="wait">

                        {/* ════ STEP 1 — Portal Selector ════ */}
                        {!selectedRole && (
                            <motion.div
                                key="selector"
                                variants={slideInLeft}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="px-7 py-8 sm:px-9 sm:py-9"
                            >
                                {/* Header */}
                                <div className="mb-6">
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-bold mb-3 shadow-2xs">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" style={{ animationDuration: '3s' }} />
                                        <span>Unified Academic Portal</span>
                                    </div>
                                    <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">
                                        Welcome back
                                    </h1>
                                    <p className="text-sm text-slate-600 font-medium mt-1">
                                        Choose your portal to sign in
                                    </p>
                                </div>

                                {/* Cards */}
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="space-y-3.5"
                                >
                                    {PORTALS.map((p) => (
                                        <PortalCard
                                            key={p.id}
                                            portal={p}
                                            onSelect={handleRoleSelect}
                                        />
                                    ))}
                                </motion.div>

                                {/* Footer hint */}
                                <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold">
                                    <MdVerified className="w-4 h-4 text-emerald-500" />
                                    <span>Selecting a portal pre-fills demo credentials</span>
                                </div>
                            </motion.div>
                        )}

                        {/* ════ STEP 2 — Login Form ════ */}
                        {selectedRole && portal && (
                            <motion.div
                                key="form"
                                variants={slideInRight}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="px-7 py-8 sm:px-9 sm:py-9"
                            >
                                {/* Back row */}
                                <div className="flex items-center gap-3 mb-6">
                                    <motion.button
                                        whileHover={{ x: -3, scale: 1.05 }}
                                        whileTap={{ scale: 0.93 }}
                                        onClick={handleBack}
                                        className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                                    >
                                        <MdArrowBack className="w-5 h-5" />
                                    </motion.button>
                                    <div className="flex items-center gap-2.5">
                                        <div
                                            className={`w-9 h-9 rounded-xl bg-gradient-to-br ${portal.iconGradient} text-white flex items-center justify-center shadow-sm`}
                                        >
                                            {React.createElement(portal.icon, {
                                                className: 'w-5 h-5 text-white',
                                            })}
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-0.5">Signing in as</p>
                                            <p className="text-sm font-extrabold text-slate-800 leading-none">{portal.label}</p>
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-xl font-black text-slate-800 mb-4 tracking-tight">Sign In</h2>

                                {/* Demo chip */}
                                <div
                                    className="flex items-center justify-between px-4 py-3 rounded-xl mb-5 border shadow-2xs"
                                    style={{
                                        backgroundColor: portal.demoBg,
                                        borderColor: portal.demoBorder,
                                    }}
                                >
                                    <div>
                                        <p className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: portal.demoText }}>
                                            Demo credentials
                                        </p>
                                        <p className="text-xs text-slate-700 font-mono font-semibold mt-0.5">{loginEmail}</p>
                                    </div>
                                    <span
                                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg border"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            borderColor: portal.demoBorder,
                                            color: portal.demoText,
                                        }}
                                    >
                                        demo123
                                    </span>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleLoginSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input
                                                type="email"
                                                required
                                                value={loginEmail}
                                                onChange={e => setLoginEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 font-semibold transition-all"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                            <input
                                                type="password"
                                                required
                                                value={loginPassword}
                                                onChange={e => setLoginPassword(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none text-sm text-slate-800 font-semibold transition-all"
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        whileHover={{ y: -2, scale: 1.01 }}
                                        whileTap={{ scale: 0.98, y: 0 }}
                                        type="submit"
                                        disabled={isLoading}
                                        className={`w-full py-3 mt-1 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r ${portal.accentGradient} shadow-md`}
                                        style={{
                                            boxShadow: `0 6px 20px ${portal.glowColor}`,
                                        }}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin w-4 h-4 mr-1 text-white" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                </svg>
                                                Signing in…
                                            </>
                                        ) : (
                                            <>
                                                Continue to {portal.badge} <MdArrowForward className="w-4 h-4" />
                                            </>
                                        )}
                                    </motion.button>
                                </form>

                                <p className="text-center text-[11px] text-slate-400 font-medium mt-5 select-none">
                                    SmartGrade AI · PostgreSQL Database Verified
                                </p>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>

                {/* Subtle footer */}
                <p className="text-center text-[11px] text-slate-500 font-medium mt-4 select-none">
                    UN SDG 4 Aligned · Groq AI Powered
                </p>
            </motion.div>
        </div>
    );
}