import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Habit = {
    id: string;
    title: string;
    streak: number; // days in a row
    completedToday: boolean;
    createdAt: number;
};

interface AppState {
    count: number;
    inc: () => void;
    habits: Habit[];
    addHabit: (title: string) => void;
    toggleComplete: (id: string) => void;
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            count: 0,
            inc: () => set((state) => ({ count: state.count + 1 })),
            isLoggedIn: false,
            login: () => set(() => ({ isLoggedIn: true })),
            logout: () => set(() => ({ isLoggedIn: false })),
            habits: [],
            addHabit: (title: string) =>
                set((state) => ({
                    habits: [
                        ...state.habits,
                        {
                            id: Date.now().toString(),
                            title,
                            streak: 0,
                            completedToday: false,
                            createdAt: Date.now(),
                        },
                    ],
                })),
            toggleComplete: (id: string) =>
                set((state) => ({
                    habits: state.habits.map((h) => {
                        if (h.id !== id) return h;
                        const completedToday = !h.completedToday;
                        return {
                            ...h,
                            completedToday,
                            streak: completedToday ? h.streak + 1 : Math.max(0, h.streak - 1),
                        };
                    }),
                })),
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);