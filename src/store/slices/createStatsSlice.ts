import { StateCreator } from 'zustand';
import { AppState } from '../useStore';

export interface ChartDataPoint { date: string; dayName: string; score: number; }
export interface DetoxCardData { show: boolean; title: string; text: string; count: number; }

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
    // Esami Duomenys
    stats: BreathingStats;
    dailyScore: number;
    screenTime: number;
    sleep: {
        hours: number;
        quality: string;
    };
    activity: ActivityData;
    manifestationCount: number;

    // NAUJA: Check-in būsenos
    hasCompletedMorningCheckIn: boolean;
    hasCompletedEveningCheckIn: boolean;

    lastActiveDate: string | null;
    checkAndResetDaily: () => void;

    // Esami Veiksmai (Actions)
    addSession: (type: string, duration: number) => void;
    updateScreenTime: (minutes: number) => void;
    updateActivity: (steps: number, calories: number) => void;
    updateSleep: (hours: number, quality: string) => void;
    incrementManifestation: () => void;
    setDailyScore: (score: number) => void;

    // NAUJA: Check-in veiksmai
    completeMorningCheckIn: () => void;
    completeEveningCheckIn: () => void;
    resetCheckIns: () => void;

    // Weekly feedback cache
    weeklyScores: ChartDataPoint[];
    statusMessage: string;
    detoxCard: DetoxCardData | null;
    yesterdayScreenTime: number | null;
    weeklyFeedbackFetchedAt: number | null;
    weeklyFocusMinutes: number;
    setWeeklyFeedback: (payload: {
        weeklyScores: ChartDataPoint[];
        statusMessage: string;
        detoxCard: DetoxCardData | null;
        yesterdayScreenTime: number | null;
        weeklyFocusMinutes: number;
    }) => void;

    // Profile / Settings cache
    profileStreak: number | null;
    mindfulMinutes: number;
    profileDataFetchedAt: number | null;
    setProfileData: (payload: { streak: number | null; sessionMinutes: number }) => void;
}

export const createStatsSlice: StateCreator<AppState, [], [], StatsSlice> = (set) => ({
    // PRADINĖ BŪSENA
    stats: { totalSessions: 0, byType: {}, history: [] },
    dailyScore: 0,
    screenTime: 0,
    sleep: { hours: 0, quality: 'Average' },
    activity: { steps: 0, calories: 0, updatedAt: Date.now() },
    manifestationCount: 0,

    // NAUJA: Check-in pradinės reikšmės
    hasCompletedMorningCheckIn: false,
    hasCompletedEveningCheckIn: false,

    lastActiveDate: null,

    // Weekly feedback cache
    weeklyScores: [],
    statusMessage: '',
    detoxCard: null,
    yesterdayScreenTime: null,
    weeklyFeedbackFetchedAt: null,
    weeklyFocusMinutes: 0,

    // Profile / Settings cache
    profileStreak: null,
    mindfulMinutes: 0,
    profileDataFetchedAt: null,

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

    setDailyScore: (score) => set({ dailyScore: score }),

    // NAUJA: Užfiksuojam ryto check-in sėkmę
    completeMorningCheckIn: () => set({ hasCompletedMorningCheckIn: true }),

    // NAUJA: Užfiksuojam vakaro check-in sėkmę
    completeEveningCheckIn: () => set({ hasCompletedEveningCheckIn: true }),

    // NAUJA: Metodas, kurį iškviesi naujos dienos pradžioje, kad kraneliai vėl atsidarytų
    resetCheckIns: () => set({
        hasCompletedMorningCheckIn: false,
        hasCompletedEveningCheckIn: false
    }),

    setProfileData: (payload) => set({
        profileStreak: payload.streak,
        mindfulMinutes: payload.sessionMinutes,
        profileDataFetchedAt: Date.now(),
    }),

    setWeeklyFeedback: (payload) => set({
        weeklyScores: payload.weeklyScores,
        statusMessage: payload.statusMessage,
        detoxCard: payload.detoxCard,
        yesterdayScreenTime: payload.yesterdayScreenTime,
        weeklyFocusMinutes: payload.weeklyFocusMinutes,
        weeklyFeedbackFetchedAt: Date.now(),
    }),

    checkAndResetDaily: () => set((state: any) => {
        const today = new Date().toDateString(); // Pvz: "Wed Jun 10 2026"

        // Jei data sutampa, nieko nedarom
        if (state.lastActiveDate === today) return {};

        // Jei nesutampa – prasidėjo nauja diena! Resetinam flag'us ir dienos counterius
        return {
            lastActiveDate: today,
            hasCompletedMorningCheckIn: false,
            hasCompletedEveningCheckIn: false,
            screenTime: 0, // Nauja diena – naujas ekrano laikas
            // čia galėsi resetinti ir kitus dienos habitus, jei reikės
        };
    }),
});