
import React, { useEffect, useState } from 'react';
import { Loader2, Search, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface LoadingScreenProps {
  query: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ query }) => {
  const [step, setStep] = useState(0);
  const [dots, setDots] = useState('');
  
  // Create loading animation for dots
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length < 3 ? prev + '.' : '');
    }, 500);
    
    return () => clearInterval(dotInterval);
  }, []);
  
  // Simulate the steps of fact checking
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep(prev => (prev < 3 ? prev + 1 : prev));
    }, 2000);
    
    return () => clearInterval(stepInterval);
  }, []);
  
  const steps = [
    {
      icon: <Search className="h-6 w-6 text-blue-500 animate-pulse" />,
      text: 'Searching for relevant information',
      subtext: 'Finding sources and references',
    },
    {
      icon: <BookOpen className="h-6 w-6 text-amber-500 animate-pulse" />,
      text: 'Analyzing sources and context',
      subtext: 'Evaluating reliability and credibility',
    },
    {
      icon: <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />,
      text: 'Processing claim verification',
      subtext: 'Cross-referencing with verified facts',
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-green-500 animate-pulse" />,
      text: 'Finalizing results',
      subtext: 'Preparing the verification report',
    },
  ];
  
  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 overflow-hidden glass-panel">
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-8">
          <div className="loading-icon">
            <div className="relative h-20 w-20 flex items-center justify-center">
              {/* Outer spinning ring */}
              <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
              
              {/* Middle pulsing ring */}
              <div className="absolute inset-2 border-4 border-r-primary/70 border-t-transparent border-b-transparent border-l-transparent rounded-full animate-ping"></div>
              
              {/* Inner icon */}
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">Fact Checking</h2>
            <p className="text-muted-foreground max-w-md">
              "{query}"
            </p>
          </div>
          
          <div className="w-full space-y-4">
            {steps.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                  step >= index ? 'bg-secondary/30' : 'opacity-50'
                }`}
              >
                <div className="flex-shrink-0">
                  {index === step ? item.icon : (
                    step > index ? 
                    <CheckCircle2 className="h-6 w-6 text-green-500" /> : 
                    <div className="h-6 w-6 rounded-full border-2 border-muted-foreground/30" />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    {item.text}{index === step && dots}
                  </p>
                  {index === step && (
                    <p className="text-xs text-muted-foreground">{item.subtext}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingScreen;
