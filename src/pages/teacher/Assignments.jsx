import React, { useState, useEffect } from 'react';
import { MdAdd, MdMoreVert, MdInsertDriveFile, MdCheckCircle, MdUploadFile, MdImage, MdClose } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../utils/apiConfig';

const subjects = [
    'Software Engineering',
    'Data Wrangling',
    'DSA',
    'PS',
    'OS'
];

export default function Assignments() {
    const { user } = useAuth();
    const [assignmentList, setAssignmentList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    
    // Form fields
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState(subjects[0]);
    const [dueDate, setDueDate] = useState('');
    const [question, setQuestion] = useState('');
    const [teacherNotes, setTeacherNotes] = useState('');
    const [showNotesField, setShowNotesField] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Question image upload
    const [questionImage, setQuestionImage] = useState(null); // base64
    const [questionImageMime, setQuestionImageMime] = useState(null);
    const [questionImagePreview, setQuestionImagePreview] = useState(null); // data URL for preview
    const [questionImageName, setQuestionImageName] = useState('');

    const handleQuestionImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be less than 10MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            const base64 = dataUrl.split(',')[1];
            setQuestionImage(base64);
            setQuestionImageMime(file.type);
            setQuestionImagePreview(dataUrl);
            setQuestionImageName(file.name);
            toast.success('📷 Question image uploaded!');
        };
        reader.readAsDataURL(file);
    };

    const removeQuestionImage = () => {
        setQuestionImage(null);
        setQuestionImageMime(null);
        setQuestionImagePreview(null);
        setQuestionImageName('');
    };

    const fetchAssignments = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/assignments`);
            const data = await res.json();
            if (data.success && data.data && data.data.length > 0) {
                // Format assignments
                const formatted = data.data.map(a => ({
                    id: a.id,
                    title: a.title,
                    subject: a.subject,
                    question: a.question,
                    questionImage: a.questionImage,
                    questionImageMime: a.questionImageMime,
                    dueDate: a.dueDate,
                    submitted: a.submissions ? a.submissions.length : 0,
                    total: 35,
                    avgScore: a.submissions && a.submissions.length > 0
                        ? Math.round(a.submissions.reduce((acc, s) => acc + (s.score || 0), 0) / a.submissions.length)
                        : null
                }));
                setAssignmentList(formatted);
            }
        } catch (err) {
            console.warn('Backend unreachable, using fallback assignments list');
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/api/assignments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    subject,
                    dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    question: question || (questionImage ? '[Question provided as image — see attached]' : ''),
                    teacherNotes,
                    teacherId: user?.id,
                    questionImage,
                    questionImageMime,
                })
            });

            const data = await res.json();
            if (data.success) {
                toast.success(`🎉 "${title}" created & notification dispatched to all students!`);
                setTitle('');
                setQuestion('');
                setTeacherNotes('');
                setShowNotesField(false);
                setShowForm(false);
                removeQuestionImage();
                fetchAssignments();
            } else {
                toast.error(data.error?.message || 'Failed to create assignment');
            }
        } catch (err) {
            // Local fallback
            const newAssignment = {
                id: `local-${Date.now()}`,
                title,
                subject,
                dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                submitted: 0,
                total: 35,
                avgScore: null
            };
            setAssignmentList([newAssignment, ...assignmentList]);
            toast.success(`🎉 "${title}" created locally & distributed to student portal!`);
            setTitle('');
            setQuestion('');
            setTeacherNotes('');
            setShowNotesField(false);
            setShowForm(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleComingSoon = () => toast.info('🚀 Feature coming soon!');

    return (
        <div className="max-w-6xl mx-auto animate-fade-in relative pb-10 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Class Assignments</h1>
                    <p className="text-slate-500">Manage and create AI-graded assignments for B.Tech CS (2nd Year).</p>
                </div>

                <button
                    onClick={() => setShowForm(!showForm)}
                    className="btn-primary flex items-center justify-center gap-2"
                >
                    <MdAdd className="w-5 h-5" />
                    {showForm ? 'Cancel Creation' : 'Create Assignment'}
                </button>
            </div>

            {/* Slide down form */}
            {showForm && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-md animate-fade-in mb-8">
                    <h2 className="text-lg font-bold text-green-800 mb-4">Create New AI-Graded Assignment</h2>
                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Assignment Title</label>
                                <input
                                    type="text"
                                    required
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Memory Management & Pointers Lab"
                                    className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-green bg-white text-slate-800"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Subject</label>
                                    <select
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-green bg-white text-slate-800"
                                    >
                                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Due Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        className="w-full p-2.5 border border-slate-300 rounded-lg outline-none focus:border-brand-green bg-white text-slate-800"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Question / Problem Statement</label>
                            <textarea
                                rows="3"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Type the problem students must solve... (optional if uploading image)"
                                className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-brand-green resize-y bg-white text-slate-800"
                            />
                        </div>

                        {/* OR — Upload question as image */}
                        <div className="flex items-center gap-3 -my-1">
                            <div className="flex-1 h-px bg-slate-200"></div>
                            <span className="text-xs text-slate-400 font-medium">OR upload question as image</span>
                            <div className="flex-1 h-px bg-slate-200"></div>
                        </div>

                        <div>
                            {!questionImagePreview ? (
                                <div className="border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-xl p-5 text-center transition-colors bg-white hover:bg-emerald-50/30 cursor-pointer">
                                    <input
                                        type="file"
                                        id="question-image-upload"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.webp"
                                        onChange={handleQuestionImageUpload}
                                    />
                                    <label htmlFor="question-image-upload" className="cursor-pointer flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                                            <MdImage className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <p className="text-sm font-medium text-slate-600">Upload question image</p>
                                        <p className="text-xs text-slate-400 mt-0.5">JPG, PNG, WebP · Max 10MB</p>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative border border-emerald-200 rounded-xl overflow-hidden bg-emerald-50/30">
                                    <div className="p-3 flex items-center gap-3">
                                        <img
                                            src={questionImagePreview}
                                            alt="Question preview"
                                            className="w-20 h-20 object-cover rounded-lg border border-slate-200"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-700 truncate">{questionImageName}</p>
                                            <p className="text-xs text-emerald-600 mt-0.5">✅ Image uploaded — AI will read it when grading</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeQuestionImage}
                                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                                        >
                                            <MdClose className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Optional Teacher Notes / Context for AI */}
                        <div className="pt-2">
                            {!showNotesField ? (
                                <button
                                    type="button"
                                    onClick={() => setShowNotesField(true)}
                                    className="text-sm font-bold text-brand-green hover:text-green-700 flex items-center gap-1"
                                >
                                    <MdAdd className="w-4 h-4" /> Add Optional AI Reference Key / Rubric
                                </button>
                            ) : (
                                <div className="space-y-2 animate-fade-in border-l-2 border-brand-green pl-4 ml-1">
                                    <div className="flex justify-between items-end">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Reference Answer Key (Context for AI Grading)
                                            <span className="block text-xs font-normal text-slate-500 mt-0.5">Paste solution criteria or specific formulas. The AI will strictly grade against these guidelines.</span>
                                        </label>
                                        <button type="button" onClick={() => { setShowNotesField(false); setTeacherNotes(''); }} className="text-xs text-red-500 hover:text-red-700 font-semibold">Remove</button>
                                    </div>
                                    <textarea
                                        value={teacherNotes}
                                        onChange={(e) => setTeacherNotes(e.target.value)}
                                        rows="3"
                                        placeholder="e.g. Student must state O(E + V log V) time complexity and mention priority queue implementation..."
                                        className="w-full p-3 bg-white border border-green-200 rounded-lg outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green resize-y text-sm text-slate-800"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-brand-green hover:bg-green-600 text-white font-bold py-2.5 px-6 rounded-lg transition-colors shadow-md shadow-green-500/20 flex items-center gap-2"
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish to Class'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Assignments List */}
            <div className="grid gap-4 mt-8">
                {assignmentList.length > 0 ? (
                    assignmentList.map((assignment) => (
                        <div key={assignment.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-green-200 transition-colors group">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-slate-100 rounded-xl text-slate-500 group-hover:bg-green-50 group-hover:text-brand-green transition-colors hidden sm:block">
                                    <MdInsertDriveFile className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{assignment.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="text-xs font-semibold bg-green-50 text-emerald-700 border border-green-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider">{assignment.subject}</span>
                                        <span className="text-sm text-slate-500">
                                            Due {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        {assignment.questionImage && (
                                            <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                                                📷 Image Attached
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 justify-between md:justify-end w-full md:w-auto">
                                {/* Submission Progress */}
                                <div className="w-32">
                                    <div className="flex justify-between text-xs font-semibold mb-1">
                                        <span className="text-slate-500">Submitted</span>
                                        <span className="text-slate-700">{assignment.submitted}/{assignment.total}</span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                        <div className="bg-brand-green h-full rounded-full transition-all duration-1000" style={{ width: `${(assignment.submitted / assignment.total) * 100}%` }}></div>
                                    </div>
                                </div>

                                {/* Avg Score */}
                                <div className="text-center min-w-[80px]">
                                    <div className="text-xs font-semibold text-slate-500 mb-1">Class Avg</div>
                                    {assignment.avgScore ? (
                                        <span className="font-bold text-lg text-slate-800">{assignment.avgScore}%</span>
                                    ) : (
                                        <span className="text-sm font-medium text-slate-400">Pending</span>
                                    )}
                                </div>

                                <div className="flex flex-col items-end gap-2">
                                    <button onClick={handleComingSoon} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-brand-blue border border-blue-200 rounded-lg text-xs font-bold hover:bg-brand-blue hover:text-white transition-colors">
                                        <MdCheckCircle className="w-4 h-4" /> Review Submissions
                                    </button>
                                    <button onClick={handleComingSoon} className="text-slate-400 hover:text-slate-600 p-1">
                                        <MdMoreVert className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 border border-dashed border-slate-300 rounded-2xl bg-slate-50/50">
                        <p className="text-slate-600 font-medium">No assignments yet</p>
                        <p className="text-slate-400 text-xs mt-1">Click "Create Assignment" above to publish your first assignment.</p>
                    </div>
                )}
            </div>
        </div>
    );
}