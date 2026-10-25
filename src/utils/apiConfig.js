// Centralized API configuration for SmartGrade
// In development, defaults to local backend port 5001.
// In production on Render/Vercel, reads from import.meta.env.VITE_API_URL.
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';

// Ensure no trailing slash for consistent concatenation
export const API_BASE_URL = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;

export default API_BASE_URL;
