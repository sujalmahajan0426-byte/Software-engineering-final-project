import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdNotifications, MdNotificationsNone, MdAssignment, MdChat, MdWarning, MdDoneAll } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../utils/apiConfig';

export default function NotificationPanel() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const panelRef = useRef(null);
    const prevNotifIdsRef = useRef(new Set());
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const roleParam = user?.role ? `?role=${user.role}` : '';
            const res = await fetch(`${API_BASE_URL}/api/notifications${roleParam}`);
            const data = await res.json();
            if (data.success && Array.isArray(data.data)) {
                // Check for new notifications to trigger a toast popup
                if (prevNotifIdsRef.current.size > 0) {
                    const newItems = data.data.filter(n => !prevNotifIdsRef.current.has(n.id) && !n.isRead);
                    newItems.forEach(n => {
                        if (n.type === 'MESSAGE') {
                            toast.info(`💬 ${n.title}: ${n.message}`, {
                                onClick: () => navigate(n.link || (user?.role === 'teacher' ? '/teacher/messages' : '/parent/message'))
                            });
                        } else if (n.type === 'ALERT') {
                            toast.warn(`⚠️ ${n.title}: ${n.message}`);
                        }
                    });
                }

                // Update tracked IDs
                prevNotifIdsRef.current = new Set(data.data.map(n => n.id));

                setNotifications(data.data);
                const unread = data.data.filter(n => !n.isRead).length;
                setUnreadCount(unread);
            }
        } catch (err) {
            // Local fallback
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Poll every 4 seconds for responsive real-time notifications
        const interval = setInterval(fetchNotifications, 4000);
        return () => clearInterval(interval);
    }, [user?.role]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAllRead = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/notifications/mark-all-read`, { method: 'PATCH' });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        }
    };

    const handleNotificationClick = async (notif) => {
        try {
            await fetch(`${API_BASE_URL}/api/notifications/${notif.id}/read`, { method: 'PATCH' });
            setNotifications(notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {
            // ignore
        }
        setIsOpen(false);
        if (notif.link) {
            navigate(notif.link);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'MESSAGE':
                return <MdChat className="w-4 h-4 text-emerald-600" />;
            case 'ALERT':
                return <MdWarning className="w-4 h-4 text-rose-600" />;
            default:
                return <MdAssignment className="w-4 h-4 text-blue-600" />;
        }
    };

    return (
        <div className="relative" ref={panelRef}>
            {/* Bell Icon Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-blue-50/60 transition-colors focus:outline-none"
                title="Notifications"
            >
                {unreadCount > 0 ? (
                    <motion.div
                        animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 4 }}
                    >
                        <MdNotifications className="w-5 h-5 text-blue-600" />
                    </motion.div>
                ) : (
                    <MdNotificationsNone className="w-5 h-5" />
                )}

                {/* Unread badge */}
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white font-bold text-[9px] rounded-full flex items-center justify-center shadow-xs"
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                                {unreadCount > 0 && (
                                    <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded-full">
                                        {unreadCount} new
                                    </span>
                                )}
                            </div>
                            {notifications.length > 0 && unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                                >
                                    <MdDoneAll className="w-3.5 h-3.5" /> Mark all read
                                </button>
                            )}
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                            {notifications.length > 0 ? (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif)}
                                        className={`p-3.5 hover:bg-blue-50/40 transition-colors cursor-pointer flex gap-3 items-start ${
                                            !notif.isRead ? 'bg-blue-50/20' : ''
                                        }`}
                                    >
                                        <div className={`p-2 rounded-xl mt-0.5 ${
                                            !notif.isRead ? 'bg-white shadow-xs border border-slate-100' : 'bg-slate-100'
                                        }`}>
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h4 className={`text-xs font-bold truncate ${
                                                    !notif.isRead ? 'text-slate-900' : 'text-slate-700'
                                                }`}>
                                                    {notif.title}
                                                </h4>
                                                {!notif.isRead && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                                                {notif.message}
                                            </p>
                                            <span className="text-[10px] text-slate-400 mt-1 block">
                                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-slate-400">
                                    <MdNotificationsNone className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                                    <p className="text-xs font-medium text-slate-600">No new notifications</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">Stay tuned for alerts and messages!</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="p-2.5 bg-slate-50 text-center border-t border-slate-100">
                                <span className="text-[11px] text-slate-500 font-medium">
                                    Click any notification to open relevant page
                                </span>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
