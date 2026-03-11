import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Folder, Home } from 'lucide-react';
import useStore from '../store/useStore';

export default function TerminalSection() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const unlockSystem = useStore((state) => state.unlockSystem);

    const [history, setHistory] = useState([
        { text: "siluna portfolio --init", type: 'cmd' },
        { text: "Loading mainframe components...", type: 'sys' },
        { text: "Type 'help' to see available commands, or 'start' to unlock.", type: 'sys' }
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    const commands = {
        'help': "Available commands: about, skills, system, contact, clear, start, sudo unlock",
        'about': "Siluna Nusal. Low-level systems engineer. I break things to build them stronger.",
        'skills': "[ C++, Rust, Kotlin, Python, Bash ] -> Focusing on Kernel internals, Android OS & reverse engineering.",
        'system': "System specs: Brain (Overclocked), Coffee (100%), Sleep (.05%).",
        'contact': "Drop a packet at the form below or trace my node on GitHub.",
    };

    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const cmd = input.trim().toLowerCase();
            let responseItems = [];

            if (cmd === 'clear') {
                setHistory([]);
                setInput('');
                return;
            } else if (cmd === 'start' || cmd === 'sudo unlock') {
                responseItems.push({ text: input, type: 'cmd' });
                responseItems.push({ text: "Authentication successful. Unlocking mainframe...", type: 'sys' });
                setHistory(prev => [...prev, ...responseItems]);
                setInput('');
                setTimeout(() => {
                    unlockSystem();
                }, 800);
                return;
            } else if (cmd !== '') {
                const response = commands[cmd] || `zsh: command not found: ${cmd}`;
                responseItems.push({ text: input, type: 'cmd' });
                responseItems.push({ text: response, type: 'out' });
            }

            setHistory(prev => [...prev, ...responseItems]);
            setInput('');
        }
    };

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    // Reusable Custom Prompt Component
    const CustomPrompt = () => (
        <div className="flex flex-col gap-1 mb-1 mt-3">
            <div className="flex items-center gap-2 text-[13px] font-bold">
                {/* Time Pill */}
                <div className="flex items-center gap-1.5 bg-[#74E1A6] text-[#0f172a] px-3 py-1 rounded-full">
                    <Clock size={12} strokeWidth={3} />
                    <span>0s</span>
                </div>
                {/* Tilde */}
                <span className="text-gray-400 font-normal">~</span>
                {/* Path Pill */}
                <div className="flex items-center gap-2 bg-[#74E1A6] text-[#0f172a] px-3 py-1 rounded-full">
                    <Folder size={12} strokeWidth={3} />
                    <Home size={12} strokeWidth={3} />
                </div>
            </div>
            {/* Input Line indicator */}
            <div className="flex items-center gap-2 text-[#60A5FA] ml-2 font-bold text-lg">
                <span className="text-[10px]">•</span>
                <span>▶</span>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {!isUnlocked && (
                <motion.section
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] w-full h-screen bg-[#09090b] flex items-center justify-center p-4 md:p-8 pointer-events-auto"
                >
                    {/* Terminal Window */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full max-w-5xl h-full max-h-[800px] bg-[#1a1b26] rounded-xl shadow-2xl overflow-hidden font-mono flex flex-col border border-white/5 relative z-10"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {/* Terminal Body */}
                        <div className="relative p-6 md:p-8 flex-1 overflow-y-auto text-[15px] leading-[1.6] flex flex-col font-mono text-[#a9b1d6]">

                            {/* Background Image Overlay */}
                            <div
                                className="absolute inset-0 z-0 opacity-15 pointer-events-none"
                                style={{
                                    backgroundImage: "url('/assets/kitty_bg.png')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    backgroundRepeat: "no-repeat",
                                }}
                            />

                            {/* Content Layer */}
                            <div className="relative z-10 font-mono">
                                {history.map((line, i) => (
                                    <div key={i} className={`${line.type === 'cmd' ? 'mb-4 mt-2' : 'mb-1 leading-snug'}`}>
                                        {line.type === 'cmd' ? (
                                            <div className="flex flex-col gap-1">
                                                {/* Pill Row */}
                                                <div className="flex items-center gap-2 text-[12px] font-bold">
                                                    <div className="flex items-center gap-1.5 bg-[#74E1A6] text-[#0f172a] px-3 py-0.5 rounded-full">
                                                        <Clock size={11} strokeWidth={3} />
                                                        <span>0s</span>
                                                    </div>
                                                    <span className="text-gray-400 font-normal">~</span>
                                                    <div className="flex items-center gap-2 bg-[#74E1A6] text-[#0f172a] px-3 py-0.5 rounded-full">
                                                        <Folder size={11} strokeWidth={3} />
                                                        <Home size={11} strokeWidth={3} />
                                                    </div>
                                                </div>
                                                {/* Input Row */}
                                                <div className="flex items-center gap-2 text-[14px]">
                                                    <div className="flex items-center gap-1.5 text-[#60A5FA] ml-1">
                                                        <span className="text-[10px]">•</span>
                                                        <span className="text-[12px] leading-none mb-[1px]">▶</span>
                                                    </div>
                                                    <div className="text-white ml-1">{line.text}</div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className={`
                                                    ${line.type === 'sys' ? 'text-[#565f89]' : ''}
                                                    ${line.type === 'out' ? 'text-[#7dcfff]' : ''}
                                                `}>
                                                {line.text}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Active Input Line */}
                                <div className="flex flex-col mt-2 gap-1 mb-4">
                                    {/* Pill Row */}
                                    <div className="flex items-center gap-2 text-[12px] font-bold">
                                        <div className="flex items-center gap-1.5 bg-[#74E1A6] text-[#0f172a] px-3 py-0.5 rounded-full">
                                            <Clock size={11} strokeWidth={3} />
                                            <span>0s</span>
                                        </div>
                                        <span className="text-gray-400 font-normal">~</span>
                                        <div className="flex items-center gap-2 bg-[#74E1A6] text-[#0f172a] px-3 py-0.5 rounded-full">
                                            <Folder size={11} strokeWidth={3} />
                                            <Home size={11} strokeWidth={3} />
                                        </div>
                                    </div>
                                    {/* Input Row */}
                                    <div className="flex items-center gap-2 text-[14px]">
                                        <div className="flex items-center gap-1.5 text-[#60A5FA] ml-1">
                                            <span className="text-[10px]">•</span>
                                            <span className="text-[12px] leading-none mb-[1px]">▶</span>
                                        </div>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={handleCommand}
                                            className="flex-1 bg-transparent outline-none text-white border-none placeholder-[#565f89] ml-1"
                                            spellCheck="false"
                                            autoComplete="off"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <div ref={bottomRef} className="pb-4" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Skip Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                        onClick={() => unlockSystem()}
                        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-gray-400 hover:text-white font-mono text-sm tracking-widest transition-colors flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/5 z-[110] pointer-events-auto"
                    >
                        SKIP <span className="text-lg leading-none">→</span>
                    </motion.button>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
