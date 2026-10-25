// Centralized API configuration for SmartGrade
// In development, defaults to local backend port 5001.
// In production on Render/Vercel, reads from import.meta.env.VITE_API_URL.
const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001').trim();

// Ensure http:// or https:// prefix exists (Render host property provides bare hostname like xxx.onrender.com)
const withProtocol = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
    ? rawUrl
    : `https://${rawUrl}`;

// Ensure no trailing slash for consistent concatenation
export const API_BASE_URL = withProtocol.endsWith('/') ? withProtocol.slice(0, -1) : withProtocol;

export default API_BASE_URL;
