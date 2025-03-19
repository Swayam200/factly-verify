
import React, { useState } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { verifyFact } from '@/utils/factCheckService';
import { toast } from 'sonner';
import { openRouterModels } from '@/utils/apiManager';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

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
    setSelectedModel,
  } = useFactCheck();
  
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      toast.error('Please enter a claim to verify');
      return;
    }
    
    if (!hasRequiredKeys) {
      setIsModalOpen(true);
      toast.error('API key required', {
        description: 'Please set up your OpenRouter API key first'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setCurrentQuery(query);
      
      // Clear previous result while loading
      setCurrentResult(null);
      
      const result = await verifyFact(query, apiKeys, selectedModel);
      setCurrentResult(result);
      
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
  
  const handleModelChange = (value: string) => {
    setSelectedModel(value);
    toast.info(`Model changed to ${value === openRouterModels.deepseek.id ? 'DeepSeek R1' : 'Google Gemini Pro 2.0'}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <div className="absolute left-3 top-3 text-muted-foreground">
            <Search size={20} />
          </div>
          
          <Input
            type="text"
            placeholder="Enter a claim or statement to verify..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 py-6 glass-input text-lg transition-all duration-300 focus:ring-4"
            disabled={isLoading || contextLoading}
          />
          
          <Button
            type="submit"
            className="absolute right-2 top-2 transition-all button-glow"
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
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <Select value={selectedModel} onValueChange={handleModelChange}>
              <SelectTrigger className="w-full sm:w-[240px] glass-input">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={openRouterModels.deepseek.id}>
                  <div className="flex flex-col">
                    <span>{openRouterModels.deepseek.name}</span>
                    <span className="text-xs text-muted-foreground">{openRouterModels.deepseek.description}</span>
                  </div>
                </SelectItem>
                <SelectItem value={openRouterModels.gemini.id}>
                  <div className="flex flex-col">
                    <span>{openRouterModels.gemini.name}</span>
                    <span className="text-xs text-muted-foreground">{openRouterModels.gemini.description}</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {!currentQuery && !isLoading && (
            <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
              {suggestedClaims.map((claim, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestedClaim(claim)}
                  className="text-sm px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors text-primary"
                >
                  {claim}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default FactCheckInput;
