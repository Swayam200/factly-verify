
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

  // Load saved data from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('factcheckHistory');
    const savedApiKeys = localStorage.getItem('factcheckApiKeys');
    
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
      // If no API keys are found, show the modal automatically
      setIsModalOpen(true);
    }
  }, []);
  
  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('factcheckHistory', JSON.stringify(resultsHistory));
  }, [resultsHistory]);
  
  useEffect(() => {
    localStorage.setItem('factcheckApiKeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const addToHistory = (result: FactCheckResult) => {
    setResultsHistory(prev => {
      const newHistory = [result, ...prev].slice(0, 50); // Keep only the most recent 50 checks
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

  // Check if required API keys are available (either OpenAI or Perplexity)
  const hasRequiredKeys = Boolean(apiKeys.openai || apiKeys.perplexity);

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
      }}
    >
      {children}
    </FactCheckContext.Provider>
  );
};
