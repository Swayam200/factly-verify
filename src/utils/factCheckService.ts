
import { FactCheckResult, ResultStatus, Source } from '../context/FactCheckContext';

// Helper to generate random ID for each check
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Function to determine result status from OpenAI response
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

// Format sources from OpenAI response
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

// Verify fact with OpenAI
export const verifyFactWithOpenAI = async (
  query: string, 
  apiKey: string
): Promise<FactCheckResult> => {
  try {
    console.log("Verifying fact with OpenAI API...");
    
    const url = 'https://api.openai.com/v1/chat/completions';
    
    const prompt = `
    I need a detailed fact check of the following claim:
    
    Claim: "${query}"
    
    Please analyze this claim and respond in a structured JSON format with the following fields:
    - verdict: "True", "False", "Partially True", or "Unknown"
    - confidence: A number between 0 and 1 indicating confidence in the verdict
    - explanation: A detailed explanation justifying the verdict
    - sources: An array of sources supporting the analysis, each with:
      - url: URL of the source
      - title: Title of the source
      - snippet: Brief excerpt from the source that supports the analysis
      - reliability: A number between 0 and 1 indicating source reliability
    
    Ensure the response is ONLY the requested JSON object with no preamble or additional text.
    `;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1024
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Extract and parse the JSON response from the message content
    const content = data.choices[0]?.message?.content || '';
    console.log("OpenAI raw response:", content);
    
    let analysis;
    try {
      // Try to extract JSON if wrapped in code blocks or has explanatory text
      const jsonMatch = content.match(/```(?:json)?([\s\S]*?)```/) || content.match(/({[\s\S]*})/);
      const jsonContent = jsonMatch ? jsonMatch[1] : content;
      analysis = JSON.parse(jsonContent);
    } catch (e) {
      console.error("Failed to parse JSON from OpenAI response:", e);
      console.log("Attempting to extract structured information from response...");
      
      // Fallback: Try to extract structured information from text
      const status = content.toLowerCase().includes('false') ? 'false' : 
                    content.toLowerCase().includes('true') ? 'true' : 'unknown';
      
      return {
        id: generateId(),
        query,
        status: status as ResultStatus,
        confidenceScore: 0.6,
        explanation: content.substring(0, 500),
        sources: [],
        timestamp: new Date().toISOString()
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
    console.error('Error verifying fact with OpenAI:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to verify fact. Please try again later.');
  }
};

// Main fact verification function
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
