import React, { useState, useEffect, useRef } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import VerificationBadge from './VerificationBadge';
import SourcesList from './SourcesList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark, Share2, Clock, ArrowRight, LinkIcon, ExternalLink, ImageIcon, Copy } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import FeedbackButtons from './FeedbackButtons';

// Helper function to extract domain from URL
const extractDomain = (url: string): string => {
  try {
    const domain = new URL(url).hostname;
    return domain.replace('www.', '');
  } catch (e) {
    return url;
  }
};

// Image placeholder for sources
const fetchImageForSource = async (source: { url: string; title: string; imageUrl?: string }) => {
  if (source.imageUrl) return source.imageUrl;
  
  try {
    // Extract domain name for the source
    const domain = extractDomain(source.url);
    // Use a favicon service to get a placeholder icon
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch (error) {
    console.error('Error generating image for source:', error);
    return '/placeholder.svg';
  }
};

const ResultCard: React.FC = () => {
  const { currentResult, currentQuery, isLoading, setCurrentQuery, setCurrentResult } = useFactCheck();
  const [showAnimation, setShowAnimation] = useState(false);
  const [sourcesWithImages, setSourcesWithImages] = useState<any[]>([]);
  
  // Reset animation when result changes
  useEffect(() => {
    if (currentResult) {
      setShowAnimation(true);
      const timer = setTimeout(() => {
        setShowAnimation(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentResult]);
  
  // Process sources to add images
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
  
  // Handle new check button
  const handleNewCheck = () => {
    setCurrentQuery('');
    setCurrentResult(null);
  };
  
  // Share functionality
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
  
  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    });
  };
  
  // Loading state
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
  
  // No result or query yet
  if (!currentResult && !currentQuery) {
    return null;
  }
  
  // No result but query is being processed
  if (!currentResult && currentQuery) {
    return null; // Using the LoadingScreen component instead
  }
  
  // Result is available
  if (currentResult) {
    const { id, query, status, confidenceScore, explanation, sources, timestamp } = currentResult;
    const formattedDate = new Date(timestamp).toLocaleString();
    
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
              className="glass-panel shadow-md border-2"
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
          <div className="bg-secondary/50 dark:bg-secondary/30 backdrop-blur-xs rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Analysis</h3>
            <p className="text-muted-foreground">{explanation}</p>
          </div>
          
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
                  className="flex gap-3 p-3 rounded-lg border border-border hover:bg-secondary/50 transition-colors group hover-lift"
                >
                  <div className="source-image flex-shrink-0">
                    {source.imageUrl ? (
                      <img src={source.imageUrl} alt={source.title} className="h-full w-full object-cover" onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }} />
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
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
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
