# Research Report: TitanShare
**Project Status:** Version 2.0 (Active Development) | Native C++ Rewrite

## 1. Abstract
TitanShare is a cross-platform integration suite designed to bridge the functional gap between Android mobile devices and Linux desktops (specifically optimized for Arch Linux). By deploying a lightweight, high-performance C++ daemon on the host and a companion app on the mobile device, TitanShare enables seamless file transfers, remote system administration, biometric-aided security, and peripheral emulation over a local area network (LAN).

## 2. Problem Statement
Despite the open nature of Linux and Android, deep system-level integration often requires manual setup of multiple fragmented tools (SSH, KDE Connect, PulseAudio modules). Existing solutions often rely on heavy runtimes (Node.js/Electron) or desktop-environment-specific protocols. TitanShare addresses this by providing a unified, desktop-agnostic, and resource-efficient native implementation that offers:
- **Low-Latency Input**: Real-time mouse and keyboard emulation.
- **Zero-Config Discovery**: Automatic pairing without manual IP entry.
- **Deep System Control**: Direct access to power, volume, and session management via systemd and D-Bus.

## 3. System Architecture
TitanShare follows a Client-Server/Daemon-Controller model, where the Linux host acts as the server and the Android device acts as the secure controller.

### 3.1 The C++ Daemon (titanshare-daemon)
The core is an asynchronous, event-driven engine built with C++17.
- **Networking**: Uses an epoll-based TCP server (Port 9999) to handle concurrent client sessions with a custom state-machine protocol (AUTH → HEADER → DATA).
- **Discovery Engine**: Implements the mDNS/DNS-SD protocol via libavahi to advertise `_titanshare._tcp` services, allowing the Android app to "see" the PC instantly.
- **Security**: Implements a rolling window of 6-digit pairing PINs that auto-refresh every 5 minutes to prevent unauthorized access.

### 3.2 Inter-Process Communication (IPC) & UI
- **GUI**: A modern, frameless Qt6/QML interface displays the pairing PIN and discovery status.
- **Sync Mechanism**: The daemon and GUI communicate via a JSON-based IPC file in `/tmp`, allowing the UI to remain reactive to state changes in the background service.

## 4. Key Implementation Details

> [!NOTE]
> **Hardware Emulation (uinput)**
> TitanShare bypasses traditional X11/Wayland input limitations by writing directly to the Linux Kernel's `/dev/uinput` interface. This allows the Android device to act as a hardware-level HID (Human Interface Device), ensuring compatibility across all display servers (Xorg/Wayland).

> [!IMPORTANT]
> **Session & Power Management**
> The daemon interacts directly with `systemd-logind` via `loginctl` for session locking and unlocking. Notably, the Unlock Sequence is sophisticated enough to identify the active user on seat0 and perform session activation and DPMS screen wakeup, enabling biometric "Unlock PC with Phone Fingerprint" features.

> [!TIP]
> **Notification Bridge**
> By monitoring the D-Bus `org.freedesktop.Notifications` interface, the daemon intercepts system notifications and serializes them into JSON packets for the Android client. It also supports bidirectional flow, allowing Android to trigger Linux notifications via `notify-send`.

## 5. Current Progress & Roadmap

| Feature | Status | Implementation Detail |
| :--- | :--- | :--- |
| mDNS Discovery | ✅ Done | Native Avahi implementation. |
| Remote Input | ✅ Done | `/dev/uinput` mouse/keyboard/scroll. |
| File Transfer | ✅ Done | Binary stream with SHA-ready headers. |
| System Monitor | ✅ Done | Pure procfs/sysfs metric collection. |
| Biometric Lock | ✅ Done | loginctl session integration. |
| Screen Mirror | 🚧 WIP | GStreamer-based UDP streaming. |
| Desktop Integration | 🚧 WIP | Systemd user-service hardening. |

## 6. Technology Stack
- **Backend**: C++17, CMake, libsystemd, dbus-1, avahi-client.
- **Frontend (Linux)**: Qt 6.11, QML (Quick Controls), JavaScript.
- **Mobile**: Android SDK (Kotlin/Java), Gradle.
- **Key Dependencies**: nlohmann-json (Data), libqrencode (Pairing), pactl (Audio).


