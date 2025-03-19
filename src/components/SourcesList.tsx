
import React from 'react';
import { Source } from '@/context/FactCheckContext';
import { Link2, ExternalLink, ThumbsUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SourcesListProps {
  sources: Source[];
  className?: string;
}

const SourcesList: React.FC<SourcesListProps> = ({ sources, className }) => {
  if (!sources || sources.length === 0) {
    return (
      <div className={cn("p-4 text-center text-muted-foreground italic", className)}>
        No sources available for this claim.
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Link2 size={18} />
        Sources & References
      </h3>
      
      <ul className="space-y-3">
        {sources.map((source, index) => (
          <li 
            key={index} 
            className="bg-secondary/50 dark:bg-secondary/30 backdrop-blur-xs rounded-lg p-4 hover-lift"
          >
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-foreground line-clamp-1 flex-1">
                {source.title || 'Unnamed Source'}
              </h4>
              
              {source.reliability !== undefined && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full text-xs">
                  <ThumbsUp size={12} />
                  <span>{Math.round(source.reliability * 100)}%</span>
                </div>
              )}
            </div>
            
            {source.snippet && (
              <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
                {source.snippet}
              </p>
            )}
            
            <a 
              href={source.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="mt-2 text-sm text-primary hover:underline flex items-center gap-1 w-fit"
            >
              Visit source
              <ExternalLink size={14} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourcesList;
