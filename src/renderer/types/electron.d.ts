export {};

declare global {
  interface Window {
    electron: {
      selectFile: () => Promise<string>;
      selectDirectory: () => Promise<string>;
      convertPdf: (filePath: string) => Promise<string>;
    };
    electronAPI: ElectronAPI;
  }
}

interface ElectronAPI {
  selectFile: () => Promise<string | null>;
  selectDirectory: () => Promise<string | null>;
  convertFile: (filePath: string) => Promise<string>;
  convertDirectory: (dirPath: string) => Promise<string[]>;
  onProgress: (callback: (progress: number) => void) => void;
  convertToImages: (filePath: string) => Promise<string[]>;
  convertDirectoryToImages: (dirPath: string) => Promise<string[]>;
} 