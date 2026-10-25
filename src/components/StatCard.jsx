import React from 'react';
import { motion } from 'framer-motion';
import { MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import AnimatedCounter from './AnimatedCounter';

export default function StatCard({ title, value, icon, trend, colorClass = "text-blue-600", bgClass = "bg-blue-50 border-blue-100" }) {
    const renderValue = () => {
        if (typeof value === 'number') return <AnimatedCounter end={value} duration={1000} />;
        if (typeof value === 'string' && value.endsWith('%')) {
            const n = parseInt(value, 10);
            if (!isNaN(n)) return <AnimatedCounter end={n} suffix="%" duration={1000} />;
        }
        return value;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card p-5 group bg-white"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{title}</p>
                    <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                        {renderValue()}
                    </h3>
                    {trend !== undefined && (
                        <div className={`flex items-center gap-1 mt-2 text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex border
                            ${trend >= 0 ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 'text-rose-600 bg-rose-50 border-rose-100'}`}
                        >
                            {trend >= 0 ? <MdTrendingUp className="w-3 h-3" /> : <MdTrendingDown className="w-3 h-3" />}
                            <span>{Math.abs(trend)}% this month</span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-xl border ${bgClass} ${colorClass} transition-transform duration-300 group-hover:scale-105`}>
                    {icon}
                </div>
            </div>
        </motion.div>
    );
}
