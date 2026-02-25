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
        linuxReport: [
            {
                title: "1. Abstract",
                type: "text",
                content: "The proliferation of heterogeneous computing environments—spanning mobile, embedded, and desktop systems—demands seamless interoperability protocols. ByBridge addresses the fundamental challenge of unified cross-device control and multimedia streaming within the restrictive paradigms of modern Linux desktop environments (particularly Wayland). This report details the architectural design and system-level implementation of the ByBridge Linux subsystem, a multi-process orchestration engine combining hardware-level input emulation, low-latency video muxing, and asynchronous Inter-Process Communication (IPC)."
            },
            {
                title: "2. Problem Statement",
                type: "text",
                content: "Modern desktop ecosystems prioritize security through isolation. Display servers like Wayland explicitly prohibit global input injection and screen scraping to prevent keylogging and malicious monitoring. This paradigm fundamentally breaks traditional remote control application architectures (e.g., X11-based xdotool or x11vnc). Creating a high-performance bridge that enables Android-to-Linux screen mirroring and remote control requires circumventing these application-layer restrictions by interacting directly with the Linux kernel and implementing custom real-time video pipelines."
            },
            {
                title: "3. System Architecture",
                type: "text",
                content: "ByBridge is structured as a decentralized, multi-process architecture to decouple networking, mediacalculation, and UI rendering. The architecture is composed of four primary layers:"
            },
            {
                title: "3.1 Orchestration and Network Daemon (daemon.js)",
                type: "list",
                content: [
                    "Session Layer & Authentication: Generates cryptographic, time-rotated session keys exposed via dynamically generated QR codes, broadcasted alongside local IPv4 addresses.",
                    "Command Control Protocol: Implements a custom raw socket TCP server (Port 9999) utilizing a discrete CMD: protocol. This handles system-level directives (e.g., executing loginctl for session unlocking, qdbus for power state manipulation) and binary file transfers.",
                    "Process Lifecycle Management: Dynamically spawns and monitors child processes, including the GStreamer pipeline and the native C input driver, ensuring robust fault tolerance."
                ]
            },
            {
                title: "3.2 Hardware-Level Input Emulation (input_driver.c)",
                type: "list",
                content: [
                    "Virtual Device Instantiation: The driver programmatically requests the kernel to instantiate virtual generic HID devices (Bus: USB, Vendor: 0x1) specifically delineated into dedicated mouse and keyboard pipelines.",
                    "Low-Level Event Injection: It maps incoming ASCII streams via standard input pipes (from the Node daemon) directly to raw Linux input.h kernel events (EV_REL, EV_KEY, EV_SYN). This allows for true hardware-level simulation of keystrokes, relative mouse deltas, wheel scrolling, and stateful button toggles that the OS composite window manager interprets indistinguishably from physical hardware."
                ]
            },
            {
                title: "3.3 Low-Latency Video Pipeline (GStreamer & Bridge)",
                type: "list",
                content: [
                    "Decoupled Processing: A dedicated gst-launch-1.0 process consumes network video streams via User Datagram Protocol (UDP).",
                    "Pipeline Architecture: udpsrc -> rtpjitterbuffer -> rtph264depay -> h264parse -> mpegtsmux -> tcpserversink. This pipeline depacketizes RTP payloads, parses H.264 NAL units asynchronously, handles jitter compensation, and remuxes the stream into an MPEG Transport Stream (MPEG-TS).",
                    "Asynchronous Bridging: To interface the raw TCP byte stream with modern web APIs, an independent bridging process (tcp_ws_bridge.js) acts as a multiplexer, converting the TCP stream (Port 7000) into a broad-castable WebSocket binary stream (Port 8080)."
                ]
            },
            {
                title: "3.4 Presentation Layer (Electron & MediaSource Extensions)",
                type: "list",
                content: [
                    "IPC and UI Coordination: The main.js thread orchestrates the application view, listening to WebSocket health checks (ws://localhost:7001) to dynamically render BrowserView overlays over the main window hierarchy.",
                    "Raw Canvas Rendering (mirror.html): The renderer process fetches the incoming MPEG-TS WebSocket binary stream (as ArrayBuffer) and appends it iteratively directly into a hardware-accelerated SourceBuffer within the Media Source Extensions (MSE) API. Strict queueing and buffer management prevent playback stalling and frame dropping."
                ]
            },
            {
                title: "4. Novel Contributions & Technical Challenges",
                type: "list",
                content: [
                    "Bypassing Wayland Security Models: Designing an integration point at the kernel uinput layer rather than the display server layer successfully achieves remote control over hardened desktop environments. This involved intricate C-struct mapping for high-fidelity byte transmission to the /dev/uinput character device.",
                    "Deterministic Process Flow: A sophisticated graceful degradation and process-killing schema (start.sh cleanup sequences, SIGINT propagating) prevents zombie processes—a notorious issue when marrying Node.js child processes with GStreamer and C binaries.",
                    "MPEG-TS Over WebSocket: Traditional implementations utilize WebRTC, which demands complex signaling servers and STUN/TURN configurations. ByBridge radically simplifies this by using raw MPEG-TS over WebSockets, allowing Android clients to stream locally via UDP and displaying the result in HTML5 without web server overhead."
                ]
            },
            {
                title: "5. Future Scope and Conclusion",
                type: "list",
                content: [
                    "Bi-Directional Audio Streaming: Incorporating PulseAudio/PipeWire sink monitors into the GStreamer pipeline.",
                    "Dynamic Bitrate Scaling: Implementing TCP-based feedback loops to adjust the Android-side hardware encoder's bitrate relative to the rtpjitterbuffer latency.",
                    "Enhanced Cryptography: Transitioning from simple hashed hex keys to TLS-encrypted local sockets to ensure strict data confidentiality over local Area Networks."
                ]
            },
            {
                title: "Summary",
                type: "text",
                content: "This project showcases an integration of deep system-level C programming, complex networking protocols, real-time media manipulation, and modern JavaScript orchestration, culminating in a robust, multi-layer distributed local system."
            }
        ],
        linuxImages: [],
        androidReport: [
            {
                title: "1. Executive Summary",
                type: "text",
                content: "BYBRIDGE is a high-performance Android companion application designed to bridge the gap between mobile devices and desktop environments. Functioning as a secure, low-latency telemetry and control hub, the application establishes a bidirectional websocket-like TCP/UDP communication link with a host daemon. It features real-time system resource monitoring, remote execution of ACPI and media commands, robust file transfer capabilities, and a custom-implemented screen mirroring protocol utilizing H.264 encoding over RTP (Real-Time Transport Protocol)."
            },
            {
                title: "2. System Architecture & Core Technologies",
                type: "text",
                content: "The application is built upon a modern Android stack, leveraging both high-level UI frameworks and low-level system APIs to achieve its functionality."
            },
            {
                title: "Core Technologies",
                type: "list",
                content: [
                    "Languages & Frameworks: Kotlin, Android SDK (API 21-36), Material Design Components.",
                    "Computer Vision: Google ML Kit for high-speed, on-device Barcode/QR Code parsing to facilitate zero-configuration pairing.",
                    "Multimedia & Encoding: MediaProjection API for screen capture, MediaCodec for hardware-accelerated H.264 video compression, and VirtualDisplay for surface rendering.",
                    "Networking: Custom TCP sockets for telemetry and command transport; UDP Datagram sockets for real-time video streaming.",
                    "Concurrency: Multi-threaded architecture utilizing Java Executors, HandlerThread paradigms, and concurrent socket connections to prevent UI thread blocking and ensure fluid performance."
                ]
            },
            {
                title: "3.1. Zero-Configuration Pairing Protocol",
                type: "list",
                content: [
                    "To eliminate complex IP and port configuration, the system utilizes an optical pairing mechanism.",
                    "The desktop daemon generates a QR code containing the host's IP address and a cryptographically secure session key.",
                    "The Android application utilizes Android CameraX and Google ML Kit's Barcode Scanning API to process frames in real-time (ImageAnalysis.Analyzer).",
                    "Upon successful decoding, a TCP handshake is initiated via SessionManager, authenticating the session and establishing a persistent control channel."
                ]
            },
            {
                title: "3.2. Real-Time Telemetry and State Management",
                type: "list",
                content: [
                    "The application acts as a real-time monitoring dashboard for the host machine.",
                    "A dedicated polling thread runs at a 1Hz frequency (STAT_UPDATE_INTERVAL = 1000L), querying the daemon for system state (CPU load, RAM usage, storage metrics, battery level, network speed).",
                    "The JSON payloads are parsed and mapped to custom UI components (ProgressRingDrawable).",
                    "The UI gracefully degrades when the socket connection drops or times out, clearing the charts and indicating an offline state, demonstrating robust error handling."
                ]
            },
            {
                title: "3.3. Remote System and Media Control",
                type: "list",
                content: [
                    "Beyond monitoring, BYBRIDGE implements a comprehensive remote execution interface for host management.",
                    "ACPI and Power States: The application provides direct triggers for critical system power states, including remote Shutdown, Reboot, Sleep, and Lock commands.",
                    "Media Management: Real-time volume controls (Volume Up, Volume Down, Mute) are transmitted seamlessly over the TCP socket to the host daemon with near-zero latency, transforming the mobile device into a versatile media remote."
                ]
            },
            {
                title: "3.4. Asynchronous File Transfer Protocol",
                type: "list",
                content: [
                    "The file transfer module is engineered to reliably dispatch arbitrary files (documents, executables, media) from the Android device to the paired host safely over the network.",
                    "Memory Efficiency: Files are read sequentially utilizing a BufferedInputStream with a configured 16KB chunk size. This explicitly prevents OutOfMemoryError constraints when transferring multi-gigabyte files.",
                    "Throughput Profiling: The system continuously calculates transfer bandwidth by tracking byte transmission deltas against time intervals (every 500ms), driving a real-time Megabits per second (Mbps) UI metric.",
                    "OS Lifecycle Integration: File transfer progress is offloaded to a foreground-accessible progress bar and bound to NotificationManagerCompat. This sets a foreground-like state that attempts to prevent the Android OS from terminating the transfer process."
                ]
            },
            {
                title: "3.5. Low-Latency Screen Mirroring (RTP/H.264)",
                type: "text",
                content: "The standout technical achievement of the BYBRIDGE application is its custom implementation of a screen casting server, completely bypassing high-level abstractions like WebRTC in favor of a granular, low-level approach."
            },
            {
                title: "Mirroring Implementation",
                type: "list",
                content: [
                    "Hardware-Accelerated Encoding: The screen is captured using MediaProjectionManager and passed to a VirtualDisplay. The display surface is directly fed into an Android MediaCodec instance configured for VIDEO_AVC (H.264).",
                    "Resolution Optimization: To maintain stable framerates and avoid hardware encoder limitations (which often fault on odd-pixel widths), the application actively calculates display aspect ratios and aligns the output width to a multiple of 16 (Macroblock alignment).",
                    "RFC 6184 RTP Packetization: Instead of sending raw H.264 streams, the project features a fully custom RtpPacketizer that wraps NAL (Network Abstraction Layer) units into standard RTP packets.",
                    "Fragmentation: It parses the H.264 bitstream, detects start codes (00 00 00 01), extracts NAL units, and implements FU-A (Fragmentation Unit A) fragmentation. If a NAL unit exceeds the network MTU (1400 bytes), it is meticulously sliced and reconstructed with appropriate FU Indicator and FU Header bytes, guaranteeing delivery over UDP without IP-level packet fragmentation.",
                    "Synchronization: The packetizer manages its own Sequence Numbers, SSRC (Synchronization Source Identifier), and calculates accurate RTP timestamps based on presentation time, ensuring flawless lip-sync and frame pacing on the receiving decoder (e.g., GStreamer)."
                ]
            },
            {
                title: "4. Conclusion",
                type: "text",
                content: "BYBRIDGE is not merely a utility application; it is a profound demonstration of systems engineering within the Android ecosystem. By successfully integrating computer vision, concurrent socket programming, hardware-accelerated video encoding, and RFC-compliant network protocol implementation (RTP/H.264), the project showcases advanced competencies in network programming, multimedia processing, and system architecture. This positions the developer as highly capable of tackling complex, low-level engineering challenges in modern mobile environments."
            }
        ],
        androidImages: [],
        images: []
    },
    {
        id: 'aerolang',
        title: 'AeroLang',
        role: 'Compiler Development',
        mood: MOODS.OS,
        description: 'A custom compiled programming language built from scratch using C++ and LLVM. Currently in Lexer and Parser phase.',
        report: [
            {
                title: "Overview",
                type: "text",
                content: "AeroLang is an experimental Kotlin-influenced programming language designed to explore JVM-free Android application development. Instead of targeting the JVM, AeroLang transpiles to C++17 and integrates with the Android NDK toolchain, enabling applications to execute as native binaries.\n\nThe project focuses on understanding trade-offs between language ergonomics, runtime behaviour, native execution models, and developer tooling complexity."
            },
            {
                title: "Compilation / Transpilation Pipeline",
                type: "code",
                content: `.aero Source
    ↓  Lexer                 — Tokenisation & syntax primitives
    ↓  Parser                — Recursive-descent grammar
    ↓  Abstract Syntax Tree  — 30+ node variants
    ↓  Semantic Analysis     — Type resolution & scoping
    ↓  Code Generation       — C++17 + JNI bridge emission
    ↓  Runtime Library       — UI + collections + core utilities
    ↓  Android NDK / CMake   — Cross-compile to ARM / ARM64
    ↓
Native Android Binary

The compiler pipeline is implemented without LLVM dependency, emphasising deterministic transformations and direct backend control.`
            },
            {
                title: "Current Implementation Status",
                type: "list",
                content: [
                    "Production code: 7,850+ lines",
                    "Compiler architecture: Lexer → Parser → AST → Semantic Analysis → Code Generation",
                    "Grammar implementation: ~21K lines (recursive-descent)",
                    "AST model: 30+ node types using visitor patterns",
                    "Runtime library: Core utilities, collections, UI abstractions",
                    "UI components: 29 native wrappers",
                    "Example applications: 12",
                    "Completion estimate: ~65% toward v1.0"
                ]
            },
            {
                title: "Design & Exploration Focus",
                type: "list",
                content: [
                    "Kotlin-inspired syntax & control flow constructs",
                    "JVM-free execution model via C++ code generation",
                    "Automated JNI bridge generation",
                    "Static type resolution & semantic analysis",
                    "Native UI abstraction layer over Android APIs"
                ]
            },
            {
                title: "Key Technical Experiments",
                type: "text",
                content: "• Language Ergonomics vs Native Execution - Investigating how high-level Kotlin-like constructs map to deterministic native code generation.\n• JNI Bridge Auto-generation - Reducing manual JNI boilerplate through compiler-driven bindings.\n• Runtime Library Abstraction - Designing thin native wrappers for UI primitives and collections.\n• Generic Container Behaviour - Exploring compile-time type-aware container specialisation strategies."
            },
            {
                title: "Observations & Early Findings",
                type: "text",
                content: "Preliminary synthetic tests indicate predictable runtime characteristics and reduced startup overhead compared to managed runtime models. Precise performance evaluation and comparative benchmarking remain ongoing."
            },
            {
                title: "Planned Milestones",
                type: "list",
                content: [
                    "MVP Scope: Navigation primitives, Persistence layer (SQLite), Networking abstractions (HTTP / JSON)",
                    "v1.0 Direction: Background service model, Extended Android API coverage, Debugging & tooling support",
                    "Long-term Exploration: Package management & module system, Language tooling ecosystem"
                ]
            }
        ],
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
