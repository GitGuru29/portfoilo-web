import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Folder, Home } from 'lucide-react';
import useStore from '../store/useStore';

export default function TerminalSection() {
    const isUnlocked = useStore((state) => state.isUnlocked);
    const unlockSystem = useStore((state) => state.unlockSystem);

    const [history, setHistory] = useState([
        { text: "Booting SilunaOS v1.0", type: 'sys' },
        { text: "Loading modules...", type: 'sys' },
        { text: "> AeroLang Compiler", type: 'out' },
        { text: "> NeonMonitor", type: 'out' },
        { text: "> Security Toolkit", type: 'out' },
        { text: "System Ready.", type: 'sys' },
        { text: "Type 'help' to see available commands, or 'start' to unlock.", type: 'sys' }
    ]);
    const [input, setInput] = useState('');
    const [cwd, setCwd] = useState('~');
    const [isRoot, setIsRoot] = useState(false);
    const [viewMode, setViewMode] = useState('terminal'); // 'terminal', 'htop', 'vim', 'panic'
    const [vimFile, setVimFile] = useState('');
    const [isAwaitingPassword, setIsAwaitingPassword] = useState(false);

    const inputRef = useRef(null);
    const bottomRef = useRef(null);

    const commands = {
        'help': "Available commands: whoami, about, skills, projects, github, resume, system, contact, clear, start, sudo unlock, ls, cd, cat",
        'whoami': "Siluna Nusal Dangalla\nSystems Developer | Android Engineer | Language Designer\nCreator of AeroLang",
        'about': "Siluna Nusal. Low-level systems engineer. I break things to build them stronger.",
        'skills': "[ C++, Rust, Kotlin, Python, Bash ] -> Focusing on Kernel internals, Android OS & reverse engineering.",
        'system': "System specs: Brain (Overclocked), Coffee (100%), Sleep (.05%).",
        'github': "GitHub Stats\n-------------\nRepos: 30+\nLanguages: C++, Kotlin, Python, JavaScript\nFocus: Systems, Security, Tooling\n\nLink: https://github.com/GitGuru29",
        'resume': "Downloading CV...\nView LinkedIn: linkedin.com/in/silunadangalla\nContact Email: minidusiluna29@gmail.com",
        'hack nasa': "Nice try.\nAccess denied.",
        'sudo make coffee': "☕ Brewing developer fuel...",
        'aero': "Launching AeroLang demo...\n\nfun main() {\n    println(\"Hello, Native Android!\")\n}",
        'contact': "Drop a packet at the form below or trace my node on GitHub.",
        'classified': "CLASSIFIED ROOT DIRECTIVE:\nProject 'SightLock v2' biometric payload analysis confirmed.\nProceed with caution."
    };

    const fileSystem = {
        '~': {
            type: 'dir',
            content: {
                'projects': { type: 'dir', content: ['aerolang.c', 'neon_monitor.cpp', 'sightlock.kt'] },
                'about.txt': { type: 'file', content: "Systems Developer and reverse engineering enthusiast.\nBuilding high-performance tools for bare metal and OS layers." },
                'resume.md': { type: 'file', content: "# Siluna Nusal Dangalla\n\n## Experience\n- Systems Development\n- Android Engine Architecture\n- Compiler Design" },
                'config': { type: 'dir', content: ['bashrc', 'vimrc'] }
            }
        },
        '~/projects': {
            type: 'dir',
            content: {
                'aerolang.c': { type: 'file', content: "#include <stdio.h>\n\nint main() {\n    printf(\"Initializing Lexer...\\n\");\n    return 0;\n}" },
                'neon_monitor.cpp': { type: 'file', content: "#include <iostream>\n\nvoid getCpuStats() {\n    std::cout << \"Parsing /proc/stat...\" << std::endl;\n}" },
                'sightlock.kt': { type: 'file', content: "class BiometricScanner {\n    fun verifyLiveness(): Boolean = true\n}" }
            }
        },
        '~/config': {
            type: 'dir',
            content: {
                'bashrc': { type: 'file', content: "alias ll='ls -la'\nalias gs='git status'" },
                'vimrc': { type: 'file', content: "set number\nsyntax on\nset tabstop=4" }
            }
        }
    };

    // Global keydown for Vim/Htop when input loses focus
    useEffect(() => {
        const handleGlobalKey = (e) => {
            if (viewMode === 'htop') {
                if (e.key === 'q' || e.key === 'Escape') {
                    setViewMode('terminal');
                    setHistory(prev => [...prev, { text: "Exited htop", type: 'sys' }]);
                }
            } else if (viewMode === 'vim') {
                // If focus is not on input, allow escape to enter command mode
                if (e.key === 'Escape' && document.activeElement !== inputRef.current) {
                    setInput(':');
                    inputRef.current?.focus();
                }
            }
        };

        window.addEventListener('keydown', handleGlobalKey);
        return () => window.removeEventListener('keydown', handleGlobalKey);
    }, [viewMode]);

    const handleCommand = (e) => {
        if (viewMode === 'htop') {
            return; // Handled by global listener
        }

        if (viewMode === 'vim') {
            if (e.key === 'Enter') {
                if (input === ':q' || input === ':wq' || input === ':q!') {
                    setViewMode('terminal');
                    setInput('');
                    setHistory(prev => [...prev, { text: "Exited vim", type: 'sys' }]);
                } else {
                    setInput('');
                }
            } else if (e.key === 'Escape') {
                setInput(':'); // start command mode
            }
            return;
        }

        if (e.key === 'Enter') {
            let cmd = input.trim();
            const originalInput = input;
            setInput('');
            let responseItems = [];

            if (isAwaitingPassword) {
                setIsAwaitingPassword(false);
                responseItems.push({ text: originalInput.replace(/./g, '*'), type: 'cmd', dir: cwd, isRoot: false });
                if (cmd === 'hunter2' || cmd === 'root') {
                    setIsRoot(true);
                    responseItems.push({ text: "Authentication successful. Root access granted.", type: 'sys' });
                } else {
                    responseItems.push({ text: "sudo: 3 incorrect password attempts", type: 'out' });
                }
                setHistory(prev => [...prev, ...responseItems]);
                return;
            }

            cmd = cmd.toLowerCase();

            if (cmd === 'clear') {
                setHistory([]);
                return;
            }

            // Log command
            responseItems.push({ text: originalInput, type: 'cmd', dir: cwd, isRoot });

            if (cmd === 'start' || cmd === 'sudo unlock') {
                responseItems.push({ text: "Authentication successful. Unlocking mainframe...", type: 'sys' });
                setHistory(prev => [...prev, ...responseItems]);
                setTimeout(() => unlockSystem(), 800);
                return;
            } else if (cmd === 'sudo rm -rf /' || cmd === 'crash') {
                setViewMode('panic');
                setTimeout(() => {
                    setViewMode('terminal');
                    setHistory([]);
                    setIsRoot(false);
                    setCwd('~');
                }, 3500);
                return;
            } else if (cmd === 'sudo su') {
                setIsAwaitingPassword(true);
                responseItems.push({ text: "[sudo] password for siluna:", type: 'sys' });
            } else if (cmd === 'htop') {
                setViewMode('htop');
                return;
            } else if (cmd.startsWith('vim ')) {
                const target = cmd.split(' ')[1];
                setVimFile(target || '');
                setViewMode('vim');
                setInput('');
                return;
            } else if (cmd === 'ls') {
                const currentDir = fileSystem[cwd];
                if (currentDir && currentDir.type === 'dir') {
                    const files = Object.keys(currentDir.content).map(k => {
                        const isDir = typeof currentDir.content[k] === 'object' && !currentDir.content[k].content;
                        return isDir || currentDir.content[k]?.type === 'dir' ? `<span class="text-blue-400 font-bold">${k}/</span>` : k;
                    }).join('  ');
                    responseItems.push({ text: files, type: 'html' });
                }
            } else if (cmd.startsWith('cd ')) {
                const target = cmd.split(' ')[1];
                if (target === '..') {
                    if (cwd !== '~') {
                        const parts = cwd.split('/');
                        parts.pop();
                        setCwd(parts.length === 0 ? '~' : parts.join('/'));
                    }
                } else if (target === '~' || target === '') {
                    setCwd('~');
                } else {
                    const newPath = cwd === '~' ? `~/${target}` : `${cwd}/${target}`;
                    if (fileSystem[newPath] && fileSystem[newPath].type === 'dir') {
                        setCwd(newPath);
                    } else if (fileSystem[cwd]?.content[target] && fileSystem[cwd].content[target].type === 'dir') {
                        setCwd(cwd === '~' ? `~/${target}` : `${cwd}/${target}`);
                    } else {
                        responseItems.push({ text: `cd: ${target}: No such file or directory`, type: 'out' });
                    }
                }
            } else if (cmd.startsWith('cat ')) {
                const target = cmd.split(' ')[1];
                const currentDir = fileSystem[cwd];
                if (currentDir && currentDir.content[target]) {
                    if (currentDir.content[target].type === 'file') {
                        responseItems.push({ text: currentDir.content[target].content, type: 'out' });
                    } else {
                        responseItems.push({ text: `cat: ${target}: Is a directory`, type: 'out' });
                    }
                } else {
                    responseItems.push({ text: `cat: ${target}: No such file or directory`, type: 'out' });
                }
            } else if (cmd === 'projects') {
                responseItems.push({ text: "-------------------------------", type: 'out' });
                responseItems.push({ text: "AeroLang", type: 'out' });
                responseItems.push({ text: "-------------------------------", type: 'out' });
                responseItems.push({ text: "Android native programming language", type: 'out' });
                responseItems.push({ text: "Lexer → Parser → AST → C++ → NDK → APK", type: 'out' });
                responseItems.push({ text: "github.com/GitGuru29/AeroLang", type: 'out' });
                responseItems.push({ text: " ", type: 'out' });

                responseItems.push({ text: "-------------------------------", type: 'out' });
                responseItems.push({ text: "NeonMonitor", type: 'out' });
                responseItems.push({ text: "-------------------------------", type: 'out' });
                responseItems.push({ text: "Linux system monitor written in C++", type: 'out' });
                responseItems.push({ text: "Real-time CPU / Memory / Process tracking", type: 'out' });
                responseItems.push({ text: "github.com/GitGuru29/NeoMonitor", type: 'out' });
                responseItems.push({ text: " ", type: 'out' });

                responseItems.push({ text: "-------------------------------", type: 'out' });
                responseItems.push({ text: "SightLock", type: 'out' });
                responseItems.push({ text: "-------------------------------", type: 'out' });
                responseItems.push({ text: "Android privacy and security tool", type: 'out' });
                responseItems.push({ text: "Biometric enrollment & liveness detection", type: 'out' });
                responseItems.push({ text: "github.com/GitGuru29/SightLock", type: 'out' });
                responseItems.push({ text: " ", type: 'out' });

                responseItems.push({ text: "-------------------------------", type: 'out' });
                responseItems.push({ text: "Bybridge", type: 'out' });
                responseItems.push({ text: "-------------------------------", type: 'out' });
                responseItems.push({ text: "Cross-Device Ecosystem Daemon", type: 'out' });
                responseItems.push({ text: "WebSocket / TCP / Custom H.264 RTP stream", type: 'out' });
                responseItems.push({ text: "github.com/GitGuru29/Bybridge", type: 'out' });
                responseItems.push({ text: " ", type: 'out' });

                responseItems.push({ text: "Hint: Use 'open <project>' or 'repo <project>' to view the repository.", type: 'sys' });
            } else if (cmd.startsWith('open ') || cmd.startsWith('repo ')) {
                const parts = cmd.split(' ');
                const projectName = parts[1] ? parts[1].toLowerCase() : '';

                const repos = {
                    'aerolang': 'https://github.com/GitGuru29/AeroLang',
                    'neonmonitor': 'https://github.com/GitGuru29/NeoMonitor',
                    'sightlock': 'https://github.com/GitGuru29/SightLock',
                    'bybridge': 'https://github.com/GitGuru29/Bybridge'
                };

                if (repos[projectName]) {
                    responseItems.push({ text: `Opening GitHub repository...`, type: 'sys' });
                    window.open(repos[projectName], '_blank');
                } else {
                    responseItems.push({ text: `Repository not found for: ${projectName}. Available: aerolang, neonmonitor, sightlock, bybridge`, type: 'out' });
                }
            } else if (cmd !== '') {
                const response = commands[cmd] || `zsh: command not found: ${cmd}`;
                responseItems.push({ text: response, type: 'out' });
            }

            setHistory(prev => [...prev, ...responseItems]);
        }
    };

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [history]);

    // Reusable Custom Prompt Component
    const CustomPrompt = ({ root, dir }) => (
        <div className="flex flex-col gap-1 mb-1 mt-3">
            <div className="flex items-center gap-2 text-[13px] font-bold">
                {/* Time Pill */}
                <div className={`flex items-center gap-1.5 ${root ? 'bg-red-500' : 'bg-[#74E1A6]'} text-[#0f172a] px-3 py-1 rounded-full`}>
                    <Clock size={12} strokeWidth={3} />
                    <span>0s</span>
                </div>
                {/* Tilde / Dir */}
                <span className="text-gray-400 font-normal">{dir || cwd}</span>
                {/* Path Pill */}
                <div className={`flex items-center gap-2 ${root ? 'bg-red-500' : 'bg-[#74E1A6]'} text-[#0f172a] px-3 py-1 rounded-full`}>
                    <Folder size={12} strokeWidth={3} />
                    <Home size={12} strokeWidth={3} />
                </div>
            </div>
            {/* Input Line indicator */}
            <div className={`flex items-center gap-2 ${root ? 'text-red-500' : 'text-[#60A5FA]'} ml-2 font-bold text-lg`}>
                <span className="text-[10px]">•</span>
                <span>{root ? '#' : '▶'}</span>
                {root && <span className="text-sm font-normal text-red-500 mr-2">root@mainframe</span>}
                {!root && <span className="text-sm font-normal text-gray-500 mr-2">siluna@portfolio</span>}
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

                            {/* Views */}
                            {viewMode === 'panic' && (
                                <div className="absolute inset-0 z-50 bg-[#0000aa] text-white p-8 font-mono overflow-hidden flex flex-col glitch-effect">
                                    <h1 className="bg-white text-[#0000aa] inline-block px-4 py-1 font-bold mb-4 w-max">Kernel Panic - not syncing</h1>
                                    <p className="mb-2">Fatal exception: VFS: Unable to mount root fs on unknown-block(0,0)</p>
                                    <p className="mb-2">CPU: 0 PID: 1 Comm: swapper/0 Not tainted 6.1.0-18-amd64 #1</p>
                                    <p className="mb-2">Hardware name: QEMU Standard PC (i440FX + PIIX, 1996)</p>
                                    <p className="mb-4">Call Trace:</p>
                                    <p className="text-red-300 ml-4 mb-1">? dump_stack+0x5c/0x8bf</p>
                                    <p className="text-red-300 ml-4 mb-1">? panic+0xe3/0x2c0</p>
                                    <p className="text-red-300 ml-4 mb-1">? mount_block_root+0x2fd/0x310</p>
                                    <p className="text-red-300 ml-4 mb-1">? mount_root+0x134/0x160</p>
                                    <p className="text-red-300 ml-4 mb-1">? prepare_namespace+0x13c/0x180</p>
                                    <p className="mt-8 animate-pulse text-yellow-300">Rebooting system in 3 seconds...</p>
                                </div>
                            )}

                            {viewMode === 'htop' && (
                                <div className="absolute inset-0 z-40 bg-black text-white p-4 font-mono text-xs overflow-hidden flex flex-col">
                                    <div className="flex justify-between mb-4">
                                        <div>
                                            <p>1  [|||||||||||||||||||||||85.0%]</p>
                                            <p>2  [||||||||||||||     35.0%]</p>
                                            <p>3  [|||              1.2%]</p>
                                            <p>4  [||||||||         20.5%]</p>
                                        </div>
                                        <div>
                                            <p>Tasks: 149, 451 thr; 1 running</p>
                                            <p>Load average: 1.15 1.05 0.99</p>
                                            <p>Uptime: 23 days, 15:42:01</p>
                                        </div>
                                    </div>
                                    <div className="bg-green-800 text-white flex gap-4 px-2 mb-1">
                                        <span className="w-12">PID</span>
                                        <span className="w-16">USER</span>
                                        <span className="w-12">PRI</span>
                                        <span className="w-12">NI</span>
                                        <span className="w-16">VIRT</span>
                                        <span className="w-16">RES</span>
                                        <span className="w-12">S</span>
                                        <span className="w-12">%CPU</span>
                                        <span className="w-12">%MEM</span>
                                        <span className="flex-1">Command</span>
                                    </div>
                                    <div className="flex flex-col gap-1 px-2 mb-auto">
                                        <div className="flex gap-4 text-green-300"><span className="w-12">1</span><span className="w-16">root</span><span className="w-12">20</span><span className="w-12">0</span><span className="w-16">225M</span><span className="w-16">10M</span><span className="w-12">R</span><span className="w-12">85.0</span><span className="w-12">0.1</span><span className="flex-1">/usr/bin/cpp_compiler struct_gen.cpp</span></div>
                                        <div className="flex gap-4"><span className="w-12">2</span><span className="w-16">siluna</span><span className="w-12">20</span><span className="w-12">0</span><span className="w-16">4.2G</span><span className="w-16">2.1G</span><span className="w-12">S</span><span className="w-12">60.0</span><span className="w-12">15.0</span><span className="flex-1">/opt/android/ndk/emulator</span></div>
                                        <div className="flex gap-4"><span className="w-12">3</span><span className="w-16">siluna</span><span className="w-12">20</span><span className="w-12">0</span><span className="w-16">16G</span><span className="w-16">12G</span><span className="w-12">S</span><span className="w-12">15.0</span><span className="w-12">75.0</span><span className="flex-1">/home/siluna/kernel_hacking_session</span></div>
                                        <div className="flex gap-4 text-gray-500"><span className="w-12">4</span><span className="w-16">root</span><span className="w-12">20</span><span className="w-12">0</span><span className="w-16">15M</span><span className="w-16">2M</span><span className="w-12">S</span><span className="w-12">0.0</span><span className="w-12">0.0</span><span className="flex-1">/sbin/init</span></div>
                                    </div>
                                    <div className="mt-4 opacity-50 text-[10px] animate-pulse">Press 'q' or 'Escape' to quit</div>
                                </div>
                            )}

                            {viewMode === 'vim' && (
                                <div className="absolute inset-0 z-40 bg-[#1a1b26] text-[#a9b1d6] p-2 font-mono flex flex-col">
                                    <div className="flex-1 overflow-hidden pl-4 pr-2 pt-2 whitespace-pre-wrap flex flex-col gap-1">
                                        <div className="flex text-blue-400">
                                            <span className="w-8 text-right text-[#565f89] mr-4">1</span>
                                            {fileSystem[cwd]?.content[vimFile]?.content?.split('\n')[0] || `"${vimFile}" [New File]`}
                                        </div>
                                        {fileSystem[cwd]?.content[vimFile]?.content?.split('\n').slice(1).map((line, idx) => (
                                            <div key={idx} className="flex text-blue-400">
                                                <span className="w-8 text-right text-[#565f89] mr-4">{idx + 2}</span>
                                                {line}
                                            </div>
                                        ))}
                                        {Array.from({ length: 15 }).map((_, i) => <div key={i} className="text-[#565f89]">~</div>)}
                                    </div>
                                    <div className="bg-[#74E1A6] text-[#1a1b26] px-2 py-0.5 mt-auto flex justify-between">
                                        <span className="font-bold uppercase">Insert</span>
                                        <span>{vimFile} 15L, 203C</span>
                                    </div>
                                    <div className="flex gap-2 text-white bg-black/50 px-2 py-1 items-center">
                                        <span>{input.startsWith(':') ? input : ':'}</span>
                                        <span className="w-2 h-4 bg-white/50 animate-pulse" />
                                    </div>
                                </div>
                            )}

                            {/* Content Layer */}
                            {viewMode === 'terminal' && (
                                <div className="relative z-10 font-mono">
                                    {history.map((line, i) => (
                                        <div key={i} className={`${line.type === 'cmd' ? 'mb-4 mt-2' : 'mb-1 leading-snug'}`}>
                                            {line.type === 'cmd' ? (
                                                <div className="flex flex-col gap-1">
                                                    <CustomPrompt root={line.isRoot} dir={line.dir} />
                                                    {/* Input Row for parsed command */}
                                                    <div className="flex items-center gap-2 text-[14px]">
                                                        <div className={`flex items-center gap-1.5 ${line.isRoot ? 'text-red-500' : 'text-[#60A5FA]'} ml-1`}>
                                                            <span className="text-white ml-12 pl-2 border-l border-white/20">{line.text}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : line.type === 'html' ? (
                                                <div className={`
                                                        ${line.type === 'sys' ? 'text-[#565f89]' : ''}
                                                        ${line.type === 'out' ? 'text-[#7dcfff]' : ''}
                                                        whitespace-pre-wrap
                                                    `}
                                                    dangerouslySetInnerHTML={{ __html: line.text }}
                                                />
                                            ) : (
                                                <div className={`
                                                        ${line.type === 'sys' ? 'text-[#565f89]' : ''}
                                                        ${line.type === 'out' ? 'text-[#7dcfff]' : ''}
                                                        whitespace-pre-wrap
                                                    `}
                                                >
                                                    {line.text}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Active Input Line */}
                                    <div className="flex flex-col mt-2 gap-1 mb-4">
                                        <CustomPrompt root={isRoot} dir={cwd} />
                                        {/* Input Row */}
                                        <div className="flex items-center gap-2 text-[14px]">
                                            <div className="w-12" /> {/* alignment spacer */}
                                            {isAwaitingPassword ? null : <span className={`text-[12px] leading-none mb-[1px] ${isRoot ? 'text-red-500' : 'text-[#60A5FA]'}`}>▶</span>}
                                            <input
                                                ref={inputRef}
                                                type={isAwaitingPassword ? "password" : "text"}
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
                            )}
                        </div>
                    </motion.div>

                    {/* Skip Button */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.5 }}
                        onClick={() => unlockSystem()}
                        className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 text-gray-400 hover:text-white font-mono text-sm tracking-widest transition-all flex items-center justify-center gap-2 px-6 py-3 rounded border border-white/20 hover:border-white/50 hover:bg-white/5 z-[110] pointer-events-auto bg-black/40 backdrop-blur whitespace-nowrap"
                    >
                        [ Skip Terminal → Enter Portfolio ]
                    </motion.button>
                </motion.section>
            )}
        </AnimatePresence>
    );
}
