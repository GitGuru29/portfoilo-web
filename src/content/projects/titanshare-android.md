1. Executive Summary
  TitanShare is an Android-based remote management utility designed to bridge the gap between
  mobile devices and Linux environments (specifically Arch Linux). Unlike existing solutions that
  rely on manual IP entry or complex cloud relays, TitanShare implements Zero-Config LAN Discovery
  and a Custom Binary-Stream Protocol to provide near-zero latency control over system input, file
  transfers, and telemetry.

  2. Technical Objectives
   * Zero-Configuration: Eliminate the friction of manual networking setup using mDNS.
   * Low-Latency Input: Implement a responsive remote trackpad and keyboard interface.
   * Real-Time Telemetry: Stream system health (CPU, RAM, Temp) without taxing the host daemon.
   * Secure Pairing: Establish trust through a 6-digit PIN-based handshake over local TCP.

  3. System Architecture & Implementation

  A. Network Discovery (mDNS/Service Discovery)
  TitanShare utilizes the Android Network Service Discovery (NSD) API to locate the Linux daemon.
   * Protocol: _titanshare._tcp
   * Mechanism: The app listens for multicast DNS packets emitted by the Linux avahi-daemon.
   * Implementation: DiscoveryManager.kt handles the asynchronous lifecycle of service discovery,
     resolving hostnames to IPv4 addresses dynamically, allowing the app to function seamlessly
     even as DHCP leases change.

  B. Custom Communication Protocol
  The project utilizes a custom, lightweight TCP protocol designed for minimal overhead:
   * Handshake: AUTH:<6-digit-pin>\n ensures only authorized devices can issue commands.
   * Command Execution: CMD:<identifier>\n handles discrete actions (Volume, Power, Lock).
   * Data Streaming: JSON-encapsulated responses for telemetry (get_info) allow for easy
     extensibility of system stats.
   * File Transfer: Implements a state-based transfer logic:
       1. FILE_START:<name>:<size>
       2. Wait for READY_FOR_FILE ACK.
       3. Stream raw bytes in 16KB chunks to balance buffer usage and throughput.
       4. Signal completion with FILE_END.

  C. Remote Input Engineering
  The Remote Trackpad was a primary research challenge due to the risk of "socket flooding."
   * Solution: Implemented an accumulator-based movement strategy in TrackpadScreen.kt. Instead of
     sending every touch event, the app accumulates pixel deltas (accX, accY) and dispatches a
     MOUSE_MOVE command only when a threshold is met, significantly reducing network congestion
     while maintaining smooth cursor movement.

  D. UI/UX: Modern Glassmorphism
  The interface was developed using Jetpack Compose, adopting a Glassmorphism aesthetic to match
  the high-tech nature of the tool.
   * Visual Stack: Multi-layered Box layouts with radial gradients and frosted-glass borders
     (GlassCard.kt).
   * Performance: Utilized drawBehind and clip modifiers to ensure complex UI effects
     (blur/transparency) do not degrade frame rates on mid-range Android devices.

  4. Technical Stack
   * Language: Kotlin
   * UI Framework: Jetpack Compose (Material 3)
   * Architecture: MVVM (Model-View-ViewModel)
   * Concurrency: Kotlin Coroutines & StateFlow for reactive UI updates.
   * Networking: Java Socket API (TCP) + Android NsdManager.
   * Data Handling: Gson for telemetry serialization.

  5. Challenges & Solutions
   * Challenge: Reliable file transfers over unstable Wi-Fi.
   * Solution: Implemented a chunked output stream with progress tracking and a validation ACK from
     the daemon.
   * Challenge: Maintaining a "Live" feel for system stats.
   * Solution: A polling-based statsJob in the ViewModel that refreshes every 3 seconds, using a
     non-blocking StateFlow to update the UI without recomposition stutters.

  6. Conclusion & Future Research
  TitanShare demonstrates that a specialized, local-only protocol can outperform generic remote
  desktop solutions for specific system-management tasks. Future iterations of this research will
  focus on AES-256 encryption for the TCP stream and Low-Latency Screen Mirroring using H.264
  byte-stream parsing.
  