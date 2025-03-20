import React from 'react';
import FactCheckInput from '@/components/FactCheckInput';
import ResultCard from '@/components/ResultCard';
import LoadingScreen from '@/components/LoadingScreen';
import LegalDisclaimer from '@/components/LegalDisclaimer';
import { useFactCheck } from '@/context/FactCheckContext';

const Index = () => {
  const { isLoading, currentQuery } = useFactCheck();

  return (
    <div className="container px-4 py-8 mx-auto relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-gradient">Fact Check</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verify claims and get accurate information using AI.
          </p>
        </div>
        
        <FactCheckInput />
        
        {isLoading && currentQuery && <LoadingScreen query={currentQuery} />}
        
        {!isLoading && <ResultCard />}
        
        <div className="mt-12">
          <LegalDisclaimer className="max-w-4xl mx-auto" />
        </div>
      </div>
    </div>
  );
};

export default Index;
