import { StateCreator } from 'zustand';
import { AppState } from '../useStore';

export interface BreathingStats {
    totalSessions: number;
    byType: Record<string, number>;
    history: Array<{ date: number; type: string; duration: number }>;
}

export interface ActivityData {
    steps: number;
    calories: number;
    updatedAt: number;
}

export interface StatsSlice {
    // Duomenys
    stats: BreathingStats;
    screenTime: number; // minutėmis per dieną
    sleep: {
        hours: number;
        quality: string; // 'Good', 'Bad', 'Average'
    };
    activity: ActivityData;
    manifestationCount: number;

    // Veiksmai (Actions)
    addSession: (type: string, duration: number) => void;
    updateScreenTime: (minutes: number) => void;
    updateActivity: (steps: number, calories: number) => void;
    updateSleep: (hours: number, quality: string) => void;
    incrementManifestation: () => void;
}

export const createStatsSlice: StateCreator<AppState, [], [], StatsSlice> = (set) => ({
    // PRADINĖ BŪSENA
    stats: { totalSessions: 0, byType: {}, history: [] },
    screenTime: 0,
    sleep: { hours: 0, quality: 'Average' },
    activity: { steps: 0, calories: 0, updatedAt: Date.now() },
    manifestationCount: 0,

    // VEIKSMAI
    addSession: (type, duration) => set((state: any) => {
        const newByType = { ...state.stats.byType };
        newByType[type] = (newByType[type] || 0) + 1;

        return {
            stats: {
                totalSessions: state.stats.totalSessions + 1,
                byType: newByType,
                history: [
                    { date: Date.now(), type, duration },
                    ...state.stats.history
                ].slice(0, 50)
            }
        };
    }),

    updateScreenTime: (minutes) => set({ screenTime: minutes }),

    updateActivity: (steps, calories) => set({
        activity: { steps, calories, updatedAt: Date.now() }
    }),

    updateSleep: (hours, quality) => set({
        sleep: { hours, quality }
    }),

    incrementManifestation: () => set((state: any) => ({
        manifestationCount: state.manifestationCount + 1
    })),
});