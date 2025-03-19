
import React, { useState, useEffect } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import VerificationBadge from './VerificationBadge';
import SourcesList from './SourcesList';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark, Share2, Clock, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const ResultCard: React.FC = () => {
  const { currentResult, currentQuery, isLoading } = useFactCheck();
  const [showAnimation, setShowAnimation] = useState(false);
  
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
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8 glass-panel">
        <CardHeader className="text-center">
          <CardTitle>Processing request...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-40">
            <div className="relative h-24 w-24">
              <div className="absolute inset-0 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
            </div>
          </div>
          <p className="text-center text-muted-foreground mt-4">
            Analyzing: "{currentQuery}"
          </p>
        </CardContent>
      </Card>
    );
  }
  
  // Result is available
  if (currentResult) {
    const { query, status, confidenceScore, explanation, sources, timestamp } = currentResult;
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
          
          <SourcesList sources={sources} />
        </CardContent>
        
        <CardFooter className="flex justify-between py-4">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Bookmark size={16} />
            <span className="hidden sm:inline">Save</span>
          </Button>
          
          <Button variant="outline" size="sm" className="gap-1.5">
            <Share2 size={16} />
            <span className="hidden sm:inline">Share</span>
          </Button>
          
          <Button variant="default" size="sm" className="gap-1.5 ml-auto">
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
