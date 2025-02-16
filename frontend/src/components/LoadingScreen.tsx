import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const messages = [
    {
      title: "Generating SuperNotes",
      description: "Creating comprehensive notes from your course materials..."
    },
    {
      title: "Building Summaries",
      description: "Condensing key concepts into clear summaries..."
    },
    {
      title: "Creating Flashcards",
      description: "Converting important points into study cards..."
    },
    {
      title: "Designing Practice Exams",
      description: "Formulating questions to test your knowledge..."
    }
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1375); // Show each message for 1.375 seconds (5.5s total / 4 messages)
    
    // Set timeout to finish loading after 5.5 seconds
    const loadingTimeout = setTimeout(() => {
      onFinish();
    }, 5500);
    
    return () => {
      clearInterval(messageInterval);
      clearTimeout(loadingTimeout);
    };
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">
          {messages[currentMessageIndex].title}
        </h2>
        <p className="text-gray-500 mt-2">
          {messages[currentMessageIndex].description}
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen; 