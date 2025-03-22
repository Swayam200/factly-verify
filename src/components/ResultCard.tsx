import React, { useState, useEffect, useRef } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import VerificationBadge from './VerificationBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark, Share2, Clock, ArrowRight, LinkIcon, ExternalLink, ImageIcon, Copy, Check, ChartBar } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import FeedbackButtons from './FeedbackButtons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (e) {
    return url;
  }
};

const fetchImageForSource = async (source: { url: string; title: string; imageUrl?: string }) => {
  if (source.imageUrl) return source.imageUrl;
  
  try {
    const domain = extractDomain(source.url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch (error) {
    console.error('Error generating image for source:', error);
    return '/placeholder.svg';
  }
};

const CHART_COLORS = [
  '#8B5CF6',
  '#06B6D4',
  '#10B981',
  '#F59E0B',
  '#EC4899',
  '#6366F1',
  '#14B8A6',
  '#F97316',
  '#8B5CF6',
];

const ResultCard: React.FC = () => {
  const { currentResult, currentQuery, isLoading, setCurrentQuery, setCurrentResult } = useFactCheck();
  const [showAnimation, setShowAnimation] = useState(false);
  const [sourcesWithImages, setSourcesWithImages] = useState<any[]>([]);
  const [isCopied, setIsCopied] = useState(false);
  
  useEffect(() => {
    if (currentResult) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentResult]);
  
  useEffect(() => {
    if (currentResult?.sources) {
      Promise.all(
        currentResult.sources.map(async (source) => ({
          ...source,
          imageUrl: await fetchImageForSource(source)
        }))
      ).then(sourcesWithImages => {
        setSourcesWithImages(sourcesWithImages);
      });
    }
  }, [currentResult]);
  
  const handleNewCheck = () => {
    setCurrentQuery('');
    setCurrentResult(null);
  };
  
  const handleShare = () => {
    if (!currentResult) return;
    
    const shareText = `Fact Check: "${currentResult.query}" - ${
      currentResult.status === 'true' ? 'TRUE' : 
      currentResult.status === 'false' ? 'FALSE' : 
      currentResult.status === 'neutral' ? 'NEUTRAL' : 'UNCERTAIN'
    } with ${Math.round(currentResult.confidenceScore * 100)}% confidence. 
    
${currentResult.explanation}

Shared from Real or Fake - AI Fact Checker`;

    if (navigator.share) {
      navigator.share({
        title: 'Fact Check Result',
        text: shareText
      }).catch(err => {
        console.error('Error sharing:', err);
        copyToClipboard(shareText);
      });
    } else {
      copyToClipboard(shareText);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      toast.success('Copied to clipboard');
      
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    });
  };
  
  const getSourceDistributionData = () => {
    if (!currentResult?.sources || currentResult.sources.length === 0) return [];
    
    const categoryMap: Record<string, { count: number; sources: string[] }> = {};
    
    currentResult.sources.forEach(source => {
      const domain = extractDomain(source.url);
      const category = domain.split('.')[0];
      
      if (!categoryMap[category]) {
        categoryMap[category] = { count: 0, sources: [] };
      }
      
      categoryMap[category].count += 1;
      if (!categoryMap[category].sources.includes(domain)) {
        categoryMap[category].sources.push(domain);
      }
    });
    
    return Object.entries(categoryMap)
      .map(([name, { count, sources }]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value: count,
        sources
      }))
      .sort((a, b) => b.value - a.value);
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 bg-popover border border-border rounded-md shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-muted-foreground">{data.value} sources</p>
          {data.sources && data.sources.length > 0 && (
            <div className="mt-1 text-xs text-muted-foreground">
              <p>Domains:</p>
              <ul className="list-disc list-inside">
                {data.sources.slice(0, 3).map((source: string, i: number) => (
                  <li key={i}>{source}</li>
                ))}
                {data.sources.length > 3 && <li>and {data.sources.length - 3} more...</li>}
              </ul>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 glass-panel animate-pulse">
        <CardHeader className="text-center">
          <div className="h-8 bg-primary/20 animate-pulse rounded-full w-40 mx-auto mb-3"></div>
          <div className="h-6 bg-muted animate-pulse rounded-full w-3/4 mx-auto"></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-20 bg-muted animate-pulse rounded-md"></div>
          <div className="h-40 bg-muted animate-pulse rounded-md"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!currentResult && !currentQuery) {
    return null;
  }
  
  if (!currentResult && currentQuery) {
    return null;
  }
  
  if (currentResult) {
    const { id, query, status, confidenceScore, explanation, sources, timestamp } = currentResult;
    const formattedDate = new Date(timestamp).toLocaleString();
    
    const sourceData = getSourceDistributionData();
    
    return (
      <Card 
        className={cn(
          "w-full max-w-3xl mx-auto mt-8 glass-panel overflow-hidden",
          showAnimation && "animate-slide-in"
        )}
      >
        <div 
          className={cn(
            "h-2 transition-all",
            status === 'true' && "bg-result-true",
            status === 'false' && "bg-result-false",
            status === 'neutral' && "bg-result-neutral",
            status === 'unknown' && "bg-result-unknown",
          )}
        />
        
        <CardHeader className="relative pt-8 pb-4">
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <VerificationBadge 
              status={status} 
              confidenceScore={confidenceScore} 
              size="lg" 
              animate={showAnimation}
              className="glass-panel shadow-lg border-2"
            />
          </div>
          
          <CardTitle className="text-xl mt-4 text-center max-w-2xl mx-auto">
            "{query}"
          </CardTitle>
          
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
            <Clock size={14} />
            <span>{formattedDate}</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="bg-secondary/50 dark:bg-secondary/30 backdrop-blur-xs rounded-lg p-4 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Analysis</h3>
            <p className="text-muted-foreground">{explanation}</p>
          </div>
          
          {sourceData.length > 0 && (
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ChartBar size={18} className="text-primary" />
                  <h3 className="text-lg font-semibold">Source Distribution</h3>
                </div>
                <span className="text-xs text-muted-foreground">{sources?.length || 0} sources</span>
              </div>
              
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${Math.round(percent * 100)}%`}
                      labelLine={false}
                    >
                      {sourceData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CHART_COLORS[index % CHART_COLORS.length]} 
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth={1}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36} 
                      formatter={(value) => (
                        <span className="text-xs font-medium">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="text-center text-xs text-muted-foreground mt-2">
                Hover over segments for more details
              </div>
            </div>
          )}
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Sources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sourcesWithImages.map((source, index) => (
                <a 
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors group hover-lift shadow-sm"
                >
                  <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden bg-muted/50">
                    {source.imageUrl ? (
                      <img 
                        src={source.imageUrl} 
                        alt={source.title} 
                        className="h-full w-full object-cover" 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.svg';
                        }} 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-muted">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{source.title}</h4>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <LinkIcon size={12} />
                      <span className="truncate">{extractDomain(source.url)}</span>
                      <ExternalLink size={12} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          <Separator />
          
          <FeedbackButtons resultId={id} />
        </CardContent>
        
        <CardFooter className="flex justify-between py-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5 hover-lift"
            onClick={() => toast.info("Bookmarking coming soon")}
          >
            <Bookmark size={16} />
            <span className="hidden sm:inline">Save</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1.5 hover-lift"
            onClick={handleShare}
          >
            {isCopied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
            <span className="hidden sm:inline">{isCopied ? 'Copied' : 'Share'}</span>
          </Button>
          
          <Button 
            variant="default" 
            size="sm" 
            className="gap-1.5 ml-auto button-glow"
            onClick={handleNewCheck}
          >
            <span>New Check</span>
            <ArrowRight size={16} />
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return null;
};

export default ResultCard;
