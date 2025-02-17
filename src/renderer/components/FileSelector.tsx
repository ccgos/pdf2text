import React from 'react';
import { Button } from './ui/button';
import { useStore } from '../store';

declare global {
  interface Window {
    electronAPI: {
      selectFile: () => Promise<string | null>;
      selectDirectory: () => Promise<string | null>;
      convertFile: (path: string) => Promise<string>;
      convertDirectory: (path: string) => Promise<string[]>;
      onProgress: (callback: (progress: number) => void) => void;
      convertToImages: (path: string) => Promise<string[]>;
      convertDirectoryToImages: (path: string) => Promise<string[]>;
    }
  }
}

export const FileSelector: React.FC = () => {
  const { setIsConverting, setProgress, addError, addConvertedFile } = useStore();

  React.useEffect(() => {
    // Set up progress listener
    window.electronAPI.onProgress((progress) => {
      setProgress(progress);
    });
  }, []);

  const handleSelectFile = async () => {
    try {
      const filePath = await window.electronAPI.selectFile();
      if (filePath) {
        setIsConverting(true);
        setProgress(0);
        const markdownPath = await window.electronAPI.convertFile(filePath);
        addConvertedFile(markdownPath);
        setProgress(100);
      }
    } catch (error) {
      addError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsConverting(false);
    }
  };

  const handleSelectFolder = async () => {
    try {
      const dirPath = await window.electronAPI.selectDirectory();
      if (dirPath) {
        setIsConverting(true);
        setProgress(0);
        try {
          const markdownPaths = await window.electronAPI.convertDirectory(dirPath);
          markdownPaths.forEach(addConvertedFile);
        } catch (error) {
          addError(error instanceof Error ? error.message : 'Unknown error occurred');
        }
      }
    } catch (error) {
      addError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsConverting(false);
    }
  };

  const handleSelectFileForImages = async () => {
    try {
      const filePath = await window.electronAPI.selectFile();
      if (filePath) {
        setIsConverting(true);
        setProgress(0);
        const imagePaths = await window.electronAPI.convertToImages(filePath);
        imagePaths.forEach(addConvertedFile);
      }
    } catch (error) {
      addError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsConverting(false);
    }
  };

  const handleSelectFolderForImages = async () => {
    try {
      const dirPath = await window.electronAPI.selectDirectory();
      if (dirPath) {
        setIsConverting(true);
        setProgress(0);
        try {
          const imagePaths = await window.electronAPI.convertDirectoryToImages(dirPath);
          imagePaths.forEach(addConvertedFile);
        } catch (error) {
          addError(error instanceof Error ? error.message : 'Unknown error occurred');
        }
      }
    } catch (error) {
      addError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Button onClick={handleSelectFolder}>Convert Folder to Markdown</Button>
        <Button onClick={handleSelectFile}>Convert PDF to Markdown</Button>
      </div>
      <div className="flex gap-4">
        <Button onClick={handleSelectFolderForImages}>Convert Folder to Images</Button>
        <Button onClick={handleSelectFileForImages}>Convert PDF to Images</Button>
      </div>
    </div>
  );
}; 