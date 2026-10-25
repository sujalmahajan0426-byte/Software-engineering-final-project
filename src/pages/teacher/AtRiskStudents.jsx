import React, { useState } from 'react';
import { atRiskStudents } from '../../data/mockTeacherData';
import { MdWarning, MdTrendingDown, MdSend, MdTrendingFlat, MdTrendingUp } from 'react-icons/md';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/apiConfig';

export default function AtRiskStudents() {
    const [notified, setNotified] = useState({});

    const notifyParent = async (id, student) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/messages/alert-parent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentName: student.name,
                    subject: student.subject,
                    score: student.score,
                    trend: student.trend
                })
            });
            if (res.ok) {
                toast.success(`⚠️ Alert sent to ${student.name}'s parents. Notification posted!`);
                setNotified({ ...notified, [id]: true });
            } else {
                toast.error('Failed to send alert');
            }
        } catch (err) {
            console.error('Alert error:', err);
            toast.error('Could not connect to server');
        }
    };

    const handleComingSoon = () => toast.info('🚀 Feature coming soon!');

    return (
        <div className="max-w-6xl mx-auto animate-fade-in relative pb-10 space-y-6">

            {/* Alert Banner */}
            <div className="bg-red-50 border-l-4 border-brand-red p-6 rounded-r-xl shadow-sm flex items-start sm:items-center gap-4">
                <div className="bg-red-100 p-2 rounded-full text-brand-red shrink-0">
                    <MdWarning className="w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-red-800">Attention Required</h2>
                    <p className="text-red-700 font-medium">SmartGrade AI has identified {atRiskStudents.length} students whose performance is trending downward or critically low.</p>
                </div>
            </div>

            {/* At Risk Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">Flagged Students Roster</h3>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">Updated 2 hrs ago</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-sm">
                                <th className="py-4 px-6 font-semibold text-slate-700">Student Info</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-center">Subject Area</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-center">Current Score</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-center">Trend (30 Days)</th>
                                <th className="py-4 px-6 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {atRiskStudents.map((student) => (
                                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                          ${student.status === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{student.name}</p>
                                                <p className="text-xs text-slate-500 font-medium">Roll No: {student.rollNo} • Class {student.class}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-center">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200 uppercase tracking-widest">
                                            {student.subject}
                                        </span>
                                    </td>

                                    <td className="py-4 px-6 text-center">
                                        <span className={`font-black text-lg ${student.score < 50 ? 'text-brand-red' : 'text-orange-500'}`}>
                                            {student.score}%
                                        </span>
                                    </td>

                                    <td className="py-4 px-6">
                                        <div className={`flex items-center justify-center gap-1 font-bold text-sm
                      ${student.trend < 0 ? 'text-brand-red' : student.trend === 0 ? 'text-slate-500' : 'text-brand-green'}`}>
                                            {student.trend < 0 ? <MdTrendingDown className="w-5 h-5" /> : student.trend === 0 ? <MdTrendingFlat className="w-5 h-5" /> : <MdTrendingUp className="w-5 h-5" />}
                                            {student.trend}%
                                        </div>
                                    </td>

                                    <td className="py-4 px-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={handleComingSoon} className="text-brand-blue bg-blue-50 hover:bg-blue-100 p-2 rounded-lg font-semibold text-sm transition-colors border border-blue-100 hidden sm:block">
                                                View Insights
                                            </button>
                                            <button
                                                onClick={() => notifyParent(student.id, student)}
                                                disabled={notified[student.id]}
                                                className={`p-2 rounded-lg font-semibold text-sm flex items-center gap-2 border transition-all
                           ${notified[student.id]
                                                        ? 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                                                        : 'bg-white border-brand-red text-brand-red hover:bg-brand-red hover:text-white'}`}
                                            >
                                                <MdSend className="w-4 h-4" />
                                                {notified[student.id] ? 'Alert Sent' : 'Alert Parent'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}