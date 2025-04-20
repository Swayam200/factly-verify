
import { FactCheckResult } from '../context/FactCheckContext';
import { openRouterModels } from './apiManager';
import { verifyFactWithOpenRouter } from './services/openRouterService';
import { generateId } from './helpers/idGenerator';
import { saveFactCheckToSupabase, fetchUserFactChecks } from './adapters/supabaseAdapter';

// Main fact verification function
export const verifyFact = async (
  query: string,
  apiKeys: {
    openrouter?: string;
  },
  modelPreference?: string
): Promise<FactCheckResult> => {
  try {
    if (!query.trim()) {
      throw new Error('Please enter a claim to verify');
    }
    
    // Try with OpenRouter API
    if (apiKeys.openrouter) {
      try {
        // Use specified model or default to DeepSeek
        const modelId = modelPreference || openRouterModels.deepseek.id;
        return await verifyFactWithOpenRouter(query, apiKeys.openrouter, modelId);
      } catch (error) {
        // If the error is about rate limits, create a special error result
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        if (errorMessage.includes('Rate limit') || errorMessage.includes('quota')) {
          return {
            id: generateId(),
            query,
            status: 'unknown',
            confidenceScore: 0,
            explanation: `API Rate Limit Exceeded: The AI model is currently experiencing high traffic. Please try again in a few minutes or try a different model.`,
            sources: [],
            timestamp: new Date().toISOString() // Changed from Date.now() to ISO string
          };
        }
        throw error;
      }
    }
    
    throw new Error('No API key available. Please try again later.');
    
  } catch (error) {
    console.error('Error verifying fact:', error);
    
    // Return an error result
    return {
      id: generateId(),
      query,
      status: 'unknown',
      confidenceScore: 0,
      explanation: error instanceof Error ? error.message : 'An unknown error occurred',
      sources: [],
      timestamp: new Date().toISOString() // Changed from Date.now() to ISO string
    };
  }
};

// Re-export the functions from the adapter
export { saveFactCheckToSupabase, fetchUserFactChecks };
