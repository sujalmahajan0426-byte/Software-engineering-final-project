import React from 'react';

/**
 * AmbientBackground — soothing, colorful, living atmospheric backdrop.
 * Moves like gentle aurora / drifting morning clouds: calming, rich, and distinctly visible.
 */
export default function AmbientBackground() {
    return (
        <div
            aria-hidden="true"
            className="fixed inset-0 pointer-events-none overflow-hidden"
            style={{ zIndex: 0, isolation: 'isolate' }}
        >
            {/* Soothing living gradient canvas */}
            <div
                className="absolute inset-0"
                style={{
                    background: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 25%, #ede9fe 50%, #dcfce7 75%, #fef3c7 100%)',
                    backgroundSize: '300% 300%',
                    animation: 'gradientDrift 20s ease-in-out infinite',
                    opacity: 0.85,
                }}
            />

            {/* Orb 1 — Soothing Sapphire / Sky Blue, top-left */}
            <div
                className="animate-float-1 absolute"
                style={{
                    top: '-10%',
                    left: '-5%',
                    width: '60vw',
                    height: '60vw',
                    maxWidth: '800px',
                    maxHeight: '800px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(99, 102, 241, 0.20) 45%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            {/* Orb 2 — Soothing Emerald / Mint, bottom-right */}
            <div
                className="animate-float-2 absolute"
                style={{
                    bottom: '-12%',
                    right: '-8%',
                    width: '55vw',
                    height: '55vw',
                    maxWidth: '750px',
                    maxHeight: '750px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.32) 0%, rgba(20, 184, 166, 0.18) 45%, transparent 70%)',
                    filter: 'blur(60px)',
                }}
            />

            {/* Orb 3 — Soft Violet / Lavender, center-right */}
            <div
                className="animate-float-3 absolute"
                style={{
                    top: '20%',
                    right: '12%',
                    width: '45vw',
                    height: '45vw',
                    maxWidth: '600px',
                    maxHeight: '600px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.28) 0%, rgba(139, 92, 246, 0.14) 45%, transparent 70%)',
                    filter: 'blur(70px)',
                }}
            />

            {/* Orb 4 — Warm Amber / Coral, bottom-left */}
            <div
                className="animate-float-1 absolute"
                style={{
                    bottom: '8%',
                    left: '8%',
                    width: '40vw',
                    height: '40vw',
                    maxWidth: '520px',
                    maxHeight: '520px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(251, 146, 60, 0.14) 45%, transparent 70%)',
                    filter: 'blur(60px)',
                    animationDelay: '-10s',
                }}
            />

            {/* Orb 5 — Gentle Cyan Aurora Heart, center-top */}
            <div
                className="animate-float-2 absolute"
                style={{
                    top: '15%',
                    left: '35%',
                    width: '35vw',
                    height: '35vw',
                    maxWidth: '450px',
                    maxHeight: '450px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(6, 182, 212, 0.22) 0%, rgba(56, 189, 248, 0.10) 45%, transparent 70%)',
                    filter: 'blur(55px)',
                    animationDelay: '-16s',
                }}
            />
        </div>
    );
}
