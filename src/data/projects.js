import { CATEGORIES } from './categories';
import bybridgeMd from '../content/projects/bybridge.md?raw';
import aerolangMd from '../content/projects/aerolang.md?raw';
import neonmonitorMd from '../content/projects/neonmonitor.md?raw';
import autogpuswitcherMd from '../content/projects/autogpuswitcher.md?raw';
import aegislayerMd from '../content/projects/aegislayer.md?raw';
import titanshareMd from '../content/projects/titanshare.md?raw';
import titanshareAndroidMd from '../content/projects/titanshare-android.md?raw';
import marketRegimeMd from '../content/projects/market-regime-intelligence.md?raw';

export const projectsData = [
    {
        id: 'aerolang',
        title: 'AeroLang',
        subtitle: 'Custom Compiled Language & LLVM Backend',
        role: 'Compiler Development / C++ & LLVM',
        categoryId: CATEGORIES.OS_DEV.id,
        year: '2025–2026',
        status: 'ACTIVE R&D',
        featured: true,
        link: 'https://aero-lang-web.vercel.app/',
        github: 'https://github.com/GitGuru29',
        stack: ['C++20', 'LLVM IR', 'Lexer / Parser', 'Android NDK', 'AST Lowering'],
        metrics: [
            { label: 'Target', value: 'LLVM IR / Native' },
            { label: 'Runtime', value: 'Zero-GC Deterministic' },
            { label: 'Pipeline', value: 'Lex → AST → SSA IR' },
        ],
        description: 'A custom compiled programming language built from scratch using C++ and LLVM. Engineered with a deterministic lexer, recursive-descent parser, AST verifier, and native Android NDK / Linux binary emission.',
        images: [
            '/aerolang/aero-1.png',
            '/aerolang/aero-2.jpg',
            '/aerolang/aero-3.jpg',
            '/aerolang/aero-4.jpg'
        ],
        content: aerolangMd
    },
    {
        id: 'aegislayer',
        title: 'AegisLayer',
        subtitle: 'Autonomous On-Device ML System Daemon',
        role: 'Android Systems / Machine Learning',
        categoryId: CATEGORIES.AI.id,
        year: '2026',
        status: 'SHIPPED',
        featured: true,
        github: 'https://github.com/GitGuru29',
        stack: ['Kotlin', 'Android Internals', 'Zero-Dep ML', 'Coroutines', 'System Services'],
        metrics: [
            { label: 'Footprint', value: '< 8 MB RAM' },
            { label: 'Inference', value: 'On-Device 0-Dep' },
            { label: 'Architecture', value: 'Event-Driven Daemon' },
        ],
        description: 'An autonomous, event-driven Android system daemon built entirely in Kotlin. Features an embedded Zero-Dependency Machine Learning Pipeline to passively learn and adjust device settings based on user habits.',
        images: ['/assets/aegislayer_dashboard.png'],
        content: aegislayerMd
    },
    {
        id: 'bybridge',
        title: 'Bybridge',
        subtitle: 'Cross-Device Linux & Android Ecosystem Daemon',
        role: 'C++ Daemon / WebSockets / H.264 RTP',
        categoryId: CATEGORIES.LINUX_SYS.id,
        year: '2024–2025',
        status: 'SHIPPED',
        featured: true,
        github: 'https://github.com/GitGuru29',
        stack: ['C++', 'POSIX Sockets', 'WebSockets', 'H.264 RTP', 'Kotlin', 'Biometrics'],
        metrics: [
            { label: 'Transport', value: 'TCP / WS / RTP' },
            { label: 'Telemetry', value: '1Hz /proc Polling' },
            { label: 'Security', value: 'Hardware Biometric' },
        ],
        description: 'A Cross-Device Ecosystem Daemon to control Arch Linux from Android, featuring real-time H.264 RTP screen streaming, hardware biometric authentication, and bidirectional socket synchronization.',
        images: [],
        linuxImages: [],
        androidImages: [
            '/bybridge/android-1.png',
            '/bybridge/android-2.png',
            '/bybridge/android-3.png',
            '/bybridge/android-4.png',
            '/bybridge/android-5.png'
        ],
        content: bybridgeMd
    },
    {
        id: 'titanshare',
        title: 'TitanShare',
        subtitle: 'Kernel uinput Emulation & mDNS Bridge',
        role: 'C++ Systems Integration / Linux',
        categoryId: CATEGORIES.LINUX_SYS.id,
        year: '2025',
        status: 'SHIPPED',
        github: 'https://github.com/GitGuru29',
        stack: ['C++', 'Linux uinput', 'mDNS / Avahi', 'systemd', 'Binary Protocol'],
        metrics: [
            { label: 'Input Layer', value: 'Kernel /dev/uinput' },
            { label: 'Discovery', value: 'Zero-Conf mDNS' },
            { label: 'Latency', value: '< 1.2 ms LAN' },
        ],
        description: 'A cross-platform integration suite bridging Android and Linux. Features a high-performance C++ daemon using uinput hardware emulation, mDNS discovery, and systemd integration for deep OS control.',
        images: [],
        content: titanshareMd
    },
    {
        id: 'market-regime-intelligence',
        title: 'Market Regime Intelligence',
        subtitle: 'Multi-Factor Quantitative Regime Classifier',
        role: 'Quantitative Researcher / Python & PySpark',
        categoryId: CATEGORIES.AI.id,
        year: '2026',
        status: 'SHIPPED',
        github: 'https://github.com/GitGuru29',
        stack: ['Python', 'PySpark', 'Quantitative ML', 'Regime Classification', 'Risk Engine'],
        metrics: [
            { label: 'Pipeline', value: 'Distributed PySpark' },
            { label: 'Model', value: 'Multi-Factor HMM/ML' },
            { label: 'Execution', value: 'Risk-Adaptive' },
        ],
        description: 'An AI-driven market intelligence system for cryptocurrency trading that classifies market regimes and implements risk-adaptive strategies using multi-factor quantitative analysis.',
        images: [],
        content: marketRegimeMd
    },
    {
        id: 'autogpuswitcher',
        title: 'AutoGpuSwitcher',
        subtitle: 'ELF Binary Analyzer & Pacman Hook Engine',
        role: 'Linux Systems Programming',
        categoryId: CATEGORIES.LINUX_SYS.id,
        year: '2024',
        status: 'SHIPPED',
        github: 'https://github.com/GitGuru29',
        stack: ['Bash', 'ELF Analysis', 'Arch Linux', 'pacman Hooks', 'PRIME / DRM'],
        metrics: [
            { label: 'Detection', value: 'ELF Symbol Inspection' },
            { label: 'Trigger', value: 'Pacman Transaction Hook' },
            { label: 'Overhead', value: '0% Runtime Daemon' },
        ],
        description: 'An automated GPU management framework for Arch Linux. Eliminates manual prime-run prefixes by dynamically detecting and intercepting graphics-heavy applications using pacman hooks and ELF binary analysis.',
        images: [],
        content: autogpuswitcherMd
    },
    {
        id: 'neonmonitor',
        title: 'NeonMonitor CLI',
        subtitle: 'Direct /proc Linux Process & Telemetry Monitor',
        role: 'Linux / C++ System Processing',
        categoryId: CATEGORIES.LINUX_SYS.id,
        year: '2024',
        status: 'SHIPPED',
        github: 'https://github.com/GitGuru29',
        stack: ['C++17', 'Linux /proc', 'ncurses TUI', 'POSIX Signals', 'VmRSS'],
        metrics: [
            { label: 'Data Source', value: 'Raw /proc/stat' },
            { label: 'CPU Overhead', value: '< 0.3% Core' },
            { label: 'Interface', value: 'Zero-Alloc TUI' },
        ],
        description: 'A lightweight C++ system utility for real-time process tracking, CPU delta telemetry, VmRSS memory auditing, and signal dispatch in Linux environments.',
        images: [],
        content: neonmonitorMd
    },
    {
        id: 'titanshare-android',
        title: 'TitanShare (Android)',
        subtitle: 'Zero-Config LAN & Binary-Stream Controller',
        role: 'Android / Network Programming',
        categoryId: CATEGORIES.ANDROID_SYS.id,
        year: '2025',
        status: 'SHIPPED',
        github: 'https://github.com/GitGuru29',
        stack: ['Kotlin', 'NSD / mDNS', 'Custom Binary Stream', 'Jetpack Compose', 'Coroutines'],
        metrics: [
            { label: 'Protocol', value: 'Packed Binary Frames' },
            { label: 'Discovery', value: 'Android NSD mDNS' },
            { label: 'Frame Rate', value: '120Hz Touch Poll' },
        ],
        description: 'An Android-based remote management utility with Zero-Config LAN Discovery and a Custom Binary-Stream Protocol for ultra-low-latency Linux workstation control.',
        images: [],
        content: titanshareAndroidMd
    },
    {
        id: 'gamemodex',
        title: 'GameModeX Controller',
        subtitle: 'Real-Time Android Game Telemetry & Overlay Engine',
        role: 'Android / Performance Optimization',
        categoryId: CATEGORIES.ANDROID_SYS.id,
        year: '2024',
        status: 'SHIPPED',
        stack: ['Kotlin', 'WindowManager', 'UsageStatsManager', 'Hardware Overlays', 'Android SDK'],
        metrics: [
            { label: 'Detection', value: 'Foreground Package Poll' },
            { label: 'UI Layer', value: 'System Hardware Overlay' },
        ],
        description: 'A system-level Android tool that detects games in real time and applies performance tuning and low-overhead HUD overlay controls to optimize frame pacing.',
        images: [],
        content: ''
    },
    {
        id: 'lankasmartmart',
        title: 'LankaSmartMart',
        subtitle: 'Native Compose E-Commerce with On-Device ML Kit',
        role: 'Android / Jetpack Compose & ML Kit',
        categoryId: CATEGORIES.ANDROID_SYS.id,
        year: '2024',
        status: 'SHIPPED',
        stack: ['Kotlin', 'Jetpack Compose', 'Google ML Kit', 'Firebase', 'Google Maps SDK'],
        metrics: [
            { label: 'UI Toolkit', value: '100% Jetpack Compose' },
            { label: 'Vision', value: 'ML Kit Card OCR' },
        ],
        description: 'A modern, secure E-Commerce Android application built with Jetpack Compose and Firebase featuring on-device ML Kit Card Scanning and real-time geolocation.',
        images: [],
        content: ''
    },
    {
        id: 'archtitan',
        title: 'ArchTitan OS',
        subtitle: 'Modular Developer-First Linux Distribution',
        role: 'OS Architecture / Linux',
        categoryId: CATEGORIES.OS_DEV.id,
        year: '2025',
        status: 'CONCEPT / WIP',
        stack: ['Arch Linux', 'Custom ISO / archiso', 'Dotfiles', 'Systemd', 'WM Scripting'],
        metrics: [
            { label: 'Base', value: 'Arch Linux Kernel' },
            { label: 'Target', value: 'Systems Engineering' },
        ],
        description: 'A modular Linux-based operating environment focused on developer productivity, deterministic automation, and hardware performance control.',
        images: [],
        content: ''
    },
    {
        id: 'gesture-interaction-system',
        title: 'Sensor Interaction Engine',
        subtitle: 'Touchless Camera & Proximity Media Control',
        role: 'Android Systems / Hardware Sensors',
        categoryId: CATEGORIES.ANDROID_SYS.id,
        year: '2024',
        status: 'EXPERIMENTAL',
        stack: ['Kotlin', 'SensorManager', 'CameraX Vision', 'Background Service', 'MediaSession'],
        metrics: [
            { label: 'Inputs', value: 'Proximity + CameraX' },
            { label: 'Mode', value: 'Zero-Touch Dispatch' },
        ],
        description: 'An experimental Android media control engine combining proximity hardware interrupts and camera vision pipelines for touchless gesture interaction.',
        images: [],
        content: ''
    }
];
