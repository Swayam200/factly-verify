
import React, { useState } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { verifyFact } from '@/utils/factCheckService';
import { toast } from 'sonner';
import { DEFAULT_OPENROUTER_API_KEY } from '@/utils/apiManager';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const FactCheckInput: React.FC = () => {
  const { 
    currentQuery, 
    setCurrentQuery, 
    setCurrentResult, 
    apiKeys, 
    hasRequiredKeys,
    setIsModalOpen,
    isLoading: contextLoading,
    selectedModel,
    useDefaultApiKey,
    hasUsedFreeCheck,
    setHasUsedFreeCheck
  } = useFactCheck();
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a claim to verify');
      return;
    }
    
    // Check if user has already used their free check and is not logged in
    if (hasUsedFreeCheck && !user) {
      toast.error('Sign in required', {
        description: 'Please sign in to continue using Fact Check'
      });
      navigate('/auth');
      return;
    }
    
    if (!hasRequiredKeys) {
      setIsModalOpen(true);
      toast.error('API key required', {
        description: 'Please set up your API key first'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setCurrentQuery(query);
      
      // Clear previous result while loading
      setCurrentResult(null);
      
      const apiKey = useDefaultApiKey ? DEFAULT_OPENROUTER_API_KEY : apiKeys.openrouter;
      
      const result = await verifyFact(query, { openrouter: apiKey }, selectedModel);
      setCurrentResult(result);
      
      // If this was their first check and they're not logged in, mark the free check as used
      if (!user && !hasUsedFreeCheck) {
        setHasUsedFreeCheck(true);
      }
      
      // Clear input after successful search
      setQuery('');
    } catch (error) {
      toast.error('Verification failed', { 
        description: error instanceof Error ? error.message : 'An unknown error occurred'
      });
      console.error('Error during fact check:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedClaims = [
    "Earth is flat",
    "Vaccines cause autism",
    "Drinking water helps hydration",
    "New Delhi is the capital of India",
    "Exercise improves health"
  ];
  
  const handleSuggestedClaim = (claim: string) => {
    setQuery(claim);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-slide-up">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <div className="absolute left-3 top-3 text-muted-foreground">
            <Search size={20} />
          </div>
          
          <Input
            type="text"
            placeholder="Enter a claim or statement to verify..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 pr-12 py-6 glass-input text-lg transition-all duration-300 focus:ring-4"
            disabled={isLoading || contextLoading}
          />
          
          <div className="absolute right-2 top-2">
            <Button
              type="submit"
              className="transition-all button-glow"
              size="sm"
              disabled={isLoading || contextLoading || !query.trim()}
            >
              {isLoading || contextLoading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <Sparkles size={18} className="mr-1" />
                  Verify
                </>
              )}
            </Button>
          </div>
        </div>
        
        {!currentQuery && !isLoading && (
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedClaims.map((claim, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestedClaim(claim)}
                className="text-sm px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-primary hover-lift"
              >
                {claim}
              </button>
            ))}
          </div>
        )}
      </form>
    </div>
  );
};

export default FactCheckInput;
