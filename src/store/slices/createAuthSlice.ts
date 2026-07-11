import { StateCreator } from 'zustand';
import { AppState } from '../useStore';

export interface AuthSlice {
    isLoggedIn: boolean,
    isLoading: boolean,
    userCompletedReg: boolean,
    login: (sessionUser?: any) => void,
    logout: () => void,
    setIsInitialLoading: (value: boolean) => void,
    setUserCompletedRed: (value: boolean) => void
}

export const createAuthSlice: StateCreator<AppState, [], [], AuthSlice> = (set) => ({
    isLoggedIn: false,
    isLoading: false,
    userCompletedReg: false,

    login: (sessionUser) => set({
        isLoggedIn: true,
        user: sessionUser ? {
            userId: sessionUser.id,
            email: sessionUser.email,
        } : null
    }),

    logout: () => set({
        isLoggedIn: false,
        userCompletedReg: false,
        isLoading: false,
        user: null,
        userId: null,
        score: 0,
        stats: { totalSessions: 0, byType: {}, history: [] },
        screenTime: 0,
        sleep: { hours: 0, quality: 'Average' },
        activity: { steps: 0, calories: 0, updatedAt: Date.now() },
        manifestationCount: 0,
        dailyScore: 0,
        hasCompletedMorningCheckIn: false,
        hasCompletedEveningCheckIn: false,
        lastActiveDate: null,
        weeklyScores: [],
        statusMessage: '',
        detoxCard: null,
        yesterdayScreenTime: null,
        weeklyFeedbackFetchedAt: null,
        weeklyFocusMinutes: 0,
        profileStreak: null,
        mindfulMinutes: 0,
        profileDataFetchedAt: null,
    }),

    setIsInitialLoading: (value) => set({ isLoading: value }),
    setUserCompletedRed: (value) => set({ userCompletedReg: value })
})