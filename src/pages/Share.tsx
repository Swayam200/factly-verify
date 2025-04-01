
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useFactCheck } from '@/context/FactCheckContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MovingBackground from '@/components/MovingBackground';
import VerificationBadge from '@/components/VerificationBadge';
import { Loader2, ArrowLeft } from 'lucide-react';
import { FactCheckResult } from '@/context/FactCheckContext';

const Share: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { resultsHistory } = useFactCheck();
  const navigate = useNavigate();
  const [result, setResult] = useState<FactCheckResult | null>(null);
  const [loading, setLoading] = useState(true);
  
  const resultId = searchParams.get('id');
  
  useEffect(() => {
    if (resultId) {
      // Find the fact check result by ID
      const foundResult = resultsHistory.find(r => r.id === resultId);
      
      if (foundResult) {
        setResult(foundResult);
      }
      
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [resultId, resultsHistory]);
  
  if (loading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="container relative flex flex-col items-center justify-center min-h-screen px-4 mx-auto">
        <MovingBackground />
        <Card className="max-w-lg w-full z-10">
          <CardHeader>
            <CardTitle>Result Not Found</CardTitle>
            <CardDescription>
              The fact check result you're looking for could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The shared result may have been deleted or the link might be incorrect.
            </p>
            <Button onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container relative flex flex-col items-center justify-center min-h-screen px-4 mx-auto">
      <MovingBackground />
      
      <Card className="max-w-3xl w-full z-10">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div>
              <CardTitle className="text-2xl mb-1">Shared Fact Check</CardTitle>
              <CardDescription>Verified by Fact Check AI</CardDescription>
            </div>
            <VerificationBadge 
              status={result.status} 
              confidenceScore={result.confidenceScore}
              size="lg"
              animate
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="text-lg font-semibold">Claim</div>
            <p className="text-xl mt-1">"{result.query}"</p>
          </div>
          
          <div>
            <div className="text-lg font-semibold">Verdict</div>
            <p className="mt-1">{result.explanation}</p>
          </div>
          
          {result.sources.length > 0 && (
            <div>
              <div className="text-lg font-semibold">Sources</div>
              <ul className="mt-1 space-y-2">
                {result.sources.slice(0, 3).map((source, index) => (
                  <li key={index} className="border p-3 rounded-md">
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-medium hover:underline block"
                    >
                      {source.title}
                    </a>
                    {source.snippet && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {source.snippet}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="mt-6 pt-4 border-t flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="text-xs text-muted-foreground">
              Fact checked on {new Date(result.timestamp).toLocaleString()}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              <Button onClick={() => navigate('/')}>
                Check Another Fact
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Share;
