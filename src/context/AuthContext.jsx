import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/apiConfig';

const AuthContext = createContext();

const DEMO_USERS = {
    'student@demo.com': { id: 'demo-student-1', name: 'Arjun', role: 'student', email: 'student@demo.com' },
    'teacher@demo.com': { id: 'demo-teacher-1', name: 'Prof. Sharma', role: 'teacher', email: 'teacher@demo.com' },
    'parent@demo.com': { id: 'demo-parent-1', name: 'Mr. Patel', role: 'parent', email: 'parent@demo.com' },
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('smartgrade_token') || null);
    const [isInitializing, setIsInitializing] = useState(true);
    const navigate = useNavigate();

    // Verify token on mount and restore session
    useEffect(() => {
        const restoreSession = async () => {
            const savedToken = localStorage.getItem('smartgrade_token');
            const savedUser = localStorage.getItem('smartgrade_user');

            if (savedToken && savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser);
                    setUser(parsedUser);

                    // Verify with backend
                    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
                        headers: { 'Authorization': `Bearer ${savedToken}` }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        if (result.success && result.data) {
                            const freshUser = {
                                ...result.data,
                                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.data.name)}&background=random`
                            };
                            setUser(freshUser);
                            localStorage.setItem('smartgrade_user', JSON.stringify(freshUser));
                        }
                    } else if (response.status === 401 || response.status === 403) {
                        // Token expired
                        logout();
                    }
                } catch (e) {
                    console.warn('Session restore error:', e);
                }
            }
            setIsInitializing(false);
        };

        restoreSession();
    }, []);

    const handleOfflineFallback = (email, password) => {
        console.warn('⚠️ Backend offline or demo fallback active.');
        if (password !== 'demo123') {
            return { success: false, error: 'INVALID_CREDENTIALS' };
        }
        const demoUser = DEMO_USERS[email];
        if (!demoUser) {
            return { success: false, error: 'INVALID_CREDENTIALS' };
        }
        const userData = {
            ...demoUser,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(demoUser.name)}&background=random`
        };
        setUser(userData);
        localStorage.setItem('smartgrade_user', JSON.stringify(userData));
        navigate(`/${demoUser.role}`);
        return { success: true };
    };

    const login = async (role, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const userData = {
                    ...result.data,
                    role: result.data.role.toLowerCase(),
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.data.name)}&background=random`
                };
                setUser(userData);
                setToken(result.data.token);
                localStorage.setItem('smartgrade_token', result.data.token);
                localStorage.setItem('smartgrade_user', JSON.stringify(userData));
                navigate(`/${userData.role}`);
                return { success: true };
            }

            if (response.status === 401 || response.status === 400) {
                return { success: false, error: 'INVALID_CREDENTIALS', message: result.error?.message };
            }

            return handleOfflineFallback(email, password);
        } catch (networkError) {
            return handleOfflineFallback(email, password);
        }
    };

    const register = async ({ name, email, password, role }) => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });

            const result = await response.json();

            if (response.ok && result.success) {
                const userData = {
                    ...result.data,
                    role: result.data.role.toLowerCase(),
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.data.name)}&background=random`
                };
                setUser(userData);
                setToken(result.data.token);
                localStorage.setItem('smartgrade_token', result.data.token);
                localStorage.setItem('smartgrade_user', JSON.stringify(userData));
                navigate(`/${userData.role}`);
                return { success: true };
            }

            return {
                success: false,
                error: result.error?.code || 'REGISTRATION_FAILED',
                message: result.error?.message || 'Could not register user'
            };
        } catch (error) {
            return {
                success: false,
                error: 'NETWORK_ERROR',
                message: 'Cannot reach backend server. Please verify connection.'
            };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('smartgrade_token');
        localStorage.removeItem('smartgrade_user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!user,
            isInitializing,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
