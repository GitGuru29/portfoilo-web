import { create } from 'zustand';

export const MOODS = {
    HERO: 'HERO',
    OWL_MODE: 'OWL_MODE',
    NETWORKING: 'NETWORKING',
    MOBILE: 'MOBILE',
    OS: 'OS',
    AI: 'AI',
    CYBER: 'CYBER',
    LINUX: 'LINUX'
};

const useStore = create((set) => ({
    currentMood: MOODS.HERO,
    setMood: (mood) => set({ currentMood: mood }),
    isUnlocked: false,
    hasBooted: false,
    isTerminalOpen: false,
    soundEnabled: true,
    accentTheme: 'gold', // 'gold' | 'cyan' | 'emerald'
    isCommandPaletteOpen: false,

    unlockSystem: () => set({ isUnlocked: true, hasBooted: true, isTerminalOpen: false }),
    lockSystem: () => set({ isUnlocked: false }),
    toggleTerminal: () => set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),
    toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
    setAccentTheme: (theme) => set({ accentTheme: theme }),
    setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
}));

export default useStore;
