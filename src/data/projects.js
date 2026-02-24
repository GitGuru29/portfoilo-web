import { MOODS } from '../store/useStore';

export const projectsData = [
    {
        id: 'gamemodex',
        title: 'GameModeX',
        role: 'Android / Performance Optimization',
        mood: MOODS.OS,
        description: 'A System-level Game Launcher & Optimizer for Android featuring 4K recording, AI Game Booster, and Thermal Monitoring. Built with Native Kotlin and Android System APIs.',
        images: []
    },
    {
        id: 'bybridge',
        title: 'Bybridge',
        role: 'C++ Daemon / WebSockets',
        mood: MOODS.NETWORKING,
        description: 'A Cross-Device Ecosystem Daemon to control Arch Linux from Android, including biometric integration and real-time device synchronization.',
        images: []
    },
    {
        id: 'aerolang',
        title: 'AeroLang',
        role: 'Compiler Development',
        mood: MOODS.OS,
        description: `AeroLang — Experimental Transpiled Language for Native Android
Overview
AeroLang is an experimental Kotlin-influenced programming language designed to explore JVM-free Android application development.
Instead of targeting the JVM, AeroLang transpiles to C++17 and integrates with the Android NDK toolchain, enabling applications to execute as native binaries.

The project focuses on understanding trade-offs between language ergonomics, runtime behaviour, native execution models, and developer tooling complexity.

Compilation / Transpilation Pipeline
.aero Source
    ↓  Lexer                 — Tokenisation & syntax primitives
    ↓  Parser                — Recursive-descent grammar
    ↓  Abstract Syntax Tree  — 30+ node variants
    ↓  Semantic Analysis     — Type resolution & scoping
    ↓  Code Generation       — C++17 + JNI bridge emission
    ↓  Runtime Library       — UI + collections + core utilities
    ↓  Android NDK / CMake   — Cross-compile to ARM / ARM64
    ↓
Native Android Binary

The compiler pipeline is implemented without LLVM dependency, emphasising deterministic transformations and direct backend control.

Current Implementation Status
Production code: 7,850+ lines
Compiler architecture: Lexer → Parser → AST → Semantic Analysis → Code Generation
Grammar implementation: ~21K lines (recursive-descent)
AST model: 30+ node types using visitor patterns
Runtime library: Core utilities, collections, UI abstractions
UI components: 29 native wrappers
Example applications: 12
Completion estimate: ~65% toward v1.0

Design & Exploration Focus
Kotlin-inspired syntax & control flow constructs
JVM-free execution model via C++ code generation
Automated JNI bridge generation
Static type resolution & semantic analysis
Native UI abstraction layer over Android APIs

Key Technical Experiments
Language Ergonomics vs Native Execution - Investigating how high-level Kotlin-like constructs map to deterministic native code generation.
JNI Bridge Auto-generation - Reducing manual JNI boilerplate through compiler-driven bindings.
Runtime Library Abstraction - Designing thin native wrappers for UI primitives and collections.
Generic Container Behaviour - Exploring compile-time type-aware container specialisation strategies.

Observations & Early Findings
Preliminary synthetic tests indicate predictable runtime characteristics and reduced startup overhead compared to managed runtime models. Precise performance evaluation and comparative benchmarking remain ongoing.

Planned Milestones
MVP Scope: Navigation primitives, Persistence layer (SQLite), Networking abstractions (HTTP / JSON)
v1.0 Direction: Background service model, Extended Android API coverage, Debugging & tooling support
Long-term Exploration: Package management & module system, Language tooling ecosystem`,
        images: [
            '/aerolang/aero-1.png',
            '/aerolang/aero-2.jpg',
            '/aerolang/aero-3.jpg',
            '/aerolang/aero-4.jpg'
        ]
    },
    {
        id: 'lankasmartmart',
        title: 'LankaSmartMart',
        role: 'Android / E-Commerce',
        mood: MOODS.MOBILE,
        description: 'A modern, secure E-Commerce Android app built with Jetpack Compose & Firebase featuring ML Kit Card Scanning and Google Maps.',
        images: []
    },
    {
        id: 'neonmonitor',
        title: 'NeonMonitor',
        role: 'Linux / System Processing',
        mood: MOODS.AI,
        description: 'A high-performance Linux task manager and resource monitor utilizing Procfs and system calls for real-time tracking.',
        images: []
    }
];
