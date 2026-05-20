import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const TICKER_ITEMS = [
    { label: 'C++', icon: '⬡' },
    { label: 'Kotlin', icon: '⬡' },
    { label: 'Android NDK', icon: '⬡' },
    { label: 'Linux Internals', icon: '⬡' },
    { label: 'LLVM / IR', icon: '⬡' },
    { label: 'Jetpack Compose', icon: '⬡' },
    { label: 'Kernel Modules', icon: '⬡' },
    { label: 'Distributed Systems', icon: '⬡' },
    { label: 'WebSockets', icon: '⬡' },
    { label: 'PySpark', icon: '⬡' },
    { label: 'AWS', icon: '⬡' },
    { label: 'PostgreSQL', icon: '⬡' },
    { label: 'ELF Internals', icon: '⬡' },
    { label: 'mDNS', icon: '⬡' },
    { label: 'uinput', icon: '⬡' },
];

// Duplicate for seamless loop
const ALL_ITEMS = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

export default function StatsTicker() {
    return (
        <div className="w-full overflow-hidden border-y border-[var(--color-geyser)]/8 py-4 relative my-0 z-10">
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[var(--color-quantum-black)] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[var(--color-quantum-black)] to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex items-center gap-12 whitespace-nowrap"
                animate={{ x: ['0%', '-33.333%'] }}
                transition={{
                    duration: 30,
                    ease: 'linear',
                    repeat: Infinity,
                }}
                style={{ width: 'max-content' }}
            >
                {ALL_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 shrink-0">
                        <span className="text-[var(--color-geyser)]/20 text-xs font-space">{item.icon}</span>
                        <span className="text-[11px] font-space tracking-[0.25em] uppercase text-[var(--color-geyser)]/40 hover:text-[var(--color-geyser)]/80 transition-colors duration-300">
                            {item.label}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
