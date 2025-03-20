
import React from 'react';
import { Loader2, Search } from 'lucide-react';

interface LoadingScreenProps {
  query?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ query }) => {
  return (
    <div className="loading-screen animate-fade-in">
      <div className="flex flex-col items-center justify-center p-8 rounded-xl glass-panel">
        <div className="loading-spinner">
          <div className="loading-spinner-ring"></div>
          <div className="loading-spinner-ring"></div>
        </div>
        
        <p className="loading-screen-text">Verifying claim...</p>
        
        {query && (
          <div className="mt-4 max-w-md text-center">
            <div className="flex items-center gap-2 mb-2 justify-center text-sm text-muted-foreground">
              <Search size={14} />
              <span>Analyzing:</span>
            </div>
            <p className="text-foreground font-medium">"{query}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
