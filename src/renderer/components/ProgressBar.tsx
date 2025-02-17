import React from 'react';
import { useStore } from '../store';

export const ProgressBar: React.FC = () => {
  const { progress, isConverting } = useStore();

  if (!isConverting) return null;

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-emerald-600 h-2.5 rounded-full"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
}; 