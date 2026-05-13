# Research Report: AutoGpuSwitcher
**Project Status:** Phase 1 Complete (Detection & Pipeline) | Phase 2 In Progress (Interception)

## 1. Abstract
AutoGpuSwitcher is an automated GPU management framework designed for Linux distributions (initially targeting Arch Linux). The project aims to eliminate the manual effort of "right-clicking to run with discrete GPU" or prefixing commands with `prime-run`. By leveraging system-level hooks and binary analysis, AutoGpuSwitcher identifies graphics-intensive applications upon installation and ensures they are automatically routed to the high-performance discrete GPU (dGPU) at runtime.

## 2. Problem Statement
On Linux laptops with hybrid graphics (e.g., Intel/NVIDIA), power efficiency is maintained by using the Integrated GPU (iGPU) for desktop tasks and the Discrete GPU (dGPU) for demanding applications. However, manual management (PRIME render offload) is often required. Users must manually identify which apps need the dGPU and modify their launch configurations. This leads to:
- **Inconsistent Performance**: Heavy apps accidentally running on the iGPU.
- **Complexity**: Users needing to understand `LD_PRELOAD` or NVIDIA environment variables.
- **Maintenance Burden**: New updates or installs require manual re-configuration.

## 3. System Architecture
The system is divided into three major phases: Detection (Phase 1), Interception (Phase 2), and Integration (Phase 3).

### 3.1 Phase 1: The Detection Pipeline (Current State)
The core of the current implementation is a proactive detection system that monitors the package manager.
- **Pacman Hook**: A system-level hook (`/usr/share/libalpm/hooks/autogpuswitcher.hook`) triggers on every package installation or upgrade.
- **Static Analysis Engine**: Uses `ldd` and `file` to inspect ELF binaries. It specifically looks for linkages against "heavy" graphics libraries:
  - `libGL.so` / `libEGL.so` (OpenGL)
  - `libvulkan.so` (Vulkan)
  - `libOpenCL.so` (Compute/GPGPU)
- **Persistent State**: Detected apps are stored in a standardized registry (`/var/lib/autogpuswitcher/heavy_apps.list`) using the format: `package-name|app-name|/full/path/to/binary`

### 3.2 Phase 2: Interceptor & Launcher (Under Development)
The second phase introduces a C++ based lightweight interceptor.
- **Logic**: Before an application starts, the interceptor checks the `heavy_apps.list`.
- **Environment Injection**: If a match is found, it injects the necessary NVIDIA PRIME environment variables (e.g., `__NV_PRIME_RENDER_OFFLOAD=1`, `__GLX_VENDOR_LIBRARY_NAME=nvidia`).
- **Execution**: It then uses `execvp` to replace itself with the target application, ensuring zero runtime overhead once the app is launched.

## 4. Key Implementation Details

### Detection Heuristics
To avoid false positives (like background daemons that happen to link against a library for a single icon), the analyzer filters out:
- Shared library objects (`.so`)
- Debug artifacts (`.debug`)
- Non-executable paths (headers, documentation)
- System-critical packages that should remain on the iGPU (e.g., base system headers).

### Deployment Strategy
The project includes a robust installation script (`install_phase1.sh`) that sets up the system-wide environment:
- **Binary Path**: `/usr/lib/autogpuswitcher`
- **Config Path**: `/etc/autogpuswitcher/autogpuswitcher.conf`
- **State Path**: `/var/lib/autogpuswitcher`

## 5. Current Progress & Roadmap

| Feature | Status | Description |
| :--- | :--- | :--- |
| Pacman Integration | ✅ Done | Automatic analysis of new packages. |
| Binary Analysis | ✅ Done | ldd-based heavy library detection. |
| First-Run Scan | ✅ Done | Baseline scan of existing system apps. |
| C++ Interceptor | 🚧 WIP | Implementing the environment policy engine. |
| Desktop Integration | 📅 Planned | Automatic .desktop file wrapping. |
| Shell Integration | 📅 Planned | Bash/Zsh aliases for terminal apps. |

## 6. Technologies Used
- **Languages**: Bash (Automation/Analysis), C++17 (High-performance Interceptor).
- **Tools**: `ldd`, `pacman` (ALPM), CMake, `grep`/`awk`.
- **Target Platform**: Arch Linux (NVIDIA/Intel or NVIDIA/AMD hybrid setups).
