import { contextBridge, ipcRenderer } from 'electron';

// Add this for debugging
const api = {
  selectFile: async () => {
    console.log('preload: selectFile called');
    return ipcRenderer.invoke('select-file');
  },
  selectDirectory: async () => {
    return ipcRenderer.invoke('select-directory');
  },
  convertFile: async (filePath: string) => {
    return ipcRenderer.invoke('convert-file', filePath);
  },
  convertDirectory: async (dirPath: string) => {
    return ipcRenderer.invoke('convert-directory', dirPath);
  },
  onProgress: (callback: (progress: number) => void) => {
    ipcRenderer.on('conversion-progress', (_, progress) => callback(progress));
  },
  convertToImages: async (filePath: string) => {
    console.log('preload: convertToImages called with:', filePath);
    try {
      const result = await ipcRenderer.invoke('convert-to-images', filePath);
      console.log('preload: convertToImages result:', result);
      return result;
    } catch (error) {
      console.error('preload: convertToImages error:', error);
      throw error;
    }
  },
  convertDirectoryToImages: async (dirPath: string) => {
    return ipcRenderer.invoke('convert-directory-to-images', dirPath);
  }
};

// Log that we're exposing the API
console.log('Exposing electron API...');
contextBridge.exposeInMainWorld('electronAPI', api);
console.log('API exposed successfully'); 