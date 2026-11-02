/**
 * Maintenance & Breaking News Broadcast Configuration
 * 
 * Controls the live "BREAKING NEWS" dispatch ticker displayed across the portfolio.
 * When active, visitors are notified of ongoing system upgrades while retaining
 * 100% uninterrupted access to all projects, articles, and interactive systems.
 * 
 * You can toggle this:
 * 1. Directly in this file: change `enabled: true` or `false`
 * 2. In the Admin Panel (unlock with PIN: 22818) -> Maintenance Switch
 * 3. In the CLI Terminal: type `maintenance on` or `maintenance off`
 */

export const MAINTENANCE_CONFIG = {
    // Default switch: set to true when publishing or undergoing maintenance
    enabled: false,

    // Header badge
    badge: 'BREAKING NEWS // LIVE DISPATCH',

    // Main alert headline
    headline: 'SYSTEM UNDER ACTIVE MAINTENANCE & REVISION',

    // Full bulletin message
    message: 'Routine systems engineering updates and deployment in progress. All articles, project dossiers, repositories, and monographs remain fully accessible.',

    // Operational telemetry status note
    statusNote: 'ACCESS: UNRESTRICTED · BROWSING NOMINAL',

    // Whether visitors can temporarily dismiss the banner for their browser session
    allowDismiss: true,
};

export const MAINTENANCE_STORAGE_KEY = 'siluna_sys_maintenance_override';
export const MAINTENANCE_EVENT_NAME = 'siluna_sys_maintenance_toggle';

/**
 * Check if maintenance breaking news is currently active.
 * Checks localStorage override first (from Admin Panel / Terminal), falls back to MAINTENANCE_CONFIG.enabled.
 */
export function getMaintenanceStatus() {
    if (typeof window === 'undefined') return MAINTENANCE_CONFIG.enabled;
    try {
        const stored = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
        if (stored !== null) {
            return stored === 'true';
        }
    } catch {
        // Fallback to static config
    }
    return MAINTENANCE_CONFIG.enabled;
}

/**
 * Programmatically toggle or set maintenance status.
 * Updates localStorage and dispatches a window event so all open tabs update reactively.
 */
export function setMaintenanceStatus(active) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(MAINTENANCE_STORAGE_KEY, String(active));
    } catch (e) {
        console.error('Failed to save maintenance state to localStorage', e);
    }
    window.dispatchEvent(new CustomEvent(MAINTENANCE_EVENT_NAME, { detail: { active } }));
}

