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
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full max-w-5xl h-full max-h-[800px] bg-[#1a1b26] rounded-xl shadow-2xl overflow-hidden font-mono flex flex-col border border-white/5"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {/* Terminal Body */}
                        <div className="p-6 md:p-8 flex-1 overflow-y-auto text-[15px] leading-[1.6] flex flex-col font-mono text-[#a9b1d6]">
                            {history.map((line, i) => (
                                <div key={i} className="mb-2">
                                    {line.type === 'cmd' ? (
                                        <div>
                                            <CustomPrompt />
                                            <div className="ml-8 text-white">{line.text}</div>
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

                            <div className="flex flex-col">
                                <CustomPrompt />
                                <div className="flex items-center gap-3 ml-8">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleCommand}
                                        className="flex-1 bg-transparent outline-none text-white border-none placeholder-[#565f89]"
                                        spellCheck="false"
                                        autoComplete="off"
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div ref={bottomRef} className="pb-4" />
                        </div>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
