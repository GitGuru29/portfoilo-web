![NetSpectre Cyber Defense Command](/assets/aegislayer_dashboard.png)

# Research Report: AegisLayer – Autonomous Android System Daemon

## Executive Summary
AegisLayer is a modular, event-driven Android system daemon designed to autonomously manage device behavior. Built entirely in Kotlin, it operates as a sophisticated hybrid system: combining the deterministic reliability of a highly-optimized Rule Execution Engine with an embedded On-Device Machine Learning Pipeline. By learning from user habits over time, AegisLayer automatically adjusts system settings (such as Do Not Disturb, brightness, volume, and screen orientation) without requiring manual configuration or cloud processing.

## Problem Statement & Motivation
Modern smartphone usage often requires repetitive, manual context-switching—like silencing the phone during meetings, lowering brightness when opening a PDF reader, or enabling auto-rotate for YouTube. Existing automation apps rely on rigid, user-defined triggers that demand technical setup and constant maintenance.

The goal of AegisLayer was to build an intelligent, zero-touch automation layer that:
1. Operates efficiently in the background without draining battery.
2. Learns passively from the user's actual behavior instead of requiring manual rule programming.
3. Respects absolute user privacy by performing all Natural Language Processing (NLP) and Machine Learning entirely on-device, independent of external ML bindings like TensorFlow or ONNX.

## Technical Architecture
AegisLayer is architected using a decoupled **Hybrid System** composed of two distinct layers:

### 1. The Execution Layer (Deterministic Control)
This layer is responsible for real-time, battery-efficient system manipulation. It runs as a persistent Android Foreground Service.
*   **Event Bus (`SharedFlow`)**: Monitors (App Foreground, Screen State, Battery) emit signals into a single asynchronous event bus.
*   **Context Builder**: Aggregates these signals into a flat state dictionary representing the device's real-time context.
*   **Edge-Triggered Rule Engine**: Evaluates the context dictionary against active rules. Crucially, it employs an *edge-triggered* design—meaning actions only fire at the exact moment a condition transitions to true. This prevents infinite execution loops (e.g., repeatedly firing "DISABLE_DND" while the screen remains on) and drastically reduces CPU cycles.
*   **Action Executor**: Interfaces directly with Android System APIs to modify device parameters (Brightness, DND policy, Volume).

### 2. The Intelligence Layer (Machine Learning Pipeline)
To provide genuine autonomy, the Intelligence Layer passively observes user actions and dynamically translates them into system rules.
*   **Usage Pattern Logger**: Captures a snapshot of the device's context every time the user manually changes a system setting.
*   **Multinomial Naive Bayes Classifier**: A custom-built, lightweight (< 150 lines of code) text classification model. It translates natural language user prompts (e.g., *"mute when Instagram opens"*) into strict system tags (`ACT_MUTE`, `COND_APP_INSTAGRAM`). By using logarithmic probability and Laplace smoothing, the model effectively infers intent without requiring bulky neural networks.
*   **Self-Learning "Night School"**: To ensure the ML pipeline does not impact daily battery life, training is heavily constrained. The `SelfLearningEngine` only triggers during off-peak hours (11 PM - 4 AM) or when the device has been docked and charging for at least 2 minutes. During this window, it generates synthetic training data from recent habits, rebuilds the ML model, and injects newly generated rules back into the Execution Layer.

## Key Technical Achievements

> [!TIP]
> **Zero-Dependency Machine Learning**
> Instead of embedding heavy third-party libraries (which can bloat APK size and memory overhead), AegisLayer utilizes a pure-Kotlin implementation of a Naive Bayes Classifier. This ensures near-instantaneous intent prediction while keeping the application footprint exceptionally small.

> [!IMPORTANT]
> **Battery-Optimized Evaluation**
> The transition from level-triggered to edge-triggered logic within the `RuleEngine` represents a significant optimization. By maintaining an `activeRuleIds` state, the daemon evaluates and executes system changes in `O(n)` time only during context state transitions, effectively neutralizing background battery drain.

> [!NOTE]
> **Concurrent State Management**
> By leveraging Kotlin Coroutines and `SharedFlow`, the daemon successfully multiplexes asynchronous events (system broadcasts, notification listeners, usage stats) into a synchronized, thread-safe execution pipeline.

## Conclusion
AegisLayer represents a paradigm shift from passive utility applications to active, intelligent system companions. By strictly separating deterministic rule execution from asynchronous machine learning, it achieves true autonomous device management without sacrificing battery life, performance, or user privacy. This project demonstrates advanced proficiency in Android system architecture, concurrent programming, and the implementation of efficient algorithmic models on resource-constrained devices.
