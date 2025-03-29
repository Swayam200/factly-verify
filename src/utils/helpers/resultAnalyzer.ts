
import { ResultStatus } from '@/context/FactCheckContext';
import { Source } from '@/context/FactCheckContext';

// Function to determine result status from AI response
export const determineStatus = (analysis: any): ResultStatus => {
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

export const determineConfidence = (analysis: any): number => {
  if (analysis.confidence && !isNaN(analysis.confidence)) {
    return Math.min(Math.max(analysis.confidence, 0), 1); // Ensure between 0 and 1
  }
  return 0.5; // Default confidence if not provided
};

// Format sources from AI response
export const formatSources = (sources: any[]): Source[] => {
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
