import { create } from 'zustand';

export const MOODS = {
    HERO: 'HERO',
    OWL_MODE: 'OWL_MODE', // Default for projects
    NETWORKING: 'NETWORKING',
    MOBILE: 'MOBILE',
    OS: 'OS',
    AI: 'AI'
};

const useStore = create((set) => ({
    currentMood: MOODS.HERO,
    setMood: (mood) => set({ currentMood: mood }),
}));

export default useStore;
