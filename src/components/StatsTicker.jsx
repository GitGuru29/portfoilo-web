import React from 'react';
import { motion } from 'framer-motion';

const TECH_ITEMS = [
    'C++',
    'Kotlin',
    'Android NDK',
    'Linux Internals',
    'LLVM / IR',
    'Jetpack Compose',
    'Kernel Modules',
    'Distributed Systems',
    'WebSockets',
    'PySpark',
    'AWS',
    'PostgreSQL',
    'ELF Internals',
    'Rust',
    'AOSP',
    'Binder IPC'
];

// Double it to ensure a seamless infinite loop
const ROW_A = [...TECH_ITEMS, ...TECH_ITEMS];

export default function StatsTicker() {
    return (
        <div className="stats-ticker-wrapper">
            {/* Left + Right edge fades */}
            <div className="ticker-fade ticker-fade--left" />
            <div className="ticker-fade ticker-fade--right" />

            {/* Massive Outline Text Marquee */}
            <motion.div
                className="ticker-track"
                animate={{ x: ['0%', '-50%'] }}
                transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
                style={{ width: 'max-content' }}
            >
                {ROW_A.map((item, i) => (
                    <React.Fragment key={`ticker-item-${i}`}>
                        <span className="ticker-text-large">{item}</span>
                        <span className="ticker-separator">·</span>
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    );
}
