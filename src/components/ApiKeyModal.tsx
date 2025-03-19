
import React, { useState } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Info, X, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { validateApiKey } from '@/utils/apiManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ApiKeyModal = () => {
  const { apiKeys, setApiKey, isModalOpen, setIsModalOpen, hasRequiredKeys } = useFactCheck();
  const [openrouterKey, setOpenrouterKey] = useState(apiKeys.openrouter || '');
  const [perplexityKey, setPerplexityKey] = useState(apiKeys.perplexity || '');
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || '');
  const [isOpenRouterValid, setIsOpenRouterValid] = useState(Boolean(apiKeys.openrouter));
  const [isPerplexityValid, setIsPerplexityValid] = useState(Boolean(apiKeys.perplexity));
  const [isOpenAIValid, setIsOpenAIValid] = useState(Boolean(apiKeys.openai));

  const handleSave = () => {
    if (openrouterKey) {
      setApiKey('openrouter', openrouterKey);
    }
    if (perplexityKey) {
      setApiKey('perplexity', perplexityKey);
    }
    if (openaiKey) {
      setApiKey('openai', openaiKey);
    }
    setIsModalOpen(false);
  };

  const validateOpenRouter = (key: string) => {
    const isValid = validateApiKey(key, 'openrouter');
    setIsOpenRouterValid(isValid);
    return isValid;
  };

  const validatePerplexity = (key: string) => {
    const isValid = validateApiKey(key, 'perplexity');
    setIsPerplexityValid(isValid);
    return isValid;
  };

  const validateOpenAI = (key: string) => {
    const isValid = validateApiKey(key, 'openai');
    setIsOpenAIValid(isValid);
    return isValid;
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md glass-panel animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">API Keys Setup</DialogTitle>
          <DialogDescription className="text-center">
            Enter your API key to enable fact-checking functionality.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="openrouter">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="openrouter" className="text-sm">OpenRouter (Free)</TabsTrigger>
            <TabsTrigger value="perplexity" className="text-sm">Perplexity API</TabsTrigger>
            <TabsTrigger value="openai" className="text-sm">OpenAI API</TabsTrigger>
          </TabsList>
          
          <TabsContent value="openrouter" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openrouter" className="text-lg font-medium flex items-center gap-1">
                  OpenRouter API Key
                  <span className="text-rose-500">*</span>
                </Label>
                {isOpenRouterValid ? (
                  <span className="text-green-500 flex items-center gap-1 text-sm">
                    <CheckCircle size={14} />
                    Valid
                  </span>
                ) : (
                  openrouterKey && <span className="text-red-500 flex items-center gap-1 text-sm">
                    <X size={14} />
                    Invalid format
                  </span>
                )}
              </div>
              <Input
                id="openrouter"
                type="password"
                placeholder="Your OpenRouter API Key"
                className="glass-input"
                value={openrouterKey}
                onChange={(e) => {
                  setOpenrouterKey(e.target.value);
                  validateOpenRouter(e.target.value);
                }}
              />
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Get your free API key from</span>
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  OpenRouter
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-md flex items-start gap-2">
              <Info size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-800 dark:text-green-200">
                OpenRouter provides <strong>free access</strong> to DeepSeek R1 and Google Gemini Pro models which offer excellent fact-checking capabilities.
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="perplexity" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="perplexity" className="text-lg font-medium flex items-center gap-1">
                  Perplexity API Key
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
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Get your API key from</span>
                <a 
                  href="https://www.perplexity.ai/settings/api" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  Perplexity
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="openai" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openai" className="text-lg font-medium flex items-center gap-1">
                  OpenAI API Key
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
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Get your API key from</span>
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:underline inline-flex items-center gap-0.5"
                >
                  OpenAI
                  <ExternalLink size={12} />
                </a>
              </div>
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
            disabled={!isOpenAIValid && !isPerplexityValid && !isOpenRouterValid}
            className={`sm:w-auto w-full ${(!isOpenAIValid && !isPerplexityValid && !isOpenRouterValid) ? 'opacity-50 cursor-not-allowed' : 'button-glow'}`}
          >
            Save Keys
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
