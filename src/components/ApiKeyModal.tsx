
import React, { useState } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Info, X, CheckCircle, AlertCircle } from 'lucide-react';
import { validateApiKey } from '@/utils/apiManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ApiKeyModal = () => {
  const { apiKeys, setApiKey, isModalOpen, setIsModalOpen, hasRequiredKeys } = useFactCheck();
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || '');
  const [perplexityKey, setPerplexityKey] = useState(apiKeys.perplexity || '');
  const [googleKey, setGoogleKey] = useState(apiKeys.google || '');
  const [newsapiKey, setNewsapiKey] = useState(apiKeys.newsapi || '');
  const [isOpenAIValid, setIsOpenAIValid] = useState(Boolean(apiKeys.openai));
  const [isPerplexityValid, setIsPerplexityValid] = useState(Boolean(apiKeys.perplexity));

  const handleSave = () => {
    if (openaiKey) {
      setApiKey('openai', openaiKey);
    }
    if (perplexityKey) {
      setApiKey('perplexity', perplexityKey);
    }
    if (googleKey) {
      setApiKey('google', googleKey);
    }
    if (newsapiKey) {
      setApiKey('newsapi', newsapiKey);
    }
    setIsModalOpen(false);
  };

  const validateOpenAI = (key: string) => {
    const isValid = validateApiKey(key, 'openai');
    setIsOpenAIValid(isValid);
    return isValid;
  };

  const validatePerplexity = (key: string) => {
    const isValid = validateApiKey(key, 'perplexity');
    setIsPerplexityValid(isValid);
    return isValid;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md glass-panel animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">API Keys Setup</DialogTitle>
          <DialogDescription className="text-center">
            Enter your API keys to enable fact-checking functionality.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="perplexity">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="perplexity">Perplexity API</TabsTrigger>
            <TabsTrigger value="openai">OpenAI API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="perplexity" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="perplexity" className="text-lg font-medium flex items-center gap-1">
                  Perplexity API Key
                  <span className="text-rose-500">*</span>
                </Label>
                {isPerplexityValid ? (
                  <span className="text-green-500 flex items-center gap-1 text-sm">
                    <CheckCircle size={14} />
                    Valid
                  </span>
                ) : (
                  perplexityKey && <span className="text-red-500 flex items-center gap-1 text-sm">
                    <X size={14} />
                    Invalid format
                  </span>
                )}
              </div>
              <Input
                id="perplexity"
                type="password"
                placeholder="pplx-..."
                className="glass-input"
                value={perplexityKey}
                onChange={(e) => {
                  setPerplexityKey(e.target.value);
                  validatePerplexity(e.target.value);
                }}
              />
              <p className="text-sm text-muted-foreground">
                Get your API key from the <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Perplexity dashboard</a>.
              </p>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md flex items-start gap-2">
              <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-800 dark:text-blue-200">
                Perplexity AI offers a free tier with limited usage. Sign up to get your API key.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="openai" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openai" className="text-lg font-medium flex items-center gap-1">
                  OpenAI API Key
                  <span className="text-rose-500">*</span>
                </Label>
                {isOpenAIValid ? (
                  <span className="text-green-500 flex items-center gap-1 text-sm">
                    <CheckCircle size={14} />
                    Valid
                  </span>
                ) : (
                  openaiKey && <span className="text-red-500 flex items-center gap-1 text-sm">
                    <X size={14} />
                    Invalid format
                  </span>
                )}
              </div>
              <Input
                id="openai"
                type="password"
                placeholder="sk-..."
                className="glass-input"
                value={openaiKey}
                onChange={(e) => {
                  setOpenaiKey(e.target.value);
                  validateOpenAI(e.target.value);
                }}
              />
              <p className="text-sm text-muted-foreground">
                Get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI dashboard</a>.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="google" className="text-lg font-medium">Google API Key (Optional)</Label>
              <Input
                id="google"
                type="password"
                placeholder="Optional for enhanced search"
                className="glass-input"
                value={googleKey}
                onChange={(e) => setGoogleKey(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Optional. Enhances source verification with Google Search.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newsapi" className="text-lg font-medium">News API Key (Optional)</Label>
              <Input
                id="newsapi"
                type="password"
                placeholder="Optional for news verification"
                className="glass-input"
                value={newsapiKey}
                onChange={(e) => setNewsapiKey(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Optional. Adds news source verification capability.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md flex items-start gap-2">
          <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            Your API keys are stored locally in your browser and never transmitted to our servers. They're used only to make direct API calls from your browser.
          </div>
        </div>
        
        <DialogFooter className="flex sm:justify-between gap-4">
          {hasRequiredKeys && (
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="sm:w-auto w-full"
            >
              Cancel
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            disabled={!isOpenAIValid && !isPerplexityValid}
            className={`sm:w-auto w-full ${(!isOpenAIValid && !isPerplexityValid) ? 'opacity-50 cursor-not-allowed' : 'button-glow'}`}
          >
            Save Keys
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
