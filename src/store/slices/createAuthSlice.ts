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
        user: null,
        userCompletedReg: false
    }),

    setIsInitialLoading: (value) => set({ isLoading: value }),
    setUserCompletedRed: (value) => set({ userCompletedReg: value })
})