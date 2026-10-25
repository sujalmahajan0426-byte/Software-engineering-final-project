import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingAI from '../../components/LoadingAI';
import { MdUploadFile, MdBolt, MdArrowBack } from 'react-icons/md';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/apiConfig';

export default function SubmitAssignment() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [assignmentList, setAssignmentList] = useState([]);
    const [selectedAssignment, setSelectedAssignment] = useState(location.state?.selectedAssignmentId || '');
    const [answer, setAnswer] = useState('');
    const [isGrading, setIsGrading] = useState(false);
    const [fileName, setFileName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoadingAssignments, setIsLoadingAssignments] = useState(true);

    // Fetch real assignments from backend only
    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/assignments`);
                const data = await res.json();
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    setAssignmentList(data.data);
                    const preselected = location.state?.selectedAssignmentId;
                    if (preselected && data.data.some(a => a.id === preselected)) {
                        setSelectedAssignment(preselected);
                    } else {
                        setSelectedAssignment(data.data[0].id);
                    }
                }
            } catch (err) {
                console.warn('⚠️ Could not fetch assignments from backend.');
                toast.error('Could not connect to server. Make sure the backend is running.');
            } finally {
                setIsLoadingAssignments(false);
            }
        };
        fetchAssignments();
    }, [location.state]);

    const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!answer.trim() && !selectedFile) {
            toast.error('Please enter an answer or upload a handwritten image.');
            return;
        }

        if (!selectedAssignment) {
            toast.error('Please select an assignment first.');
            return;
        }

        setIsGrading(true);

        try {
            const assignmentObj = assignmentList.find(a => a.id === selectedAssignment);
            const question = assignmentObj?.question || assignmentObj?.title || 'General Question';
            const subject = assignmentObj?.subject || 'General';

            let base64Image = null;
            let mimeType = null;

            if (selectedFile) {
                toast.info('📷 Reading your handwritten image...');
                base64Image = await fileToBase64(selectedFile);
                mimeType = selectedFile.type;
            }

            const studentAnswer = answer || (selectedFile ? '[See attached handwritten image]' : '');

            // Submit to backend — backend handles AI grading via Groq
            const response = await fetch(`${API_BASE_URL}/api/submissions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    assignmentId: selectedAssignment,
                    studentId: user.id,
                    studentAnswer,
                    base64Image,
                    mimeType,
                })
            });

            const data = await response.json();

            if (data.success && data.data) {
                const result = data.data;

                if (result.error === 'ILLEGIBLE_HANDWRITING') {
                    navigate('/student/result', { state: { error: true, subject, question } });
                } else {
                    navigate('/student/result', { state: { result, subject, question } });
                }
            } else {
                throw new Error(data?.error?.message || 'Grading failed');
            }
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(error.message || 'Error grading assignment. Please try again.');
            setIsGrading(false);
        }
    };

    const handleFileUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 15 * 1024 * 1024) {
                toast.error('File size must be less than 15MB.');
                return;
            }
            setSelectedFile(file);
            setFileName(file.name);
            toast.success('✅ Image uploaded! Groq Vision AI will analyze your handwriting.');
        }
    };

    if (isGrading) {
        return <LoadingAI />;
    }

    return (
        <div className="max-w-4xl mx-auto relative pb-10 pt-2">
            <div className="mb-6">
                <button
                    onClick={() => navigate('/student')}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-700 text-sm font-medium mb-3 transition-colors"
                >
                    <MdArrowBack className="w-4 h-4" /> Back to Dashboard
                </button>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">Submit Assignment</h1>
                <p className="text-sm text-slate-400 mt-1">Upload your handwritten work or type your answer for instant AI grading.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">

                {/* Assignment Selection */}
                <div className="mb-6">
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Select Assignment</label>
                    {isLoadingAssignments ? (
                        <div className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-400 animate-pulse">
                            Loading assignments...
                        </div>
                    ) : assignmentList.length > 0 ? (
                        <select
                            value={selectedAssignment}
                            onChange={(e) => setSelectedAssignment(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none transition-all text-sm"
                        >
                            <option value="" disabled>-- Choose an assignment --</option>
                            {assignmentList.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.title} — {a.subject}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="w-full p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center">
                            <p className="text-sm text-slate-500 font-medium">No assignments available yet.</p>
                            <p className="text-xs text-slate-400 mt-1">Your teacher hasn't published any assignments. Check back later!</p>
                        </div>
                    )}

                    {/* Show selected assignment details */}
                    {selectedAssignment && assignmentList.length > 0 && (() => {
                        const a = assignmentList.find(x => x.id === selectedAssignment);
                        return a ? (
                            <div className="mt-3 p-4 bg-blue-50/50 border border-blue-100 rounded-xl space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">{a.subject}</p>
                                    {a.dueDate && (
                                        <span className="text-[11px] text-slate-500">
                                            Due {new Date(a.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-slate-800 font-bold">{a.title}</p>
                                {a.question && (
                                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{a.question}</p>
                                )}
                                {a.questionImage && (
                                    <div className="pt-2 border-t border-blue-100/70">
                                        <p className="text-[11px] font-semibold text-slate-600 mb-1.5 flex items-center gap-1">
                                            <span>📷 Attached Question Image / Problem Sheet:</span>
                                        </p>
                                        <div className="rounded-lg overflow-hidden border border-slate-200/80 bg-white max-h-80 flex items-center justify-center p-2">
                                            <img
                                                src={`data:${a.questionImageMime || 'image/png'};base64,${a.questionImage}`}
                                                alt="Teacher Question"
                                                className="max-h-72 max-w-full object-contain rounded"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : null;
                    })()}
                </div>

                {/* Text Answer */}
                <div className="mb-6">
                    <label className="text-sm font-semibold text-slate-700 flex justify-between items-end mb-2">
                        <span>Your Answer (Text)</span>
                        <span className="text-xs font-normal text-slate-400">Optional if uploading image</span>
                    </label>
                    <textarea
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your detailed answer here..."
                        className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 outline-none resize-y transition-all text-sm"
                    />
                </div>

                {/* OR Divider */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <span className="text-slate-400 font-medium text-sm">OR</span>
                    <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                {/* File Upload */}
                <div className="mb-8">
                    <label className="text-sm font-semibold text-slate-700 block mb-2">Upload Handwritten Work (Image)</label>
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors
                        ${fileName ? 'border-emerald-300 bg-emerald-50/50' : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/30'}`}>

                        <input
                            type="file"
                            id="file-upload"
                            className="hidden"
                            onChange={handleFileUpload}
                            accept=".jpg,.jpeg,.png,.webp"
                        />

                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3
                                ${fileName ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 border border-slate-200 shadow-sm'}`}>
                                <MdUploadFile className="w-6 h-6" />
                            </div>
                            <span className="font-medium text-slate-700 mb-1 text-sm">
                                {fileName ? `✅ ${fileName}` : 'Click to upload your handwritten answer'}
                            </span>
                            {!fileName && <span className="text-xs text-slate-400 block">JPG, PNG, WebP up to 15MB — AI will read your handwriting</span>}
                        </label>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-end pt-4 border-t border-slate-100">
                    <button
                        type="submit"
                        disabled={assignmentList.length === 0}
                        className="btn-primary py-3 px-8 text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Submit for AI Grading
                        <MdBolt className="w-5 h-5" />
                    </button>
                </div>
            </form>
        </div>
    );
}