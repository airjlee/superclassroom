import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Generating Notes...</h2>
        <p className="text-gray-500 mt-2">Please wait while we process your request</p>
      </div>
    </div>
  );
};

export default LoadingScreen; 