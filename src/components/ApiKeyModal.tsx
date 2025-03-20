
import React, { useState } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Info, X, CheckCircle, AlertCircle, ExternalLink, Check, Key } from 'lucide-react';
import { validateApiKey, DEFAULT_OPENROUTER_API_KEY } from '@/utils/apiManager';
import { Switch } from '@/components/ui/switch';

const ApiKeyModal = () => {
  const { 
    apiKeys, 
    setApiKey, 
    isModalOpen, 
    setIsModalOpen, 
    hasRequiredKeys,
    useDefaultApiKey,
    setUseDefaultApiKey
  } = useFactCheck();
  
  const [openrouterKey, setOpenrouterKey] = useState(apiKeys.openrouter || '');
  const [isOpenRouterValid, setIsOpenRouterValid] = useState(Boolean(apiKeys.openrouter));

  const handleSave = () => {
    if (useDefaultApiKey) {
      setIsModalOpen(false);
      return;
    }
    
    if (openrouterKey) {
      setApiKey('openrouter', openrouterKey);
    }
    setIsModalOpen(false);
  };

  const validateOpenRouter = (key: string) => {
    const isValid = validateApiKey(key, 'openrouter');
    setIsOpenRouterValid(isValid);
    return isValid;
  };

  const toggleUseDefaultKey = () => {
    setUseDefaultApiKey(!useDefaultApiKey);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md glass-panel animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">API Key Setup</DialogTitle>
          <DialogDescription className="text-center">
            Configure the API key for fact-checking functionality
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4 p-4 rounded-lg bg-primary/10">
            <Switch 
              id="use-default-key" 
              checked={useDefaultApiKey} 
              onCheckedChange={toggleUseDefaultKey} 
            />
            <div className="space-y-1">
              <Label 
                htmlFor="use-default-key" 
                className="text-base cursor-pointer"
              >
                Use the built-in API key (Recommended)
              </Label>
              <p className="text-sm text-muted-foreground">
                Use our provided OpenRouter API key for a seamless experience
              </p>
            </div>
          </div>
          
          {!useDefaultApiKey && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="openrouter" className="text-lg font-medium flex items-center gap-1">
                  Your OpenRouter API Key
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
          )}
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md flex items-start gap-2">
            <Info size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              Your API keys are stored locally in your browser and never transmitted to our servers. They're used only to make direct API calls from your browser.
            </div>
          </div>
          
          <div className="bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md flex items-start gap-2">
            <AlertCircle size={20} className="text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Legal Disclaimer for India</p>
              <p>This tool is provided for informational purposes only and does not constitute legal, financial, or professional advice. The accuracy of fact-checking results may vary. Users in India should verify information through official government sources where applicable.</p>
              <p className="mt-1">Usage complies with the Information Technology Act, 2000 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.</p>
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
            disabled={!useDefaultApiKey && !isOpenRouterValid}
            className={`sm:w-auto w-full button-glow`}
          >
            {useDefaultApiKey ? 'Continue with Built-in Key' : 'Save API Key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
