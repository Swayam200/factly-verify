
import React, { useState } from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle, Search, ArrowUpDown } from 'lucide-react';
import { toast } from 'sonner';
import VerificationBadge from '@/components/VerificationBadge';
import FactStatsChart from '@/components/FactStatsChart';
import { Input } from '@/components/ui/input';

const sortOptions = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'True Claims', value: 'true' },
  { label: 'False Claims', value: 'false' }
];

const History = () => {
  const { resultsHistory, clearHistory } = useFactCheck();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Filter results by tab selection
  const getFilteredResults = () => {
    let filtered = [...resultsHistory];
    
    // First apply search filter if any
    if (searchQuery.trim()) {
      filtered = filtered.filter(result => 
        result.query.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Then apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(result => result.status === activeTab);
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'true':
          return (b.status === 'true' ? 1 : 0) - (a.status === 'true' ? 1 : 0);
        case 'false':
          return (b.status === 'false' ? 1 : 0) - (a.status === 'false' ? 1 : 0);
        case 'newest':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });
  };
  
  const filteredResults = getFilteredResults();
  
  const handleClearHistory = () => {
    clearHistory();
    toast.success('History cleared');
  };
  
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Your Fact Check History</h1>
        
        {resultsHistory.length > 0 && (
          <>
            <FactStatsChart results={resultsHistory} className="mb-6" />
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="search-box relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
                <Input 
                  type="text" 
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2 items-center">
                <div className="sort-by flex items-center gap-2">
                  <ArrowUpDown size={16} className="text-muted-foreground" />
                  <select 
                    className="bg-transparent border rounded px-2 py-1 text-sm"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    {sortOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 size={16} className="mr-1" />
                      Clear History
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your fact check history.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearHistory}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="true">True</TabsTrigger>
                <TabsTrigger value="false">False</TabsTrigger>
                <TabsTrigger value="neutral">Neutral</TabsTrigger>
                <TabsTrigger value="unknown">Unknown</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                {filteredResults.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No results found
                  </div>
                )}
                
                {filteredResults.map((result) => (
                  <Card key={result.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div 
                      className={`h-1 ${
                        result.status === 'true' ? 'bg-result-true' : 
                        result.status === 'false' ? 'bg-result-false' : 
                        result.status === 'neutral' ? 'bg-result-neutral' : 
                        'bg-result-unknown'
                      }`}
                    />
                    <CardHeader className="py-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg font-medium line-clamp-2">"{result.query}"</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {new Date(result.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <VerificationBadge 
                          status={result.status} 
                          confidenceScore={result.confidenceScore}
                          size="md"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="line-clamp-3">{result.explanation}</p>
                    </CardContent>
                    <CardFooter className="py-3 flex justify-between text-xs text-muted-foreground">
                      <div>{result.sources.length} sources</div>
                      <div>Confidence: {Math.round(result.confidenceScore * 100)}%</div>
                    </CardFooter>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}
        
        {resultsHistory.length === 0 && (
          <Card className="text-center p-8">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No History Yet</h2>
            <p className="text-muted-foreground mb-4">
              Start fact-checking claims to build your history.
            </p>
            <Button variant="default" onClick={() => window.location.href = '/'}>
              Check a Fact Now
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default History;
