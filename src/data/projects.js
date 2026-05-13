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
        id: 'market-regime-intelligence',
        title: 'Market Regime Intelligence',
        role: 'Quantitative Researcher / Python Dev',
        categoryId: CATEGORIES.AI.id,
        description: 'An AI-driven market intelligence system for cryptocurrency trading that classifies market regimes and implements risk-adaptive strategies using multi-factor analysis.',
        images: [],
        content: marketRegimeMd
    },
    {
        id: 'titanshare-android',
        title: 'TitanShare (Android)',
        role: 'Android / Network Programming',
        categoryId: CATEGORIES.ANDROID_SYS.id,
        description: 'An Android-based remote management utility with Zero-Config LAN Discovery and a Custom Binary-Stream Protocol for low-latency system control.',
        images: [],
        content: titanshareAndroidMd
    },
    {
        id: 'titanshare',
        title: 'TitanShare',
        role: 'C++ Systems Integration',
        categoryId: CATEGORIES.LINUX_SYS.id,
        description: 'A cross-platform integration suite bridging Android and Linux. Features a high-performance C++ daemon using uinput hardware emulation, mDNS discovery, and systemd integration for deep OS control.',
        images: [],
        content: titanshareMd
    },
    {
        id: 'aegislayer',
        title: 'AegisLayer',
        role: 'Android Systems / Machine Learning',
        categoryId: CATEGORIES.AI.id,
        description: 'An autonomous, event-driven Android system daemon built entirely in Kotlin. Features an embedded Zero-Dependency Machine Learning Pipeline to passively learn and adjust device settings based on user habits.',
        images: ['/assets/aegislayer_dashboard.png'],
        content: aegislayerMd
    },
    {
        id: 'autogpuswitcher',
        title: 'AutoGpuSwitcher',
        role: 'Linux Systems Programming',
        categoryId: CATEGORIES.LINUX_SYS.id,
        description: 'An automated GPU management framework for Arch Linux. Eliminates manual prime-run prefixes by dynamically detecting and intercepting graphics-heavy applications using pacman hooks and ELF binary analysis.',
        images: [],
        content: autogpuswitcherMd
    },
    {
        id: 'gamemodex',
        title: 'Android Game System Controller',
        role: 'Android / Performance Optimization',
        categoryId: CATEGORIES.ANDROID_SYS.id,
        description: 'A system-level Android tool that detects games in real time and applies performance + overlay controls to improve gameplay experience.',
        images: [],
        content: ''
    },
    {
        id: 'bybridge',
        title: 'Bybridge',
        role: 'C++ Daemon / WebSockets',
        categoryId: CATEGORIES.LINUX_SYS.id,
        description: 'A Cross-Device Ecosystem Daemon to control Arch Linux from Android, including biometric integration and real-time device synchronization.',
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
        id: 'aerolang',
        title: 'AeroLang',
        role: 'Compiler Development',
        categoryId: CATEGORIES.OS_DEV.id,
        link: 'https://aero-lang-web.vercel.app/',
        description: 'A custom compiled programming language built from scratch using C++ and LLVM. Currently in Lexer and Parser phase.',
        images: [
            '/aerolang/aero-1.png',
            '/aerolang/aero-2.jpg',
            '/aerolang/aero-3.jpg',
            '/aerolang/aero-4.jpg'
        ],
        content: aerolangMd
    },
    {
        id: 'lankasmartmart',
        title: 'LankaSmartMart',
        role: 'Android / E-Commerce',
        categoryId: CATEGORIES.ANDROID_SYS.id,
        description: 'A modern, secure E-Commerce Android app built with Jetpack Compose & Firebase featuring ML Kit Card Scanning and Google Maps.',
        images: [],
        content: ''
    },
    {
        id: 'neonmonitor',
        title: 'Linux Process Monitoring CLI Tool',
        role: 'Linux / System Processing',
        categoryId: CATEGORIES.LINUX_SYS.id,
        description: 'A lightweight system utility for real-time process tracking and resource monitoring in Linux environments.',
        images: [],
        content: neonmonitorMd
    },
    {
        id: 'archtitan',
        title: 'ArchTitan OS',
        role: 'Concept / In Progress',
        categoryId: CATEGORIES.OS_DEV.id,
        description: 'A modular Linux-based system focused on developer productivity, automation, and performance control.',
        images: [],
        content: ''
    },
    {
        id: 'gesture-interaction-system',
        title: 'Sensor-Based Interaction System for Android',
        role: 'Android Systems / Sensors',
        categoryId: CATEGORIES.ANDROID_SYS.id,
        description: 'An experimental media control system using camera and proximity sensors for touchless interaction.',
        images: [],
        content: ''
    }
].sort((a, b) => a.title.localeCompare(b.title));
