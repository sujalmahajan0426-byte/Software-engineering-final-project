import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import NotificationPanel from './NotificationPanel';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 15);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getRoleGradient = (role) => {
        switch (role) {
            case 'student': return 'from-blue-500 via-sky-500 to-blue-600';
            case 'teacher': return 'from-emerald-500 via-teal-500 to-emerald-600';
            case 'parent': return 'from-indigo-500 via-blue-500 to-indigo-600';
            default: return 'from-blue-500 to-sky-500';
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'student': return 'bg-blue-50 text-blue-700 border-blue-200/70';
            case 'teacher': return 'bg-emerald-50 text-emerald-700 border-emerald-200/70';
            case 'parent': return 'bg-indigo-50 text-indigo-700 border-indigo-200/70';
            default: return 'bg-slate-50 text-slate-700 border-slate-200';
        }
    };

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'pt-2' : 'pt-4'}`}>
            <div className={`mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-300 ${scrolled ? 'px-2' : 'px-4'}`}>
                <div className="glass-panel rounded-2xl flex justify-between items-center h-16 px-5 sm:px-6 transition-all duration-300">
                    <Logo />

                    <nav className="flex items-center gap-3 sm:gap-6">
                        {!isAuthenticated ? (
                            <>
                                <Link 
                                    to="/login" 
                                    className="text-slate-500 font-semibold text-sm hover:text-blue-600 transition-colors hidden sm:block px-3 py-1.5 rounded-xl hover:bg-blue-50/50"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    to="/login?mode=signup" 
                                    className="btn-primary py-2 px-5 text-sm"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 sm:gap-5">
                                <NotificationPanel />
                                <div className="hidden sm:flex items-center gap-3 pl-2">
                                    <div className="text-right">
                                        <p className="text-sm font-extrabold text-slate-800 leading-tight">{user.name}</p>
                                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border mt-0.5 ${getRoleBadge(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                    <div className={`p-0.5 rounded-full bg-gradient-to-tr ${getRoleGradient(user.role)} shadow-xs`}>
                                        <img 
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'User')}&background=random`} 
                                            alt="Avatar" 
                                            className="w-9 h-9 rounded-full border-2 border-white object-cover bg-white" 
                                        />
                                    </div>
                                </div>
                                <div className="w-px h-6 bg-slate-200 hidden sm:block"></div>
                                <button 
                                    onClick={logout} 
                                    className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors px-2.5 py-1.5 rounded-xl hover:bg-rose-50"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}