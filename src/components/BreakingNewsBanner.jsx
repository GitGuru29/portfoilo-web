import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Radio, X } from 'lucide-react';
import useStore from '../store/useStore';
import {
    MAINTENANCE_CONFIG,
    MAINTENANCE_EVENT_NAME,
    getMaintenanceStatus,
} from '../data/maintenanceConfig';

export default function BreakingNewsBanner() {
    const [isActive, setIsActive] = useState(() => getMaintenanceStatus());
    const [isDismissed, setIsDismissed] = useState(() => {
        if (typeof window === 'undefined') return false;
        try {
            return sessionStorage.getItem('siluna_maintenance_banner_dismissed') === 'true';
        } catch {
            return false;
        }
    });

    useEffect(() => {
        const handleStatusChange = (e) => {
            if (e.detail && typeof e.detail.active === 'boolean') {
                setIsActive(e.detail.active);
                // When manually turned back on, reset dismissed status
                if (e.detail.active) {
                    setIsDismissed(false);
                    try {
                        sessionStorage.removeItem('siluna_maintenance_banner_dismissed');
                    } catch {}
                }
            } else {
                setIsActive(getMaintenanceStatus());
            }
        };

        window.addEventListener(MAINTENANCE_EVENT_NAME, handleStatusChange);
        window.addEventListener('storage', handleStatusChange);

        return () => {
            window.removeEventListener(MAINTENANCE_EVENT_NAME, handleStatusChange);
            window.removeEventListener('storage', handleStatusChange);
        };
    }, []);

    const handleDismiss = () => {
        setIsDismissed(true);
        try {
            sessionStorage.setItem('siluna_maintenance_banner_dismissed', 'true');
        } catch {}
    };

    if (!isActive || isDismissed) {
        return null;
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="w-full bg-[#8B0000] text-white border-b border-red-500/30 overflow-hidden relative z-50 shadow-md select-none"
                style={{
                    backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 12px, transparent 12px, transparent 24px)',
                }}
            >
                <div className="max-w-[86rem] mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3 text-xs">
                    {/* Left: Live Beacon + Badge */}
                    <div className="flex items-center gap-2.5 shrink-0">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-300" />
                        </span>
                        <span className="px-2 py-0.5 bg-black/40 border border-white/20 rounded font-mono text-[10px] tracking-[0.2em] uppercase font-bold text-red-100 flex items-center gap-1.5 shadow-sm">
                            <Radio className="w-3 h-3 text-red-300 animate-pulse" />
                            {MAINTENANCE_CONFIG.badge}
                        </span>
                    </div>

                    {/* Middle: Headline & Informative Message */}
                    <div className="flex-1 min-w-0 flex items-center gap-2 sm:gap-3 overflow-hidden">
                        <span className="font-space font-bold tracking-wide uppercase text-[11px] sm:text-xs text-white truncate shrink-0 hidden md:inline">
                            {MAINTENANCE_CONFIG.headline}:
                        </span>
                        <p className="font-sans text-[11px] sm:text-xs text-red-100/90 truncate font-medium m-0">
                            {MAINTENANCE_CONFIG.message}
                        </p>
                    </div>

                    {/* Right: Status Tag & Dismiss Button */}
                    <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 bg-black/30 border border-white/10 rounded font-mono text-[9px] tracking-wider uppercase text-emerald-300 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            {MAINTENANCE_CONFIG.statusNote}
                        </span>

                        <button
                            onClick={() => useStore.getState().setAdminModalOpen(true)}
                            title="Open Admin Maintenance Control Panel"
                            className="hidden sm:inline-flex px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 border border-white/20 font-mono text-[9px] uppercase tracking-wider text-red-100 hover:text-white transition-colors cursor-pointer"
                        >
                            Manage
                        </button>

                        {MAINTENANCE_CONFIG.allowDismiss && (
                            <button
                                onClick={handleDismiss}
                                title="Dismiss broadcast alert for this session"
                                aria-label="Dismiss banner"
                                className="p-1 rounded hover:bg-black/30 text-red-200 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

