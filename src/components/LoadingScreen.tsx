
import React, { useState, useEffect } from 'react';
import { Loader2, Search, SparkleIcon } from 'lucide-react';

interface LoadingScreenProps {
  query?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ query }) => {
  const [dots, setDots] = useState('');
  const [randomFacts, setRandomFacts] = useState<string[]>([
    "Fact checking uses multiple reliable sources",
    "The Earth is approximately 4.54 billion years old",
    "Chess was invented in India around the 6th century",
    "Humans share 50% of their DNA with bananas",
    "There are more possible iterations of a game of chess than atoms in the universe",
    "The shortest war in history lasted 38 minutes",
    "A day on Venus is longer than a year on Venus",
    "The Great Wall of China is not visible from space with the naked eye",
    "Honey never spoils - archaeologists have found edible honey in ancient tombs"
  ]);
  const [currentFact, setCurrentFact] = useState('');

  // Loading animation for dots
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Random fact rotation
  useEffect(() => {
    setCurrentFact(randomFacts[Math.floor(Math.random() * randomFacts.length)]);
    
    const interval = setInterval(() => {
      setCurrentFact(prev => {
        const filteredFacts = randomFacts.filter(fact => fact !== prev);
        return filteredFacts[Math.floor(Math.random() * filteredFacts.length)];
      });
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen animate-fade-in">
      <div className="flex flex-col items-center justify-center p-8 rounded-xl glass-panel">
        <div className="loading-spinner">
          <div className="loading-spinner-ring"></div>
          <div className="loading-spinner-ring"></div>
          <div className="loading-spinner-core">
            <SparkleIcon className="h-6 w-6 text-primary animate-pulse" />
          </div>
        </div>
        
        <p className="loading-screen-text mt-4 text-lg font-medium">
          Verifying claim{dots}
        </p>
        
        {query && (
          <div className="mt-4 max-w-md text-center">
            <div className="flex items-center gap-2 mb-2 justify-center text-sm text-muted-foreground">
              <Search size={14} />
              <span>Analyzing:</span>
            </div>
            <p className="text-foreground font-medium px-4 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm">"{query}"</p>
          </div>
        )}
        
        <div className="mt-6 text-sm text-muted-foreground max-w-xs text-center animate-fade-in">
          <p className="italic">{currentFact}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
