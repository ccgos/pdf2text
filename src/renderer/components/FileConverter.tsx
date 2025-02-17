import React, { useState } from 'react';

export function FileConverter() {
  const [progress, setProgress] = useState(0);

  // Add this to verify the component is mounted
  console.log('FileConverter component mounted');

  React.useEffect(() => {
    // @ts-ignore
    window.electronAPI.onProgress((progress: number) => {
      console.log('Progress update:', progress);
      setProgress(progress);
    });
  }, []);

  const handleConvertToMarkdown = async () => {
    try {
      // @ts-ignore
      const filePath = await window.electronAPI.selectFile();
      if (filePath) {
        console.log('Converting to markdown:', filePath);
        // @ts-ignore
        const result = await window.electronAPI.convertFile(filePath);
        console.log('Markdown conversion result:', result);
      }
    } catch (error) {
      console.error('Markdown conversion failed:', error);
    }
  };

  const handleConvertDirectoryToMarkdown = async () => {
    try {
      // @ts-ignore
      const dirPath = await window.electronAPI.selectDirectory();
      if (dirPath) {
        console.log('Converting directory to markdown:', dirPath);
        // @ts-ignore
        const result = await window.electronAPI.convertDirectory(dirPath);
        console.log('Directory conversion result:', result);
      }
    } catch (error) {
      console.error('Directory conversion failed:', error);
    }
  };

  const handleConvertToImages = async () => {
    try {
      // @ts-ignore
      const filePath = await window.electronAPI.selectFile();
      if (filePath) {
        console.log('Converting to images:', filePath);
        // @ts-ignore
        const result = await window.electronAPI.convertToImages(filePath);
        console.log('Image conversion result:', result);
      }
    } catch (error) {
      console.error('Image conversion failed:', error);
    }
  };

  const handleConvertDirectoryToImages = async () => {
    try {
      // @ts-ignore
      const dirPath = await window.electronAPI.selectDirectory();
      if (dirPath) {
        console.log('Converting directory to images:', dirPath);
        // @ts-ignore
        const result = await window.electronAPI.convertDirectoryToImages(dirPath);
        console.log('Directory image conversion result:', result);
      }
    } catch (error) {
      console.error('Directory image conversion failed:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Markdown Conversion Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">PDF to Markdown</h2>
        <div className="flex space-x-4">
          <button 
            onClick={handleConvertToMarkdown}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Convert PDF to Markdown
          </button>
          <button 
            onClick={handleConvertDirectoryToMarkdown}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Convert Folder to Markdown
          </button>
        </div>
      </div>

      {/* Image Conversion Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">PDF to Images</h2>
        <div className="flex space-x-4">
          <button 
            onClick={handleConvertToImages}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Convert PDF to Images
          </button>
          <button 
            onClick={handleConvertDirectoryToImages}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Convert Folder to Images
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {progress > 0 && (
        <div className="w-full bg-gray-200 rounded">
          <div 
            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded" 
            style={{ width: `${progress}%` }}
          >
            {progress}%
          </div>
        </div>
      )}
    </div>
  );
} 