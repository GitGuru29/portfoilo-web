import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function TerminalSection() {
    const [history, setHistory] = useState([
        { text: "siluna@system:~$ ./start_portfolio.sh", type: 'cmd' },
        { text: "Initializing kernel... OK", type: 'sys' },
        { text: "Loading security modules... OK", type: 'sys' },
        { text: "Type 'help' to see available commands.", type: 'sys' }
    ]);
    const [input, setInput] = useState('');
    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    const commands = {
        'help': "Available commands: about, skills, system, contact, clear",
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
        <section className="w-full py-12 px-6 flex justify-center z-10 pointer-events-auto">
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
                className="w-full max-w-4xl bg-[#060606]/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-[0_0_40px_rgba(0,247,255,0.1)] overflow-hidden font-space"
                onClick={() => inputRef.current?.focus()}
            >
                {/* Window Header */}
                <div className="flex items-center px-4 py-3 bg-white/5 border-b border-white/5 relative">
                    <div className="flex gap-2 absolute left-4">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                    </div>
                    <div className="mx-auto text-xs text-gray-400 tracking-widest uppercase">root@siluna-mainframe:~</div>
                </div>

                {/* Terminal Body */}
                <div className="p-6 md:p-8 h-[350px] overflow-y-auto text-sm md:text-base flex flex-col gap-3 font-mono">
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
                            className="flex-1 bg-transparent outline-none text-white border-none placeholder-gray-700"
                            spellCheck="false"
                            autoComplete="off"
                            placeholder="Type a command..."
                        />
                    </div>
                    <div ref={bottomRef} className="pb-4" />
                </div>
            </motion.div>
        </section>
    );
}
