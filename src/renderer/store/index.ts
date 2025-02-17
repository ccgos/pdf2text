import { create } from 'zustand';

interface AppState {
  isConverting: boolean;
  progress: number;
  errors: string[];
  convertedFiles: string[];
  setIsConverting: (isConverting: boolean) => void;
  setProgress: (progress: number) => void;
  addError: (error: string) => void;
  addConvertedFile: (filePath: string) => void;
  clearConvertedFiles: () => void;
}

export const useStore = create<AppState>((set: any) => ({
  isConverting: false,
  progress: 0,
  errors: [],
  convertedFiles: [],
  setIsConverting: (isConverting: boolean) => set({ isConverting }),
  setProgress: (progress: number) => set({ progress }),
  addError: (error: string) => set((state: AppState) => ({ errors: [...state.errors, error] })),
  addConvertedFile: (filePath: string) =>
    set((state: AppState) => ({ convertedFiles: [...state.convertedFiles, filePath] })),
  clearConvertedFiles: () => set({ convertedFiles: [] }),
})); 