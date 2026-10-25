import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import AnimatedCounter from '../components/AnimatedCounter';
import { MdSpeed, MdAutoGraph, MdDashboardCustomize, MdPublic, MdArrowForward } from 'react-icons/md';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.12 }
    }
};

export default function LandingPage() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 100]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -50]);

    return (
        <div className="flex flex-col min-h-screen relative overflow-hidden bg-transparent">
            {/* Hero Section */}
            <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-28 flex flex-col items-center text-center px-4 sm:px-6">
                <motion.div 
                    initial="hidden" 
                    animate="visible" 
                    variants={staggerContainer}
                    className="max-w-4xl mx-auto relative z-10"
                >
                    <motion.div variants={fadeUp} className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-800 text-xs font-bold tracking-wide mb-6 shadow-xs">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-60"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Next-Generation Academic Platform
                    </motion.div>

                    <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.08] mb-6">
                        Grade Smarter.<br/>
                        <span className="text-gradient">Teach Better.</span><br/>
                        Learn Faster.
                    </motion.h1>

                    <motion.p variants={fadeUp} className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
                        SmartGrade AI automates assignment assessment and delivers individualized rubrics to every student in under <span className="font-extrabold text-slate-800 underline decoration-blue-300/70">60 seconds</span>.
                    </motion.p>

                    <motion.div variants={fadeUp} className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link to="/login" className="btn-primary text-base px-8 py-3.5 shadow-md flex items-center gap-2">
                            Explore Live Demo
                            <MdArrowForward className="w-5 h-5" />
                        </Link>
                        <button 
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} 
                            className="btn-secondary text-base px-8 py-3.5"
                        >
                            Explore Architecture
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Live Stats Bar */}
            <motion.section 
                style={{ y: y2 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="relative z-20 mx-4 md:mx-auto max-w-5xl w-full"
            >
                <div className="glass-panel rounded-3xl p-6 sm:p-10 overflow-hidden relative bg-white/85">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:divide-x divide-slate-200/80 relative z-10">
                        <div className="text-center px-3">
                            <h3 className="text-3xl sm:text-4xl font-black text-slate-900 mb-1">
                                <AnimatedCounter end={60} suffix="s" duration={1200} />
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg Grading Time</p>
                        </div>
                        <div className="text-center px-3">
                            <h3 className="text-3xl sm:text-4xl font-black text-emerald-700 mb-1">
                                <AnimatedCounter end={65} suffix="%" duration={1400} />
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Faculty Time Saved</p>
                        </div>
                        <div className="text-center px-3">
                            <h3 className="text-3xl sm:text-4xl font-black text-blue-700 mb-1">
                                <AnimatedCounter end={250} suffix="k+" duration={1600} />
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Submissions Evaluated</p>
                        </div>
                        <div className="text-center px-3">
                            <h3 className="text-3xl sm:text-4xl font-black text-emerald-600 mb-1">
                                <AnimatedCounter end={100} suffix="%" duration={1000} />
                            </h3>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rubric Consistency</p>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Features Section */}
            <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight"
                    >
                        Engineered for High-Trust Academic Institutions
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-base text-slate-600 max-w-2xl mx-auto font-normal"
                    >
                        Bridging high class sizes with individualized, respectful feedback.
                    </motion.p>
                </div>

                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-80px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <motion.div variants={fadeUp} className="glass-card p-7 group relative overflow-hidden bg-white/80">
                        <div className="w-14 h-14 bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-xs">
                            <MdSpeed className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Automated Rubric Review</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            Submit typed answers or text formulations and have them analyzed against granular grading criteria in seconds.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="glass-card p-7 group relative overflow-hidden bg-white/80">
                        <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-xs">
                            <MdAutoGraph className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Constructive Insights</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            Beyond numerical marks, Gemini AI provides targeted points of commendation and concrete improvement hints.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="glass-card p-7 group relative overflow-hidden bg-white/80">
                        <div className="w-14 h-14 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 shadow-xs">
                            <MdDashboardCustomize className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">Live Progress Telemetry</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            Real-time analytics allow educators to spot learning gaps and at-risk trajectories before midterm milestones.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeUp} className="glass-card p-7 group relative overflow-hidden bg-white/80">
                        <div className="w-14 h-14 bg-sky-50 border border-sky-200 text-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shadow-xs">
                            <MdPublic className="w-7 h-7" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">UN SDG 4 Aligned</h3>
                        <p className="text-xs text-slate-500 leading-relaxed font-normal">
                            Designed to meet standards for equitable, inclusive, and verifiable education with no hallucinated penalties.
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* How It Works Section */}
            <motion.section style={{ y: y1 }} className="py-20 relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <motion.h2 
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-3xl sm:text-4xl font-black text-slate-900 mb-2 tracking-tight"
                        >
                            How SmartGrade Functions
                        </motion.h2>
                        <p className="text-sm text-slate-500">From prompt issuance to instant objective scoring</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "1",
                                title: "Faculty Creates Task",
                                desc: "Professors post assignments with question prompts and rubric notes, instantly stored in PostgreSQL.",
                                badge: "Faculty Setup"
                            },
                            {
                                step: "2",
                                title: "Student Submits & AI Grades",
                                desc: "Students submit answers. Google Gemini processes the rubric and generates scores with detailed advice.",
                                badge: "AI Evaluation"
                            },
                            {
                                step: "3",
                                title: "Instant Notification & Sync",
                                desc: "Scores appear instantly in the student dashboard and parents receive performance summaries in real time.",
                                badge: "Closed Loop"
                            }
                        ].map((s, idx) => (
                            <motion.div 
                                key={idx}
                                variants={fadeUp} 
                                className="glass-card p-6 sm:p-7 text-center flex flex-col items-center bg-white/85"
                            >
                                <div className="w-12 h-12 rounded-2xl text-white font-black text-lg flex items-center justify-center mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #6b9bd2, #5a8ac2)' }}>
                                    {s.step}
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full mb-2">
                                    {s.badge}
                                </span>
                                <h4 className="text-base font-bold text-slate-900 mb-2">{s.title}</h4>
                                <p className="text-xs text-slate-500 font-normal leading-relaxed">{s.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>
        </div>
    );
}