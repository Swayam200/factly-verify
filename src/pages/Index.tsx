
import React from 'react';
import FactCheckInput from '@/components/FactCheckInput';
import ResultCard from '@/components/ResultCard';
import LoadingScreen from '@/components/LoadingScreen';
import { useFactCheck } from '@/context/FactCheckContext';
import MovingBackground from '@/components/MovingBackground';
import { useAuth } from '@/context/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { isLoading, currentQuery, hasUsedFreeCheck } = useFactCheck();
  const { user } = useAuth();

  // Show banner when user has used their free check and is not logged in
  const shouldShowLoginBanner = hasUsedFreeCheck && !user;

  return (
    <div className="container px-4 py-8 mx-auto relative z-10">
      <MovingBackground />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-gradient">Fact Check</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Verify claims and get accurate information using AI.
          </p>
        </div>
        
        {shouldShowLoginBanner && (
          <Alert className="mb-6 border-primary/50 bg-primary/5">
            <AlertDescription className="flex items-center justify-between">
              <span>You've used your free fact check. Sign in to continue using the service.</span>
              <Link to="/auth" className="flex items-center text-primary hover:text-primary/80 font-medium">
                <LogIn size={16} className="mr-1" /> Sign In
              </Link>
            </AlertDescription>
          </Alert>
        )}
        
        {(!hasUsedFreeCheck || user) && <FactCheckInput />}
        
        {isLoading && currentQuery && <LoadingScreen query={currentQuery} />}
        
        {!isLoading && <ResultCard />}
      </div>
    </div>
  );
};

export default Index;
