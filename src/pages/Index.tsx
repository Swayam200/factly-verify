
import React from 'react';
import NavBar from '@/components/NavBar';
import FactCheckInput from '@/components/FactCheckInput';
import ResultCard from '@/components/ResultCard';
import ApiKeyModal from '@/components/ApiKeyModal';
import { useFactCheck } from '@/context/FactCheckContext';
import { Shield, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Index = () => {
  const { hasRequiredKeys, isModalOpen, setIsModalOpen, currentResult } = useFactCheck();
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
        <header className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight">
            Real or Fake?
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Enter any claim or statement to verify its authenticity using 
            AI-powered fact-checking technology.
          </p>
          
          {!hasRequiredKeys && !isModalOpen && (
            <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-xl mx-auto mt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-500 h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="space-y-2">
                  <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                    API key required. Please configure your OpenAI API key to enable fact-checking functionality.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Configure API Key
                  </Button>
                </div>
              </div>
            </div>
          )}
        </header>
        
        <section>
          <FactCheckInput />
        </section>
        
        <section className={cn(
          "transition-all duration-500",
          currentResult ? "opacity-100" : "opacity-0"
        )}>
          <ResultCard />
        </section>
        
        <ApiKeyModal />
      </main>
      
      <footer className="py-6 mt-auto border-t border-border">
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Real or Fake - AI-Powered Fact Checking</p>
          <p className="mt-1">Not for commercial use. Educational purposes only.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
