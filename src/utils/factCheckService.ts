
import { FactCheckResult, ResultStatus, Source } from '../context/FactCheckContext';
import { openRouterModels } from './apiManager';

// Helper to generate random ID for each check
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Function to determine result status from AI response
const determineStatus = (analysis: any): ResultStatus => {
  const verdict = analysis.verdict?.toLowerCase() || '';
  
  if (verdict.includes('true') || verdict.includes('accurate') || verdict.includes('correct')) {
    return 'true';
  } else if (verdict.includes('false') || verdict.includes('incorrect') || verdict.includes('inaccurate')) {
    return 'false';
  } else if (verdict.includes('partially') || verdict.includes('mixed') || verdict.includes('needs context')) {
    return 'neutral';
  } else {
    return 'unknown';
  }
};

const determineConfidence = (analysis: any): number => {
  if (analysis.confidence && !isNaN(analysis.confidence)) {
    return Math.min(Math.max(analysis.confidence, 0), 1); // Ensure between 0 and 1
  }
  return 0.5; // Default confidence if not provided
};

// Format sources from AI response
const formatSources = (sources: any[]): Source[] => {
  if (!sources || !Array.isArray(sources) || sources.length === 0) {
    return [];
  }
  
  return sources.map(source => ({
    url: source.url || 'https://example.com',
    title: source.title || 'Source',
    snippet: source.snippet || source.description || '',
    reliability: source.reliability || Math.random() * 0.5 + 0.5  // Random reliability between 0.5 and 1
  }));
};

// Rate limiter implementation
const rateLimiter = {
  // Store timestamps of requests
  requests: [] as number[],
  // Maximum requests allowed in the time window
  maxRequests: 10,
  // Time window in milliseconds (30 seconds)
  timeWindow: 30000,
  
  // Check if a new request is allowed
  isAllowed: function(): boolean {
    const now = Date.now();
    // Remove timestamps outside the time window
    this.requests = this.requests.filter(time => time > now - this.timeWindow);
    
    // If we haven't hit the limit, allow the request
    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    
    return false;
  },
  
  // Get remaining time until next available request slot
  getWaitTime: function(): number {
    const now = Date.now();
    if (this.requests.length === 0) return 0;
    
    // Sort requests by timestamp (oldest first)
    const sortedRequests = [...this.requests].sort((a, b) => a - b);
    // When the oldest request will expire
    const oldestExpiry = sortedRequests[0] + this.timeWindow;
    
    return Math.max(0, oldestExpiry - now);
  }
};

// Verify fact with OpenRouter API (using specified model)
export const verifyFactWithOpenRouter = async (
  query: string, 
  apiKey: string,
  modelId: string = openRouterModels.deepseek.id
): Promise<FactCheckResult> => {
  try {
    // Check rate limiting
    if (!rateLimiter.isAllowed()) {
      const waitTime = Math.ceil(rateLimiter.getWaitTime() / 1000);
      throw new Error(`Rate limit exceeded. Please try again in ${waitTime} seconds.`);
    }
    
    console.log(`Verifying fact with OpenRouter API using model: ${modelId}...`);
    
    const url = 'https://openrouter.ai/api/v1/chat/completions';
    
    const systemPrompt = `
    You are a factual analysis assistant that evaluates claims for truthfulness.
    
    Analyze the claim provided and return ONLY a valid JSON object with these fields:
    - verdict: "True", "False", "Partially True", or "Unknown"
    - confidence: A number between 0 and 1 indicating your confidence
    - explanation: A detailed explanation of why the claim is true or false
    - sources: An array of sources with "url", "title", "snippet", and "reliability" (0-1 number) fields
    
    DO NOT include any text before or after the JSON.
    DO NOT use markdown code blocks.
    DO NOT break or truncate your response.
    ENSURE your response is a complete, valid JSON object.
    `;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.href,
        'X-Title': 'Real or Fake Fact-Checker'
      },
      body: JSON.stringify({
        model: modelId,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Fact check the following claim: "${query}"`
          }
        ],
        temperature: 0.1, // Lower temperature for more consistent responses
        max_tokens: 2000  // Increased max tokens to ensure complete responses
      }),
    });
    
    const data = await response.json();
    
    // Check for API error responses
    if (data.error) {
      console.error('OpenRouter API error:', data.error);
      
      // Check for rate limit or quota errors
      if (data.error.code === 429) {
        if (data.error.metadata?.provider_name) {
          throw new Error(`Rate limit exceeded from provider: ${data.error.metadata.provider_name}. Please try a different model or try again later.`);
        } else {
          throw new Error(`Rate limit exceeded. Please try again later.`);
        }
      }
      
      throw new Error(data.error.message || 'API error occurred');
    }
    
    // Ensure we have a valid response with choices
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response from API. Missing choices array.');
    }
    
    // Extract and parse the JSON response from the message content
    const content = data.choices[0]?.message?.content || '';
    console.log("OpenRouter raw response:", content);
    
    let analysis;
    try {
      // Enhanced JSON extraction with better error handling
      let jsonContent = content;
      
      // Remove any markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?([\s\S]*?)```/) || content.match(/({[\s\S]*})/);
      if (jsonMatch) {
        jsonContent = jsonMatch[1].trim();
      }
      
      // Handle incomplete JSON by attempting to complete it
      if (jsonContent.includes('{') && !jsonContent.includes('}')) {
        console.warn("Incomplete JSON detected, attempting to fix");
        // Basic attempt to complete the JSON
        jsonContent += '}}';
      }
      
      analysis = JSON.parse(jsonContent);
    } catch (e) {
      console.error("Failed to parse JSON from OpenRouter response:", e);
      console.log("Falling back to text extraction");
      
      // More robust fallback for non-JSON responses
      const verdictMatch = content.match(/verdict\s*:\s*["']?([^"',}]+)["']?/i);
      const confidenceMatch = content.match(/confidence\s*:\s*([0-9.]+)/i);
      const explanationMatch = content.match(/explanation\s*:\s*["']?([^"']+)["']?/i);
      
      analysis = {
        verdict: verdictMatch ? verdictMatch[1].trim() : "Unknown",
        confidence: confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.5,
        explanation: explanationMatch ? explanationMatch[1].trim() : content.substring(0, 500),
        sources: []
      };
    }
    
    // Process the analysis into our result format
    const status = determineStatus(analysis);
    const confidenceScore = determineConfidence(analysis);
    const sources = formatSources(analysis.sources);
    
    return {
      id: generateId(),
      query,
      status,
      confidenceScore,
      explanation: analysis.explanation || content.substring(0, 500),
      sources,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error verifying fact with OpenRouter:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to verify fact. Please try again later.');
  }
};

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
            timestamp: new Date().toISOString()
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
      timestamp: new Date().toISOString()
    };
  }
};

