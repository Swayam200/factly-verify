
import { FactCheckResult, ResultStatus, Source } from '../context/FactCheckContext';

// Helper to generate random ID for each check
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Mock sources for demonstration (we'll replace these with real API calls)
const mockSources: Record<ResultStatus, Source[]> = {
  'true': [
    { url: 'https://example.com/reliable-source-1', title: 'Scientific Journal Article', snippet: 'A peer-reviewed study confirms this fact...', reliability: 0.95 },
    { url: 'https://example.com/reliable-source-2', title: 'Government Data Portal', snippet: 'Official statistics support this claim...', reliability: 0.92 }
  ],
  'false': [
    { url: 'https://example.com/fact-check', title: 'Fact-Check Organization', snippet: 'This claim has been debunked multiple times...', reliability: 0.9 },
    { url: 'https://example.com/analysis', title: 'Expert Analysis', snippet: 'The data contradicts this assertion...', reliability: 0.85 }
  ],
  'neutral': [
    { url: 'https://example.com/perspective-1', title: 'Research Perspective', snippet: 'Some evidence supports this, but other factors...', reliability: 0.7 },
    { url: 'https://example.com/perspective-2', title: 'Alternative Analysis', snippet: 'The claim might be partially valid in context...', reliability: 0.65 }
  ],
  'unknown': [
    { url: 'https://example.com/limited-data', title: 'Research Overview', snippet: 'Insufficient evidence exists to verify this claim...', reliability: 0.5 },
    { url: 'https://example.com/ongoing-research', title: 'Recent Studies', snippet: 'This topic is still being researched...', reliability: 0.45 }
  ]
};

// Sample explanations for each result type
const explanations: Record<ResultStatus, string[]> = {
  'true': [
    'This claim is supported by multiple credible sources and is backed by factual evidence.',
    'Analysis of available data strongly confirms this statement is accurate.',
    'Expert consensus and verifiable information indicate this claim is true.'
  ],
  'false': [
    'This claim contradicts well-established facts and has been debunked by multiple reliable sources.',
    'Available evidence clearly disproves this statement.',
    'Expert analysis and factual data demonstrate this claim is false.'
  ],
  'neutral': [
    'This claim contains elements of truth but may be misleading without additional context.',
    'The statement is partially accurate but omits important nuances or details.',
    'Available evidence shows this is a complex topic with valid perspectives on both sides.'
  ],
  'unknown': [
    'Insufficient evidence exists to verify or refute this claim with confidence.',
    'Available information is too limited to make a definitive assessment of this statement.',
    'This topic lacks adequate research or data for a conclusive determination.'
  ]
};

// Simulate fact-checking API call using OpenAI
export const verifyFactWithOpenAI = async (
  query: string, 
  apiKey: string
): Promise<FactCheckResult> => {
  try {
    // API call would go here
    // For now, let's create a simulated response based on the query
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    
    // Dummy logic to determine result from the query
    let status: ResultStatus = 'unknown';
    let confidenceScore = 0;
    
    const queryLower = query.toLowerCase();
    
    if (
      queryLower.includes('earth is flat') || 
      queryLower.includes('covid vaccine microchip') ||
      queryLower.includes('fake moon landing') ||
      queryLower.includes('5g causes') ||
      queryLower.includes('dinosaurs never existed')
    ) {
      status = 'false';
      confidenceScore = 0.85 + Math.random() * 0.14;
    } 
    else if (
      queryLower.includes('earth is round') || 
      queryLower.includes('water is h2o') ||
      queryLower.includes('humans need oxygen') ||
      queryLower.includes('dinosaurs existed') ||
      queryLower.includes('vaccines prevent')
    ) {
      status = 'true';
      confidenceScore = 0.9 + Math.random() * 0.09;
    }
    else if (
      queryLower.includes('best') || 
      queryLower.includes('better') ||
      queryLower.includes('worst') ||
      queryLower.includes('should') ||
      queryLower.includes('opinion')
    ) {
      status = 'neutral';
      confidenceScore = 0.6 + Math.random() * 0.3;
    }
    else {
      // More advanced logic would go here
      // Randomly assign for demo purposes
      const rand = Math.random();
      if (rand < 0.3) {
        status = 'true';
        confidenceScore = 0.7 + Math.random() * 0.29;
      } else if (rand < 0.6) {
        status = 'false';
        confidenceScore = 0.7 + Math.random() * 0.29;
      } else if (rand < 0.9) {
        status = 'neutral';
        confidenceScore = 0.5 + Math.random() * 0.4;
      } else {
        status = 'unknown';
        confidenceScore = 0.3 + Math.random() * 0.5;
      }
    }
    
    // In a real implementation, we would use the OpenAI API here
    const explanationIndex = Math.floor(Math.random() * explanations[status].length);
    
    return {
      id: generateId(),
      query,
      status,
      confidenceScore,
      explanation: explanations[status][explanationIndex],
      sources: mockSources[status],
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error verifying fact with OpenAI:', error);
    throw new Error('Failed to verify fact. Please try again later.');
  }
};

// In a production application, this would be replaced with actual API calls
export const verifyFact = async (
  query: string,
  apiKeys: {
    openai?: string;
    google?: string;
    newsapi?: string;
  }
): Promise<FactCheckResult> => {
  try {
    if (!query.trim()) {
      throw new Error('Please enter a claim to verify');
    }
    
    if (!apiKeys.openai) {
      throw new Error('OpenAI API key is required');
    }
    
    return await verifyFactWithOpenAI(query, apiKeys.openai);
    
    // In a more advanced implementation, we would combine results from multiple APIs
    // For example:
    // const openaiResult = await verifyFactWithOpenAI(query, apiKeys.openai);
    // const googleResult = apiKeys.google ? await searchGoogleForSources(query, apiKeys.google) : [];
    // const newsResults = apiKeys.newsapi ? await searchNewsForSources(query, apiKeys.newsapi) : [];
    // return combineResults(query, openaiResult, googleResult, newsResults);
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
      timestamp: new Date().toISOString()
    };
  }
};
