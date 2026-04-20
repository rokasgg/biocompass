import { AppState, UserProfile } from '../useStore';
import { StateCreator } from 'zustand'

export interface UserSlice {
    user: UserProfile | any,
    userId: String | any,
    score: number,
    setUser: (userData: UserProfile) => void,
    setUserId: (id: string) => void,
    updateScore: (newScore: number) => void,
    syncFromDB: (dbData: any) => void,
}

export const createUserSlice: StateCreator<AppState, [], [], UserSlice> = (set) => ({
    user: null,
    userId: null,
    score: 0,

    setUser: (userData) => set({
        user: userData,
        isLoggedIn: true,
    }),

    setUserId: (id) => set({
        userId: id
    }),

    updateScore: (newScore) => set({
        score: newScore
    }),

    // syncFromDB: (dbData) => set({
    //     user: dbData.profile,
    //     stats: dbData.breathingStats,
    //     score: dbData.currentScore,
    //     isLoggedIn: true,
    //     userCompletedReg: !!dbData.profile?.firstName
    // }),
    syncFromDB: (dbData) => set((state) => ({
        user: dbData.profile,
        score: dbData.currentScore || 0,
        // Jei dbData neturi stats (naujas vartotojas), paliekam tai, ką turim arba default
        stats: dbData.breathingStats || state.stats || { totalSessions: 0, byType: {}, history: [] },
        isLoggedIn: true,
        // Svarbiausia dalis: jei nėra vardo, vadinasi registracija nebaigta
        userCompletedReg: !!dbData.profile?.firstName
    })),
})