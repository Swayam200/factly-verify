
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

export const validateApiKey = (key: string, type: 'openai' | 'google' | 'newsapi' | 'perplexity'): boolean => {
  if (!key || key.trim() === '') {
    return false;
  }
  
  // Basic validation based on key patterns
  switch (type) {
    case 'openai':
      return key.startsWith('sk-') && key.length > 20;
    case 'perplexity':
      return key.startsWith('pplx-') && key.length > 20;
    case 'google':
      return key.length > 20;
    case 'newsapi':
      return key.length > 10;
    default:
      return false;
  }
};

export const maskApiKey = (key: string): string => {
  if (!key || key.length <= 8) {
    return '••••••••';
  }
  
  const firstFour = key.substring(0, 4);
  const lastFour = key.substring(key.length - 4);
  
  return `${firstFour}••••••••${lastFour}`;
};
