import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import ScoreMeter from '../../components/ScoreMeter';
import { MdCheckCircle, MdWarning, MdArrowBack, MdDownload, MdFormatQuote, MdLightbulb, MdMenuBook, MdMood, MdExplore, MdTrendingDown, MdRoute } from 'react-icons/md';

export default function GradingResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const { result, subject, question } = location.state || {};

    if (location.state?.error) {
        return (
            <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-20 animate-fade-in text-center">
                <div className="w-24 h-24 bg-red-100 text-brand-red rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white">
                    <MdWarning className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Unreadable Handwriting Detected</h2>
                <p className="text-lg text-slate-600 mb-8 max-w-xl">
                    SmartGrade AI is having a difficult time parsing the words in your uploaded file. To ensure you get an accurate grade, we have flagged this assignment and sent it directly to your teacher for <strong>Manual Review</strong>.
                </p>
                <div className="bg-yellow-50 border border-brand-yellow/30 rounded-xl p-4 mb-8 text-left max-w-lg">
                    <h4 className="font-bold text-yellow-800 flex items-center gap-2"><MdLightbulb /> Tips for Next Time</h4>
                    <ul className="text-yellow-700 text-sm mt-2 ml-6 list-disc">
                        <li>Ensure there is plenty of light when taking the photo.</li>
                        <li>Write slightly larger and leave clear spaces between words.</li>
                        <li>Make sure the paper is flat and the camera is steady.</li>
                    </ul>
                </div>
                <Link to="/student/submit" className="btn-secondary flex items-center gap-2">
                    <MdArrowBack /> Try Uploading a Clearer Photo
                </Link>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">No results found</h2>
                <Link to="/student/submit" className="btn-primary">Go Back to Submit</Link>
            </div>
        );
    }

    // Determine Grade Badge styling
    let badgeColor = "bg-green-100 text-green-700 border-green-200";
    if (result.score < 50) badgeColor = "bg-red-100 text-red-700 border-red-200";
    else if (result.score < 75) badgeColor = "bg-yellow-100 text-yellow-700 border-yellow-200";

    return (
        <div className="max-w-5xl mx-auto animate-fade-in pb-12">
            <button
                onClick={() => navigate('/student/submit')}
                className="flex items-center gap-1 text-slate-500 hover:text-brand-blue font-medium mb-6 transition-colors"
            >
                <MdArrowBack /> Back to Assignments
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">AI Grading Report</h1>
                    <p className="text-lg text-slate-600 font-medium">{subject} • {question}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    {result.emotion_tone && (
                        <div className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
                            <MdMood className="w-4 h-4" /> {result.emotion_tone}
                        </div>
                    )}
                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-500">
                        <svg className="w-4 h-4 text-brand-blue" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                        Graded in {result.time_to_complete || '< 60 seconds'}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-8">
                {/* Score Card */}
                <div className="md:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center text-center h-full">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Final Score</h3>
                    <ScoreMeter score={result.score} />

                    <div className="mt-8 flex flex-col items-center gap-2">
                        <span className="text-sm text-slate-500 font-medium">Grade Equivalent</span>
                        <div className={`text-2xl font-bold px-6 py-2 rounded-xl border-2 ${badgeColor}`}>
                            {result.grade}
                        </div>
                    </div>
                </div>

                {/* Detailed Feedback */}
                <div className="md:col-span-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-8 relative overflow-hidden h-full flex flex-col justify-center">
                    {/* Quote icon background mark */}
                    <MdFormatQuote className="absolute -top-4 -right-4 w-32 h-32 text-blue-500/10 transform rotate-12" />

                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center">🤖</span>
                        Teacher's Assistant AI Feedback
                    </h3>
                    <p className="text-slate-700 leading-relaxed italic text-lg relative z-10 whitespace-pre-wrap">
                        "{result.detailed_feedback || result.feedback || 'Great effort! Your assignment has been evaluated.'}"
                    </p>
                </div>
            </div>

            {/* AI Deep Analysis Section */}
            {(result.knowledge_gaps || result.weak_topics || result.learning_path) && (
                <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <MdExplore className="text-brand-blue" />
                        AI Performance Analysis
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">

                        {/* Knowledge Gaps & Weak Topics */}
                        <div className="md:col-span-1 space-y-6">
                            {result.knowledge_gaps && (
                                <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
                                    <h4 className="font-bold text-red-800 flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                                        <MdWarning /> Knowledge Gaps
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.knowledge_gaps.map((gap, i) => (
                                            <li key={i} className="text-sm text-red-900 bg-white/60 px-3 py-2 rounded-lg font-medium shadow-sm">
                                                {gap}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {result.weak_topics && (
                                <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl">
                                    <h4 className="font-bold text-orange-800 flex items-center gap-2 mb-3 text-sm uppercase tracking-wider">
                                        <MdTrendingDown /> Weak Topics
                                    </h4>
                                    <ul className="space-y-2">
                                        {result.weak_topics.map((topic, i) => (
                                            <li key={i} className="text-sm text-orange-900 bg-white/60 px-3 py-2 rounded-lg font-medium shadow-sm">
                                                {topic}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Learning Path Suggestions */}
                        {result.learning_path && (
                            <div className="md:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-indigo-100 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 rounded-2xl pointer-events-none" />
                                <MdRoute className="absolute -right-4 -bottom-4 w-32 h-32 text-indigo-200/40" />
                                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 relative">
                                    <span className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">🗺️</span>
                                    Suggested Learning Path
                                </h3>

                                <div className="relative border-l-2 border-indigo-200 ml-4 space-y-6 pb-2">
                                    <div className="relative pl-6">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 bg-blue-400 rounded-full border-4 border-white"></div>
                                        <h4 className="font-bold text-blue-600 text-sm uppercase tracking-wider mb-1">Step 1: Review</h4>
                                        <p className="text-slate-600">{result.learning_path.step1}</p>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 bg-amber-400 rounded-full border-4 border-white"></div>
                                        <h4 className="font-bold text-amber-600 text-sm uppercase tracking-wider mb-1">Step 2: Practice</h4>
                                        <p className="text-slate-600">{result.learning_path.step2}</p>
                                    </div>

                                    <div className="relative pl-6">
                                        <div className="absolute -left-[9px] top-1 w-4 h-4 bg-emerald-400 rounded-full border-4 border-white"></div>
                                        <h4 className="font-bold text-emerald-600 text-sm uppercase tracking-wider mb-1">Step 3: Master</h4>
                                        <p className="text-slate-600">{result.learning_path.step3}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Strengths */}
                <div className="bg-white rounded-2xl shadow-sm border border-green-200 p-6">
                    <h3 className="text-lg font-bold text-brand-green mb-4 flex items-center gap-2">
                        <MdCheckCircle className="w-6 h-6" /> What You Did Well
                    </h3>
                    <ul className="space-y-3">
                        {result.strengths?.map((item, idx) => (
                            <li key={idx} className="flex gap-3 text-slate-700 items-start">
                                <span className="text-brand-green mt-1">●</span>
                                <span className="leading-snug">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-white rounded-2xl shadow-sm border border-orange-200 p-6">
                    <h3 className="text-lg font-bold text-brand-yellow mb-4 flex items-center gap-2">
                        <MdWarning className="w-6 h-6" /> Areas to Improve
                    </h3>
                    <ul className="space-y-3">
                        {result.weaknesses?.map((item, idx) => (
                            <li key={idx} className="flex gap-3 text-slate-700 items-start">
                                <span className="text-brand-yellow mt-1">●</span>
                                <span className="leading-snug">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
                {/* Improvement Tips */}
                <div className="bg-white rounded-2xl shadow-sm border border-purple-200 p-6">
                    <h3 className="text-lg font-bold text-purple-600 mb-4 flex items-center gap-2">
                        <MdLightbulb className="w-6 h-6" /> Actionable Tips
                    </h3>
                    <ol className="space-y-4">
                        {(result.improvement_tips || result.tips || []).map((tip, idx) => (
                            <li key={idx} className="flex gap-4 items-start">
                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold mt-0.5">
                                    {idx + 1}
                                </span>
                                <span className="text-slate-700">{tip}</span>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* Next Topics */}
                <div className="flex flex-col gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-teal-200 p-6 flex-1">
                        <h3 className="text-lg font-bold text-teal-600 mb-4 flex items-center gap-2">
                            <MdMenuBook className="w-6 h-6" /> Recommended Reading
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {(result.recommended_topics || result.topics || []).map((topic, idx) => (
                                <span key={idx} className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg text-sm font-semibold border border-teal-100">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Encouragement Banner */}
                    <div className="bg-brand-blue text-white rounded-2xl p-6 shadow-md shadow-blue-500/20 text-center flex-1 flex flex-col justify-center">
                        <p className="text-xl font-medium">"{result.encouragement_message}"</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-slate-200">
                <Link to="/student/submit" className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center">
                    Submit Another Answer
                </Link>
                <button className="btn-primary flex items-center gap-2 w-full sm:w-auto justify-center group" onClick={() => window.print()}>
                    <MdDownload className="w-5 h-5 group-hover:animate-bounce" /> Print / Download Report
                </button>
            </div>

            <div className="mt-12 text-center text-xs text-slate-400 font-medium">
                Powered by Google Gemini AI
            </div>
        </div>
    );
}