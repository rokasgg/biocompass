import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthSlice, createAuthSlice } from './slices/createAuthSlice';
import { createUserSlice, UserSlice } from './slices/createUserSlice';
import { createStatsSlice, StatsSlice } from './slices/createStatsSlice';
import { createUISlice, UISlice } from './slices/createUISlice';

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
    shareResearch?: boolean;
    leaderboardEnabled?: boolean;
}

export type AppState = AuthSlice & UserSlice & StatsSlice & UISlice

export const useStore = create<AppState>()(
    persist(
        (...a) => ({
            ...createAuthSlice(...a),
            ...createUserSlice(...a),
            ...createStatsSlice(...a),
            ...createUISlice(...a)
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),

        }
    )
)
