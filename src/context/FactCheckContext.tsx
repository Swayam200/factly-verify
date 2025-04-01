
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type ResultStatus = 'true' | 'false' | 'neutral' | 'unknown';

export interface Source {
  url: string;
  title: string;
  snippet?: string;
  reliability?: number;
  imageUrl?: string;
}

export interface FactCheckResult {
  id: string;
  query: string;
  status: ResultStatus;
  confidenceScore: number;
  explanation: string;
  sources: Source[];
  timestamp: number;
  feedback?: {
    helpful: number;
    notHelpful: number;
  };
}

export interface OpenRouterApiKey {
  key: string;
  validUntil: number;
}

export interface FactCheckContextType {
  currentQuery: string;
  setCurrentQuery: (query: string) => void;
  currentResult: FactCheckResult | null;
  setCurrentResult: (result: FactCheckResult | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  apiKeys: { openrouter?: string };
  setApiKey: (platform: string, key: string) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  hasRequiredKeys: boolean;
  resultsHistory: FactCheckResult[];
  setResultsHistory: (history: FactCheckResult[]) => void;
  useDefaultApiKey: boolean;
  setUseDefaultApiKey: (useDefault: boolean) => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  hasUsedFreeCheck: boolean;
  setHasUsedFreeCheck: (used: boolean) => void;
  
  // Dark mode toggle
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const FactCheckContext = createContext<FactCheckContextType | undefined>(undefined);

export const FactCheckProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentResult, setCurrentResult] = useState<FactCheckResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeys, setApiKeys] = useState<{ [key: string]: string }>({
    openrouter: localStorage.getItem('openrouterApiKey') || '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resultsHistory, setResultsHistory] = useState<FactCheckResult[]>([]);
  const [useDefaultApiKey, setUseDefaultApiKey] = useState(true);
  const [selectedModel, setSelectedModel] = useState('deepseek-coder');
  const [hasUsedFreeCheck, setHasUsedFreeCheck] = useState(false);
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check local storage or system preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    // Default to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  useEffect(() => {
    const storedHistory = localStorage.getItem('resultsHistory');
    if (storedHistory) {
      setResultsHistory(JSON.parse(storedHistory));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('resultsHistory', JSON.stringify(resultsHistory));
  }, [resultsHistory]);
  
  useEffect(() => {
    localStorage.setItem('openrouterApiKey', apiKeys.openrouter || '');
  }, [apiKeys.openrouter]);
  
  useEffect(() => {
    const hasKeys = !!apiKeys.openrouter || useDefaultApiKey;
    console.log('hasRequiredKeys', hasKeys);
    console.log('apiKeys', apiKeys);
    console.log('useDefaultApiKey', useDefaultApiKey);
    
  }, [apiKeys, useDefaultApiKey]);
  
  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);
  
  const setApiKey = (platform: string, key: string) => {
    setApiKeys(prevKeys => ({ ...prevKeys, [platform]: key }));
  };
  
  // Toggle dark mode function
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  const hasRequiredKeys = !!apiKeys.openrouter || useDefaultApiKey;
  
  const value = {
    currentQuery,
    setCurrentQuery,
    currentResult,
    setCurrentResult,
    isLoading,
    setIsLoading,
    apiKeys,
    setApiKey,
    isModalOpen,
    setIsModalOpen,
    hasRequiredKeys,
    resultsHistory,
    setResultsHistory,
    useDefaultApiKey,
    setUseDefaultApiKey,
    selectedModel,
    setSelectedModel,
    hasUsedFreeCheck,
    setHasUsedFreeCheck,
    isDarkMode,
    toggleDarkMode,
  };
  
  return <FactCheckContext.Provider value={value}>{children}</FactCheckContext.Provider>;
};

// Export the hook to use the context
export const useFactCheck = (): FactCheckContextType => {
  const context = useContext(FactCheckContext);
  if (context === undefined) {
    throw new Error('useFactCheck must be used within a FactCheckProvider');
  }
  return context;
};
