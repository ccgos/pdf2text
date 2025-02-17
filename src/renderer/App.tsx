import React from 'react';
import { FileSelector } from './components/FileSelector';
import { ProgressBar } from './components/ProgressBar';
import { ErrorDisplay } from './components/ErrorDisplay';

declare global {
  interface Window {
    electron: {
      selectFile: () => Promise<string>;
      selectDirectory: () => Promise<string>;
      convertPdf: (filePath: string) => Promise<string>;
    };
  }
}

export const App: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF to Markdown Converter</h1>
      <FileSelector />
      <ProgressBar />
      <ErrorDisplay />
    </div>
  );
}; 