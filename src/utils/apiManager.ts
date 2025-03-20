
// API key management utility

interface ApiKeyStorage {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const apiKeyStorage: ApiKeyStorage = {
  get: (key: string) => {
    try {
      return localStorage.getItem(`factcheck_api_${key}`);
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  },
  
  set: (key: string, value: string) => {
    try {
      localStorage.setItem(`factcheck_api_${key}`, value);
    } catch (error) {
      console.error('Error setting API key:', error);
    }
  },
  
  remove: (key: string) => {
    try {
      localStorage.removeItem(`factcheck_api_${key}`);
    } catch (error) {
      console.error('Error removing API key:', error);
    }
  },
  
  clear: () => {
    try {
      // Clear only API keys, not other localStorage items
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('factcheck_api_')) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing API keys:', error);
    }
  }
};

export const validateApiKey = (key: string, type: 'openrouter'): boolean => {
  if (!key || key.trim() === '') {
    return false;
  }
  
  // Basic validation based on key patterns
  return key.length > 20; // OpenRouter keys are long alphanumeric strings
};

export const maskApiKey = (key: string): string => {
  if (!key || key.length <= 8) {
    return '••••••••';
  }
  
  const firstFour = key.substring(0, 4);
  const lastFour = key.substring(key.length - 4);
  
  return `${firstFour}••••••••${lastFour}`;
};

// Default OpenRouter API key (provided by the application)
export const DEFAULT_OPENROUTER_API_KEY = "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";

// OpenRouter models configuration
export const openRouterModels = {
  deepseek: {
    id: "deepseek/deepseek-r1:free",
    name: "DeepSeek R1",
    description: "Free open-source model with 671B parameters",
    icon: "🧠"
  },
  gemini: {
    id: "google/gemini-2.0-pro-exp-02-05:free",
    name: "Google Gemini Pro 2.0",
    description: "Free experimental model with 2M context window",
    icon: "🔍"
  }
};
