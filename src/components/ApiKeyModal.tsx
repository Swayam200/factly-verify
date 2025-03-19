
import React, { useState } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Info, X, CheckCircle, AlertCircle } from 'lucide-react';
import { validateApiKey } from '@/utils/apiManager';

const ApiKeyModal = () => {
  const { apiKeys, setApiKey, isModalOpen, setIsModalOpen, hasRequiredKeys } = useFactCheck();
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || '');
  const [googleKey, setGoogleKey] = useState(apiKeys.google || '');
  const [newsapiKey, setNewsapiKey] = useState(apiKeys.newsapi || '');
  const [isOpenAIValid, setIsOpenAIValid] = useState(Boolean(apiKeys.openai));

  const handleSave = () => {
    if (openaiKey) {
      setApiKey('openai', openaiKey);
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

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md glass-panel animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">API Keys Setup</DialogTitle>
          <DialogDescription className="text-center">
            Enter your API keys to enable fact-checking functionality.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
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
              Required. Get your API key from the <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">OpenAI dashboard</a>.
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
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md flex items-start gap-2">
            <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              Your API keys are stored locally in your browser and never transmitted to our servers. They're used only to make direct API calls from your browser.
            </div>
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
            disabled={!isOpenAIValid}
            className={`sm:w-auto w-full ${!isOpenAIValid ? 'opacity-50 cursor-not-allowed' : 'button-glow'}`}
          >
            Save Keys
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
