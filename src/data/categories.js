import { MOODS } from '../store/useStore';
import { Bot, ShieldAlert, Smartphone, Terminal, Cpu, LayoutGrid } from 'lucide-react';

export const CATEGORIES = {
    ALL: { id: 'all', label: 'All Projects', mood: MOODS.OWL_MODE, icon: LayoutGrid },
    AI: { id: 'ai', label: 'AI & Machine Learning', mood: MOODS.AI, icon: Bot },
    CYBER_SEC: { id: 'cyber-sec', label: 'Cyber Security', mood: MOODS.CYBER, icon: ShieldAlert },
    ANDROID_SYS: { id: 'android-sys', label: 'Android Internals', mood: MOODS.MOBILE, icon: Smartphone },
    LINUX_SYS: { id: 'linux-sys', label: 'Linux System Dev', mood: MOODS.LINUX, icon: Terminal },
    OS_DEV: { id: 'os-dev', label: 'OS Development', mood: MOODS.OS, icon: Cpu }
};

export const categoriesArray = Object.values(CATEGORIES);
