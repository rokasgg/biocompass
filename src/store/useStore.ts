import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Habit = {
    id: string;
    title: string;
    streak: number;
    completedToday: boolean;
    createdAt: number;
};

interface UserProfile {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    subscribed: boolean;
    phone: string;
    userId: string;
    avatarUrl?: string;
    birthDate?: string | null;
}

interface BreathingStats {
    totalSessions: number;
    byType: Record<string, number>;
    history: Array<{ date: number; type: string; duration: number }>;
}

interface AuthSlice {
    isLoggedIn: boolean;
    userId: string | null;
    login: (id: string) => void;
}

interface UserSlice {
    user: UserProfile | null;
    isLoggedIn: boolean;
    userCompletedReg: boolean;
    login: (sessionUser: any) => void;
    setUser: (userData: UserProfile) => void;
    syncFromDB: (dbData: any) => void;
}

interface StatsSlice {
    score: number;
    stats: BreathingStats;
    updateScore: (newScore: number) => void;
    addSession: (type: string, duration: number) => void;
}

interface AppState {
    /* STATE */
    count: number;
    score: number;
    stats: BreathingStats;
    isLoggedIn: boolean;
    isLoading: boolean;
    user: UserProfile | null;
    userId: string | null;
    email: string;
    userCompletedReg: boolean;

    /* ACTIONS */
    // Initial login with just Supabase Auth data
    login: (sessionUser: { id: string; email?: string, username?: string }) => void;

    // Fully clear store on logout
    logout: () => void;

    // Set/Update full profile data
    setUser: (userData: UserProfile) => void;

    // Toggle registration status (controls navigation)
    setUserCompletedReg: (value: boolean) => void;

    // Hydrate everything from Supabase Profiles table
    syncFromDB: (dbData: { profile: UserProfile; currentScore: number; breathingStats: BreathingStats }) => void;

    // Utility actions
    addSession: (type: string, duration: number) => void;
    setIsInitialLoading: (newValue: boolean) => void;
    updateScore: (newScore: number) => void;
    setUserId: (userId: string) => void;
    setInitialInfo: (userData: { email?: string; userId?: string }) => void;
}

// const createAuthSlice = (set: (newState: Partial<AuthSlice>) => void) => ({
//     isLoggedIn: false,
//     userID: null,
//     login: (data) => set({ userID: data.id, isLoggedIn: true }),
//     logout: () => set({ userID: null, isLoggedIn: false })
// })



type FullStoreState = AuthSlice & UserSlice  // & OtherSlices...

const createAuthSlice: StateCreator<FullStoreState, [], [], AuthSlice> = (set) => ({
    isLoggedIn: false,
    userId: null,
    login: (id) => set({ userId: id, isLoggedIn: true }),
});

const createUserSlice = (set) => ({
    user: null,
    userCompletedReg: false,
    setUser: (userData) => set({ user: userData }),
    setUserCompletedReg: () => set({ userCompletedReg: true })
})

export const useStore = create<AppState>()(
    persist(
        (set, get, api) => ({
            /* INITIAL STATE */
            count: 0,
            score: 0,
            user: null,
            userCompletedReg: false,
            email: '',
            userId: null,
            stats: { totalSessions: 0, byType: {}, history: [] },
            isLoggedIn: false,
            isLoading: true,

            /* ACTIONS */

            // Called immediately when Supabase Auth returns a session
            login: (sessionUser) => set({
                isLoggedIn: true,
                userId: sessionUser.id,
                user: {
                    userId: sessionUser.id,
                    email: sessionUser.email,
                    username: sessionUser.username,
                    firstName: '',
                    lastName: '',
                    phone: '',
                    subscribed: false,
                } as UserProfile // Add this "as UserProfile"
            },),

            logout: () => set({
                isLoggedIn: false,
                user: null,
                userId: null,
                userCompletedReg: false,
                score: 0,
                stats: { totalSessions: 0, byType: {}, history: [] }
            }),

            setUser: (userData) => set({
                user: userData,
                userId: userData.userId,
                isLoggedIn: true
            }),

            setUserCompletedReg: (value) => set({
                userCompletedReg: value
            }),

            setUserId: (id) => set({
                userId: id
            }),
            setInitialInfo: (userData) => set({
                email: userData.email,
                userId: userData.userId,
            }),

            setIsInitialLoading: (newValue) => set({
                isLoading: newValue
            }),

            syncFromDB: (dbData) => set({
                user: dbData.profile,
                score: dbData.currentScore,
                stats: dbData.breathingStats,
                userCompletedReg: true, // Syncing from DB implies they have a profile
                isLoggedIn: true
            }),

            updateScore: (newScore) => set({
                score: newScore
            }),

            addSession: (type, duration) => set((state) => {
                const newByType = { ...state.stats.byType };
                newByType[type] = (newByType[type] || 0) + 1;

                return {
                    stats: {
                        totalSessions: state.stats.totalSessions + 1,
                        byType: newByType,
                        history: [
                            { date: Date.now(), type, duration },
                            ...state.stats.history
                        ].slice(0, 50) // Keep last 50 sessions locally
                    }
                };
            }),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Optional: specify which parts of state to persist
            // partialize: (state) => ({ score: state.score, stats: state.stats }), 
        }
    )
);