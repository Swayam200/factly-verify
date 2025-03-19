
import React, { useState } from 'react';
import NavBar from '@/components/NavBar';
import { useFactCheck } from '@/context/FactCheckContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Search, Trash2, History as HistoryIcon } from 'lucide-react';
import VerificationBadge from '@/components/VerificationBadge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const History = () => {
  const { resultsHistory, clearHistory } = useFactCheck();
  const [searchTerm, setSearchTerm] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // Filter history based on search term
  const filteredHistory = resultsHistory.filter(result => 
    result.query.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Group history items by date
  const groupedHistory = filteredHistory.reduce<Record<string, typeof filteredHistory>>((groups, item) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});
  
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Fact Check History</h1>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search history..."
                className="pl-9 h-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {resultsHistory.length > 0 && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setIsConfirmDialogOpen(true)}
              >
                <Trash2 size={16} className="mr-1" />
                Clear
              </Button>
            )}
          </div>
        </header>
        
        {Object.keys(groupedHistory).length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="flex justify-center">
              <div className="p-4 bg-muted rounded-full">
                <HistoryIcon className="h-10 w-10 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-xl font-semibold">No history yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Your fact-checking history will appear here once you've verified some claims.
            </p>
            <Link to="/" className="inline-block mt-4">
              <Button>Start fact-checking</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date} className="space-y-3">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <h2 className="text-sm font-medium text-muted-foreground">{date}</h2>
                </div>
                
                <div className="space-y-3">
                  {items.map((result) => (
                    <Link 
                      to={`/?id=${result.id}`} 
                      key={result.id}
                      className="block"
                    >
                      <div className={cn(
                        "border rounded-lg p-4 transition-all hover:shadow-md hover:-translate-y-0.5",
                        "bg-card/50 backdrop-blur-sm"
                      )}>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                          <div className="space-y-1 flex-1">
                            <h3 className="font-medium line-clamp-1">{result.query}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {result.explanation}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                              {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Badge>
                            
                            <VerificationBadge 
                              status={result.status} 
                              confidenceScore={result.confidenceScore}
                              size="sm"
                              showLabel={false}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear History</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to clear your entire fact-checking history? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                clearHistory();
                setIsConfirmDialogOpen(false);
              }}
            >
              Clear History
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;
