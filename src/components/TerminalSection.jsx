import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';

export default function TerminalSection() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const unlockSystem = useStore((state) => state.unlockSystem);

    const [history, setHistory] = useState([
        { text: "siluna@system:~$ ./start_portfolio.sh", type: 'cmd' },
        { text: "Initializing kernel... OK", type: 'sys' },
        { text: "Loading security modules... OK", type: 'sys' },
        { text: "Type 'help' to see available commands, or 'start' to bypass.", type: 'sys' }
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
                responseItems.push({ text: `siluna@system:~$ ${input}`, type: 'cmd' });
                responseItems.push({ text: "Authentication successful. Unlocking mainframe...", type: 'sys' });
                setHistory(prev => [...prev, ...responseItems]);
                setInput('');
                setTimeout(() => {
                    unlockSystem();
                }, 800);
                return;
            } else if (cmd !== '') {
                const response = commands[cmd] || `bash: ${cmd}: command not found`;
                responseItems.push({ text: `siluna@system:~$ ${input}`, type: 'cmd' });
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

    return (
        <AnimatePresence>
            {!isUnlocked && (
                <motion.section
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[100] w-full h-screen bg-[#020202] flex items-center justify-center p-4 md:p-12 pointer-events-auto"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full max-w-5xl h-full max-h-[800px] bg-[#060606] rounded-xl border border-white/10 shadow-[0_0_60px_rgba(0,247,255,0.05)] overflow-hidden font-space flex flex-col"
                        onClick={() => inputRef.current?.focus()}
                    >
                        {/* Window Header */}
                        <div className="flex items-center px-4 py-3 bg-[#0a0a0a] border-b border-white/5 relative shrink-0">
                            <div className="flex gap-2 absolute left-4">
                                <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                            </div>
                            <div className="mx-auto text-xs text-gray-500 tracking-widest uppercase font-mono">root@siluna-mainframe:~</div>
                        </div>

                        {/* Terminal Body */}
                        <div className="p-6 md:p-8 flex-1 overflow-y-auto text-sm md:text-base flex flex-col gap-3 font-mono">
                            {history.map((line, i) => (
                                <div key={i} className={`
                                    ${line.type === 'cmd' ? 'text-cyber-pink' : ''}
                                    ${line.type === 'sys' ? 'text-gray-500' : ''}
                                    ${line.type === 'out' ? 'text-cyber-cyan' : ''}
                                `}>
                                    {line.text}
                                </div>
                            ))}

                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-cyber-violet font-bold">siluna@system:~$</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleCommand}
                                    className="flex-1 bg-transparent outline-none text-white border-none placeholder-gray-800"
                                    spellCheck="false"
                                    autoComplete="off"
                                    autoFocus
                                    placeholder="Type a command..."
                                />
                            </div>
                            <div ref={bottomRef} className="pb-4" />
                        </div>
                    </motion.div>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
