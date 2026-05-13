import { create } from 'zustand';

export const MOODS = {
    HERO: 'HERO',
    OWL_MODE: 'OWL_MODE', // Default for projects
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
    isUnlocked: true,
    hasBooted: false, // Tracks if initial boot sequence is done
    isTerminalOpen: false, // Tracks if the floating terminal is currently open
    unlockSystem: () => set({ isUnlocked: true, hasBooted: true, isTerminalOpen: false }),
    lockSystem: () => set({ isUnlocked: false }),
    toggleTerminal: () => set((state) => ({ isTerminalOpen: !state.isTerminalOpen })),
}));

export default useStore;
