
import { FactCheckResult, ResultStatus, Source } from '@/context/FactCheckContext';
import { Json } from '@/integrations/supabase/types';

// Helper to convert Source[] to a safe JSON format for Supabase
export const sourcesToJson = (sources: Source[]): Json => {
  return sources.map(source => ({
    url: source.url,
    title: source.title,
    snippet: source.snippet || "",
    reliability: source.reliability || 0.5,
    imageUrl: source.imageUrl || ""
  })) as Json;
};

// Helper to convert JSON from Supabase back to Source[]
export const jsonToSources = (json: Json | null): Source[] => {
  if (!json || !Array.isArray(json)) return [];
  
  return json.map((item: any) => ({
    url: item.url || 'https://example.com',
    title: item.title || 'Source',
    snippet: item.snippet || '',
    reliability: typeof item.reliability === 'number' ? item.reliability : 0.5,
    imageUrl: item.imageUrl || undefined
  }));
};

// Save fact check to Supabase for logged-in users
export const saveFactCheckToSupabase = async (factCheck: FactCheckResult, userId: string | undefined) => {
  try {
    if (!userId) return; // Don't save if user isn't logged in
    
    const { supabase } = await import('@/integrations/supabase/client');
    
    // Convert Source[] to Json for storage
    await supabase.from('fact_checks').insert({
      user_id: userId,
      query: factCheck.query,
      status: factCheck.status,
      confidence_score: factCheck.confidenceScore,
      explanation: factCheck.explanation,
      sources: sourcesToJson(factCheck.sources)
    });
    
    console.log('Fact check saved to Supabase');
  } catch (error) {
    console.error('Error saving fact check to Supabase:', error);
  }
};

// Fetch user's fact checks from Supabase
export const fetchUserFactChecks = async (userId: string | undefined): Promise<FactCheckResult[]> => {
  try {
    if (!userId) return []; // Return empty array if user isn't logged in
    
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data, error } = await supabase
      .from('fact_checks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (!data) return [];
    
    // Convert database records to FactCheckResult objects
    return data.map(item => ({
      id: item.id,
      query: item.query,
      status: item.status as ResultStatus,
      confidenceScore: item.confidence_score || 0,
      explanation: item.explanation || '',
      sources: jsonToSources(item.sources),
      timestamp: item.created_at || new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error fetching fact checks from Supabase:', error);
    return [];
  }
};
