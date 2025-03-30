
import { OpenAI } from 'openai';
import { FactCheckResult } from '@/context/FactCheckContext';
import { rateLimiter } from '../helpers/rateLimiter';
import { generateId } from '../helpers/idGenerator';
import { determineStatus, determineConfidence, formatSources } from '../helpers/resultAnalyzer';

// Verify fact with OpenRouter API using OpenAI client
export const verifyFactWithOpenRouter = async (
  query: string, 
  apiKey: string,
  modelId: string
): Promise<FactCheckResult> => {
  try {
    // Check rate limiting
    if (!rateLimiter.isAllowed()) {
      const waitTime = Math.ceil(rateLimiter.getWaitTime() / 1000);
      throw new Error(`Rate limit exceeded. Please try again in ${waitTime} seconds.`);
    }
    
    console.log(`Verifying fact with OpenRouter API using model: ${modelId}...`);
    
    // Initialize the OpenAI client with OpenRouter base URL
    // Explicitly set dangerouslyAllowBrowser to true since we're using OpenRouter as a proxy
    // The actual OpenAI key is not exposed, we're using OpenRouter's API
    const client = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey: apiKey,
      dangerouslyAllowBrowser: true, // Added this flag since we're using OpenRouter as a proxy
      defaultHeaders: {
        "HTTP-Referer": window.location.href,
        "X-Title": "Real or Fake Fact-Checker"
      }
    });
    
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
    
    const completion = await client.chat.completions.create({
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
      temperature: 0.1,
      max_tokens: 2000
    });
    
    // Extract the content from the response
    const content = completion.choices[0]?.message?.content || '';
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
