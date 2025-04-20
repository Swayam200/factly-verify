import React, { useState } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Info, X, CheckCircle, AlertCircle, ExternalLink, Check, Key } from 'lucide-react';
import { validateApiKey, DEFAULT_OPENROUTER_API_KEY, openRouterModels } from '@/utils/apiManager';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

const ApiKeyModal = () => {
  const { 
    apiKeys, 
    setApiKey, 
    isModalOpen, 
    setIsModalOpen, 
    hasRequiredKeys,
    useDefaultApiKey,
    setUseDefaultApiKey,
    selectedModel,
    setSelectedModel
  } = useFactCheck();
  
  const [openrouterKey, setOpenrouterKey] = useState(apiKeys.openrouter || '');
  const [isOpenRouterValid, setIsOpenRouterValid] = useState(Boolean(apiKeys.openrouter));
  const [openAdvanced, setOpenAdvanced] = useState(false);

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

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-md glass-panel animate-fade-in">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-center">Settings</DialogTitle>
          <DialogDescription className="text-center">
            Configure API keys and preferences
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">API Configuration</h3>
            
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
              <div className="space-y-2 mt-4">
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
          </div>
          
          <Separator />
          
          <Collapsible open={openAdvanced} onOpenChange={setOpenAdvanced} className="w-full">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Advanced Settings</h3>
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                >
                  {openAdvanced ? "Hide Advanced" : "Show Advanced"}
                </Button>
              </CollapsibleTrigger>
            </div>
            
            <CollapsibleContent className="mt-4 space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">AI Model Selection</h4>
                <p className="text-sm text-muted-foreground">
                  Select which AI model to use for fact checking or enter your own OpenRouter model ID
                </p>
                
                <RadioGroup value={selectedModel} onValueChange={handleModelChange} className="space-y-3 mt-2">
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value={openRouterModels.deepseek.id} id="deepseek" />
                    <div className="flex items-start gap-2">
                      <div className="text-2xl">{openRouterModels.deepseek.icon}</div>
                      <div className="flex flex-col">
                        <Label htmlFor="deepseek" className="font-medium cursor-pointer">{openRouterModels.deepseek.name}</Label>
                        <span className="text-xs text-muted-foreground">{openRouterModels.deepseek.description}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="custom" id="custom" />
                    <div className="flex flex-col w-full">
                      <Label htmlFor="custom" className="font-medium cursor-pointer">Custom OpenRouter Model</Label>
                      <div className="flex items-center gap-2 mt-1 w-full">
                        <Input
                          placeholder="provider/model-name (e.g., anthropic/claude-3-opus)"
                          className="text-xs"
                          disabled={selectedModel !== "custom"}
                          onChange={(e) => setSelectedModel(e.target.value)}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">Enter any OpenRouter model ID</span>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <AlertTitle className="font-medium text-blue-800 dark:text-blue-300">How to use your own OpenRouter model</AlertTitle>
                <AlertDescription className="text-sm text-blue-700 dark:text-blue-200">
                  <ol className="list-decimal pl-4 space-y-1 mt-1">
                    <li>Get your API key from <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="underline">openrouter.ai</a></li>
                    <li>Toggle off "Use built-in API key" above</li>
                    <li>Enter your API key</li>
                    <li>Select "Custom OpenRouter Model" and enter the model ID</li>
                    <li>Use provider/model format (e.g., "anthropic/claude-3-opus" or "meta-llama/llama-2")</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </CollapsibleContent>
          </Collapsible>
          
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
            disabled={!useDefaultApiKey && !isOpenRouterValid}
            className={`sm:w-auto w-full button-glow`}
          >
            {useDefaultApiKey ? 'Save Settings' : 'Save API Key'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyModal;
