
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { openRouterModels } from '@/utils/apiManager';

export type ResultStatus = 'true' | 'false' | 'neutral' | 'unknown';

export interface Source {
  url: string;
  title: string;
  snippet?: string;
  reliability?: number;
}

export interface FactCheckResult {
  id: string;
  query: string;
  status: ResultStatus;
  confidenceScore: number;
  explanation: string;
  sources: Source[];
  timestamp: string;
}

interface ApiKeys {
  openai?: string;
  google?: string;
  newsapi?: string;
  perplexity?: string;
  openrouter?: string;
}

interface FactCheckContextType {
  isLoading: boolean;
  currentQuery: string;
  setCurrentQuery: (query: string) => void;
  currentResult: FactCheckResult | null;
  setCurrentResult: (result: FactCheckResult | null) => void;
  resultsHistory: FactCheckResult[];
  addToHistory: (result: FactCheckResult) => void;
  clearHistory: () => void;
  apiKeys: ApiKeys;
  setApiKey: (key: keyof ApiKeys, value: string) => void;
  hasRequiredKeys: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  selectedModel: string;
  setSelectedModel: (modelId: string) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const defaultContextValue: FactCheckContextType = {
  isLoading: false,
  currentQuery: '',
  setCurrentQuery: () => {},
  currentResult: null,
  setCurrentResult: () => {},
  resultsHistory: [],
  addToHistory: () => {},
  clearHistory: () => {},
  apiKeys: {},
  setApiKey: () => {},
  hasRequiredKeys: false,
  isModalOpen: false,
  setIsModalOpen: () => {},
  selectedModel: openRouterModels.deepseek.id,
  setSelectedModel: () => {},
  isDarkMode: false,
  toggleDarkMode: () => {},
};

const FactCheckContext = createContext<FactCheckContextType>(defaultContextValue);

export const useFactCheck = () => useContext(FactCheckContext);

interface FactCheckProviderProps {
  children: ReactNode;
}

export const FactCheckProvider: React.FC<FactCheckProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [currentResult, setCurrentResult] = useState<FactCheckResult | null>(null);
  const [resultsHistory, setResultsHistory] = useState<FactCheckResult[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeys>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState(openRouterModels.deepseek.id);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('factcheck_theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(systemPrefersDark);
      if (systemPrefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      localStorage.setItem('factcheck_theme', newMode ? 'dark' : 'light');
      
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      return newMode;
    });
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem('factcheckHistory');
    const savedApiKeys = localStorage.getItem('factcheckApiKeys');
    const savedModel = localStorage.getItem('factcheck_selected_model');
    
    if (savedHistory) {
      try {
        setResultsHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing saved history:', error);
      }
    }
    
    if (savedApiKeys) {
      try {
        setApiKeys(JSON.parse(savedApiKeys));
      } catch (error) {
        console.error('Error parsing saved API keys:', error);
      }
    } else {
      setIsModalOpen(true);
    }
    
    if (savedModel) {
      setSelectedModel(savedModel);
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('factcheckHistory', JSON.stringify(resultsHistory));
  }, [resultsHistory]);
  
  useEffect(() => {
    localStorage.setItem('factcheckApiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);
  
  useEffect(() => {
    localStorage.setItem('factcheck_selected_model', selectedModel);
  }, [selectedModel]);

  const addToHistory = (result: FactCheckResult) => {
    setResultsHistory(prev => {
      const newHistory = [result, ...prev].slice(0, 50);
      return newHistory;
    });
  };

  const clearHistory = () => {
    setResultsHistory([]);
  };

  const setApiKey = (key: keyof ApiKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const hasRequiredKeys = Boolean(apiKeys.openrouter || apiKeys.perplexity || apiKeys.openai);

  return (
    <FactCheckContext.Provider
      value={{
        isLoading,
        currentQuery,
        setCurrentQuery,
        currentResult,
        setCurrentResult: (result) => {
          setCurrentResult(result);
          setIsLoading(false);
          if (result) {
            addToHistory(result);
          }
        },
        resultsHistory,
        addToHistory,
        clearHistory,
        apiKeys,
        setApiKey,
        hasRequiredKeys,
        isModalOpen,
        setIsModalOpen,
        selectedModel,
        setSelectedModel,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </FactCheckContext.Provider>
  );
};
