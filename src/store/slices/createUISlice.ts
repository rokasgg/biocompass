import { StateCreator } from 'zustand';
import { AppState } from '../useStore';

export interface UISlice {
    errorMessage: string | null;
    setErrorMessage: (message: string | null) => void;
    clearError: () => void;
}

export const createUISlice: StateCreator<AppState, [], [], UISlice> = (set) => ({
    errorMessage: null,
    setErrorMessage: (message) => set({ errorMessage: message }),
    clearError: () => set({ errorMessage: null }),
});