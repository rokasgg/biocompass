import { create, StateCreator } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthSlice, createAuthSlice } from './slices/createAuthSlice';
import { createUserSlice, UserSlice } from './slices/createUserSlice';
import { createStatsSlice, StatsSlice } from './slices/createStatsSlice';

export type Habit = {
    id: string;
    title: string;
    streak: number;
    completedToday: boolean;
    createdAt: number;
};

export interface UserProfile {
    email: string;
    userId: string;

    username?: string;
    firstName?: string;
    lastName?: string;

    subscribed?: boolean;
    phone?: string;
    avatarUrl?: string;
    birthDate?: string | null;
}

interface BreathingStats {
    totalSessions: number;
    byType: Record<string, number>;
    history: Array<{ date: number; type: string; duration: number }>;
}


// export type AppState = ReturnType<typeof createAuthSlice> &
//     ReturnType<typeof createUserSlice> &
//     ReturnType<typeof createStatsSlice>;

export type AppState = AuthSlice & UserSlice & StatsSlice;


export const useStore = create<AppState>()(
    persist(
        (...a) => ({
            ...createAuthSlice(...a),
            ...createUserSlice(...a),
            ...createStatsSlice(...a),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
            // Optional: specify which parts of state to persist
            // partialize: (state) => ({ score: state.score, stats: state.stats }), 
        }
    )
)
