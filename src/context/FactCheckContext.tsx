
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { openRouterModels, DEFAULT_OPENROUTER_API_KEY, apiKeyStorage } from '@/utils/apiManager';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { saveFactCheckToSupabase, fetchUserFactChecks } from '@/utils/factCheckService';

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
  timestamp: string;
}

interface ApiKeys {
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
  useDefaultApiKey: boolean;
  setUseDefaultApiKey: (useDefault: boolean) => void;
  fetchSupabaseHistory: () => Promise<void>;
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
  useDefaultApiKey: true,
  setUseDefaultApiKey: () => {},
  fetchSupabaseHistory: async () => {},
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
  const [useDefaultApiKey, setUseDefaultApiKey] = useState(true);
  const { user } = useAuth();

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

  // When user changes, fetch their history from Supabase
  useEffect(() => {
    if (user) {
      fetchSupabaseHistory();
    }
  }, [user]);

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
    const savedUseDefaultKey = localStorage.getItem('factcheck_use_default_key');
    
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
    }
    
    if (savedModel) {
      setSelectedModel(savedModel);
    }

    if (savedUseDefaultKey) {
      setUseDefaultApiKey(savedUseDefaultKey === 'true');
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

  useEffect(() => {
    localStorage.setItem('factcheck_use_default_key', String(useDefaultApiKey));
  }, [useDefaultApiKey]);

  const fetchSupabaseHistory = async () => {
    if (!user) return;
    
    try {
      const supabaseResults = await fetchUserFactChecks(user.id);
      
      // Merge with local history, removing duplicates by ID
      if (supabaseResults.length > 0) {
        setResultsHistory(prevHistory => {
          const idSet = new Set(supabaseResults.map(r => r.id));
          const filteredLocalHistory = prevHistory.filter(item => !idSet.has(item.id));
          return [...supabaseResults, ...filteredLocalHistory].slice(0, 50);
        });
      }
    } catch (error) {
      console.error('Error fetching history from Supabase:', error);
    }
  };

  const addToHistory = (result: FactCheckResult) => {
    setResultsHistory(prev => {
      const newHistory = [result, ...prev].slice(0, 50);
      return newHistory;
    });
    
    // If user is logged in, save to Supabase
    if (user) {
      saveFactCheckToSupabase(result, user.id);
    }
  };

  const clearHistory = () => {
    setResultsHistory([]);
  };

  const setApiKey = (key: keyof ApiKeys, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [key]: value
    }));
    
    if (key === 'openrouter' && value) {
      toast.success('OpenRouter API key saved');
      setUseDefaultApiKey(false);
    }
  };

  // Consider user has required keys if they're using the default key or have their own
  const hasRequiredKeys = useDefaultApiKey || Boolean(apiKeys.openrouter);

  const handleSetCurrentResult = (result: FactCheckResult | null) => {
    setCurrentResult(result);
    setIsLoading(false);
    if (result) {
      addToHistory(result);
    }
  };

  return (
    <FactCheckContext.Provider
      value={{
        isLoading,
        currentQuery,
        setCurrentQuery,
        currentResult,
        setCurrentResult: handleSetCurrentResult,
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
        useDefaultApiKey,
        setUseDefaultApiKey,
        fetchSupabaseHistory,
      }}
    >
      {children}
    </FactCheckContext.Provider>
  );
};
