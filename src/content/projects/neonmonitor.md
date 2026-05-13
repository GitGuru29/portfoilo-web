# NeonMonitor 

## 1. Abstract
This report presents a comprehensive technical analysis of NeoMonitor, a Linux-based telemetry and task management system. The application bridges low-level kernel interfaces with a high-performance, immediate-mode graphical user interface (GUI). We evaluate the project's data acquisition strategies, the algorithmic complexity of its rendering pipeline—specifically its procedural "spiderweb fracture" engine—and its overall system architecture.

## 2. System Architecture
NeoMonitor employs a decoupled Model-View-Controller (MVC)-inspired architecture adapted for immediate mode GUI paradigms:

### System Architecture Layers
- **Data Acquisition Layer (parser.cpp, Parser.h)**: Acts as the system interface, directly interrogating the Linux virtual filesystems (`/proc` and `/sys`).
- **Abstraction and Control Layer (System.cpp, System.h)**: Serves as the aggregation mechanism, composing raw metric data into strongly typed C++ structures and providing control vectors (e.g., POSIX signal transmission for process management).
- **Presentation Layer (main_gui.cpp, main.cpp)**: Contains branching frontends. The CLI/Server variant (`main.cpp`) output streams minified JSON payloads for headless operation, while the primary GUI variant (`main_gui.cpp`) leverages SDL2, OpenGL 3, and Dear ImGui for hardware-accelerated rendering.

## 3. Data Acquisition Methodology
The system avoids heavyweight dependencies (e.g., libgtop or libprocps) in favor of direct file I/O operations against the Linux kernel's pseudofilesystems.

### 3.1. Telemetry Extraction
- **CPU Utilization**: Derived via `/proc/stat`. The system calculates delta changes between kernel time ticks (user, nice, system, idle, iowait, irq, softirq) to compute accurate instantaneous usage percentages.
- **Memory Consumption**: Extracted from `/proc/meminfo`, calculating usage as `100 × (MemTotal - MemAvailable) / MemTotal`. This correctly accounts for the page cache, providing a realistic view of memory pressure compared to naive MemFree calculations.
- **Network Traffic**: Parsed from `/proc/net/dev`, skipping loopback (lo) interfaces. It captures byte deltas (rx_bytes, tx_bytes) divided by elapsed time to yield KB/s. Connected state is validated by scanning `/sys/class/net/*/operstate` for "up" statuses.
- **Process Profiling**: Iterates through numeric directories in `/proc`. CPU usage per process is calculated by reading `/proc/[pid]/stat` (specifically utime, stime, cutime, cstime), normalizing against total system uptime (`/proc/uptime`) and system clock ticks (`sysconf(_SC_CLK_TCK)`). Memory is extracted via VmRSS in `/proc/[pid]/status`, representing Resident Set Size accurately.

### 3.2. Performance Implications
While direct POSIX file I/O is theoretically the most performant method of acquiring this data, the repeated instantiation of `std::ifstream` and `std::istringstream` in a tight loop (every 1.0s) introduces non-trivial overhead due to locale locking and dynamic memory allocation inherent to C++ standard streams. A more optimal approach for a high-frequency polling agent would utilize low-level unbuffered `open()`, `read()`, and custom integer-parsing routines.

## 4. UI Rendering and Procedural Generation
The graphical client relies on OpenGL and ImGui, operating in an immediate-mode paradigm where the UI lifecycle is rebuilt every frame.

### 4.1. The "Spiderweb Fracture" Engine
- **Mathematical Model**: The algorithm generates radial fractures with branching constraints. For an origin (x_0, y_0):
- **Core Shards**: Generates N=20 fragments with vectors v = ⟨r cos θ, r sin θ⟩ where θ ~ U(0, 2π) and r ~ U(2, 15).
- **Radial Spokes**: Creates S ~ U(7, 12) spokes with segmented variance. Each segment introduces a normal disruption controlled by a zig-zag factor z ~ U(-5, 5), producing jagged, realistic crack propagation.
- **Concentric Rings**: Interpolates midpoints between adjacent spokes with probabilistic displacement to simulate secondary glass stress fractures.
- **Kinematics**: Splinters possess rotational velocity (ω) and translational velocity (v), updated via Euler integration (p_t+1 = p_t + v Δt) and exponential decay (v_t+1 = v_t × 0.95).

### 4.2. UI Theming and Layout
The UI utilizes mathematical path stroking (PathArcTo, PathStroke) within the ImGui ImDrawList API to render high-fidelity radial progress bars. Data serialization is avoided entirely in the frontend loop, mapping directly from the System class accessors.

## 5. Security and Stability
Process control is exposed via standard POSIX signals (SIGTERM mapping to 15, SIGKILL mapping to 9). However, NeoMonitor currently lacks privilege elevation checks (setuid or PolicyKit integration). Consequently, `kill()` operations on processes owned by different user IDs (UIDs) or the root user will silently fail, returning EPERM.

## 6. Conclusion and Future Work
NeoMonitor stands as a robust, dependency-light systems programming example. To advance the project from a localized utility to enterprise-grade observability tooling, the following improvements are recommended:
- **Asynchronous Polling**: Transitioning blocking `/proc` reads to a background `std::thread` pool or utilizing epoll / inotify for reactive updates.
- **EBPF Integration**: Leveraging Extended Berkeley Packet Filter (eBPF) for deep kernel tracing, allowing for real-time observability without user-space context switching overhead.
- **Stream Buffer Optimization**: Replacing `std::ifstream` with memory-mapped files (mmap) or optimized POSIX reads to reduce the CPU tax of the monitor itself.
