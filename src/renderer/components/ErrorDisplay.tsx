import React from 'react';
import { useStore } from '../store';

export const ErrorDisplay: React.FC = () => {
  const { errors } = useStore();

  if (errors.length === 0) return null;

  return (
    <div className="mt-4">
      <h2 className="text-red-600 font-bold mb-2">Errors:</h2>
      <ul className="list-disc list-inside">
        {errors.map((error: string, index: number) => (
          <li key={index} className="text-red-600">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}; 