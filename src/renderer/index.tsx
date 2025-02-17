import React from 'react';
import ReactDOM from 'react-dom/client';
import { FileConverter } from './components/FileConverter';

// Add some debug logging
console.log('Renderer process starting...');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">PDF Converter</h1>
      <FileConverter />
    </div>
  </React.StrictMode>
);

console.log('Renderer process mounted'); 