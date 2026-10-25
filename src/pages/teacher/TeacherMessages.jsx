import React, { useState, useRef, useEffect } from 'react';
import { MdSend, MdPerson, MdFamilyRestroom, MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../../utils/apiConfig';

export default function TeacherMessages() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const endOfMessagesRef = useRef(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/messages`);
            if (res.ok) {
                const data = await res.json();
                const dbMessages = (data.data || []).map(m => ({
                    id: m.id,
                    sender: m.senderRole === 'PARENT' ? 'parent' : 'teacher',
                    senderName: m.senderName,
                    text: m.content,
                    time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }));
                setMessages(dbMessages);
            }
        } catch (e) {
            console.error('Failed to fetch messages:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const content = input.trim();
        setInput('');

        // Optimistic UI update
        const optimisticMsg = {
            id: Date.now(),
            sender: 'teacher',
            senderName: 'Prof. Sharma',
            text: content,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const res = await fetch(`${API_BASE_URL}/api/messages`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    senderRole: 'TEACHER',
                    senderName: 'Prof. Sharma'
                })
            });
            if (res.ok) {
                toast.success("Reply sent to Arjun Patil's parent!");
                fetchMessages();
            } else {
                toast.error('Failed to deliver reply');
            }
        } catch (err) {
            console.error('Message error:', err);
            toast.error('Could not send reply');
        }
    };

    const sendQuickReply = (text) => {
        setInput(text);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in relative pb-10 sm:h-[calc(100vh-140px)] flex flex-col">
            <div className="mb-6 shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-1">Parent Communications</h1>
                    <p className="text-slate-500">Directly consult with Arjun Patil's parent (Mr. Patil).</p>
                </div>
                <button
                    onClick={() => navigate('/teacher/at-risk')}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
                >
                    <MdArrowBack className="w-4 h-4" />
                    Back to At-Risk
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col overflow-hidden flex-1 relative">

                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center border-2 border-white shadow-sm font-bold">
                                <MdFamilyRestroom className="w-7 h-7" />
                            </div>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Mr. Patil (Parent)</h2>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Student: Arjun Patil • AIML 2nd Year (Roll: C250)</p>
                        </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        ● Active Thread
                    </span>
                </div>

                {/* Chat Area */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 space-y-6">
                    {messages.length === 0 && !loading && (
                        <div className="text-center text-slate-400 py-12">
                            <p className="text-sm">No messages yet. Messages from parents will appear here in real time!</p>
                        </div>
                    )}

                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex max-w-[80%] ${msg.sender === 'teacher' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}>
                            <div className={`flex items-end gap-2 ${msg.sender === 'teacher' ? 'flex-row-reverse' : 'flex-row'}`}>

                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-white shadow-sm
                    ${msg.sender === 'teacher' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-600'}`}>
                                    {msg.sender === 'teacher' ? <MdPerson className="w-4 h-4" /> : <MdFamilyRestroom className="w-4 h-4" />}
                                </div>

                                <div className={`p-4 rounded-2xl shadow-sm relative text-[15px]
                    ${msg.sender === 'teacher'
                                        ? 'bg-emerald-600 text-white rounded-br-none'
                                        : 'bg-white text-slate-700 border border-slate-200 rounded-bl-none'}`}>
                                    <div className={`text-[11px] font-bold mb-1 ${msg.sender === 'teacher' ? 'text-emerald-100' : 'text-slate-500'}`}>
                                        {msg.sender === 'teacher' ? 'You (Prof. Sharma)' : 'Mr. Patil'}
                                    </div>
                                    {msg.text}
                                    <div className={`text-[10px] mt-2 font-medium pb-0 ${msg.sender === 'teacher' ? 'text-emerald-200 text-right' : 'text-slate-400'}`}>
                                        {msg.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={endOfMessagesRef} />
                </div>

                {/* Quick Replies for Teacher */}
                <div className="px-6 py-3 bg-white border-t border-slate-100 flex gap-2 overflow-x-auto shrink-0 no-scrollbar">
                    {[
                        "I have noted your concern. We'll provide extra assistance.",
                        "Could we schedule a call tomorrow at 4 PM?",
                        "Arjun just needs to practice more DSA problem sets.",
                        "Please encourage him to attend the remedial sessions."
                    ].map((text, i) => (
                        <button
                            key={i}
                            onClick={() => sendQuickReply(text)}
                            className="whitespace-nowrap px-4 py-1.5 rounded-full border border-emerald-200 text-emerald-700 bg-emerald-50 text-sm font-semibold hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                            {text}
                        </button>
                    ))}
                </div>

                {/* Input Area */}
                <form onSubmit={handleSend} className="p-4 bg-white shrink-0 border-t border-slate-100 flex gap-4 items-end">
                    <textarea
                        rows="1"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type a reply to Mr. Patil..."
                        className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 rounded-xl px-4 py-3 outline-none resize-none min-h-[50px] transition-all"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-emerald-600 text-white rounded-xl w-12 h-12 flex shrink-0 items-center justify-center hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                    >
                        <MdSend className="w-5 h-5 ml-1" />
                    </button>
                </form>
            </div>
        </div>
    );
}
