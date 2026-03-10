import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';

const CODE_LINES = [
    "// GameModeX - System Optimizer",
    "fun boostGame(packageName: String) {",
    "    Log.i(TAG, \"Allocating maximum resources for $packageName\")",
    "    Runtime.getRuntime().exec(\"su -c 'echo performance > /sys/devices/system/cpu/cpu0/cpufreq/scaling_governor'\")",
    "}",
    "",
    "/* Bybridge Daemon - C++ Cross-Device Sync */",
    "void SyncManager::establishSecureConnection(const std::string& host) {",
    "    std::cout << \"[INFO] Connecting to \" << host << \" on port 8080...\\n\";",
    "    if (ssl_connect(socket, cert) == SUCCESS) {",
    "        this->state = CONNECTED;",
    "    }",
    "}",
    "",
    "// AeroLang - Tokenizer",
    "Token Lexer::nextToken() {",
    "    skipWhitespace();",
    "    if (currentChar() == '=') {",
    "        if (peek() == '>') return Token(FAT_ARROW);",
    "    }",
    "    return Token(EOF);",
    "}",
    "",
    "# NeonMonitor - Procfs reading",
    "def get_cpu_stats():",
    "    with open('/proc/stat', 'r') as f:",
    "        data = f.readline().split()",
    "    return calculate_load(data)",
    "",
    "// Initializing System Services",
    "systemctl start bybridge.service",
    "[ OK ] Started Cross-Device Communication Daemon.",
    "[ INFO ] Face Recognition Matrix Loaded."
];

export default function NightCodingScene() {
    const currentMood = useStore((state) => state.currentMood);
    const [visibleLines, setVisibleLines] = useState([]);

    useEffect(() => {
        if (currentMood === 'HERO') return;

        // Mobile optimization: Limit DOM nodes heavily on small screens
        const isMobile = window.innerWidth < 768;
        const maxLines = isMobile ? 12 : 35;

        let index = 0;
        const interval = setInterval(() => {
            setVisibleLines((lines) => {
                const newLines = [...lines, CODE_LINES[index]];
                // Keep the screen from overflowing indefinitely
                if (newLines.length > maxLines) newLines.shift();
                return newLines;
            });
            index = (index + 1) % CODE_LINES.length;
        }, 150); // fast typing speed

        return () => clearInterval(interval);
    }, [currentMood]);

    if (currentMood === 'HERO') return null;

    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-cyber-dark flex flex-col justify-end opacity-80 transition-opacity duration-1000">
            {/* Stylized dark vignette and ambient glows to make it atmospheric */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black z-10" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyber-cyan/30 via-transparent to-transparent"></div>

            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] opacity-40"></div>

            {/* The scrolling code terminal */}
            <div className="w-full h-full p-8 md:p-16 lg:p-32 font-mono text-xs md:text-sm text-cyber-cyan/80 whitespace-pre overflow-hidden relative z-0 mask-image-top-fade flex flex-col justify-end">
                {visibleLines.map((line, i) => (
                    <div key={i} className="animate-fade-in-up tracking-widest drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] font-bold">{line}</div>
                ))}
            </div>

            <style>{`
                .mask-image-top-fade {
                    mask-image: linear-gradient(to top, black 50%, transparent 100%);
                    -webkit-mask-image: linear-gradient(to top, black 50%, transparent 100%);
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.1s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
