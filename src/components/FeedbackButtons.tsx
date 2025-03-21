
import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface FeedbackButtonsProps {
  resultId: string;
  className?: string;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({ resultId, className }) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [showComment, setShowComment] = useState(false);
  const [comment, setComment] = useState('');
  
  const handleFeedback = (type: 'up' | 'down') => {
    if (feedback === type) {
      setFeedback(null);
      toast.info('Feedback removed');
    } else {
      setFeedback(type);
      toast.success(`Thanks for your ${type === 'up' ? 'positive' : 'negative'} feedback!`);
      
      // In a real app, you would send this to your backend
      console.log(`User gave ${type} feedback for result: ${resultId}`);
    }
  };
  
  const handleComment = () => {
    if (comment.trim()) {
      toast.success('Thank you for your feedback!');
      // In a real app, you would send this to your backend
      console.log(`User comment for result ${resultId}: ${comment}`);
      setComment('');
      setShowComment(false);
    } else {
      toast.error('Please enter a comment');
    }
  };
  
  return (
    <div className={cn("flex flex-col space-y-3", className)}>
      <div className="flex items-center gap-2">
        <p className="text-sm text-muted-foreground">Was this result helpful?</p>
        <div className="flex gap-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn("h-8 w-8", feedback === 'up' && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300")}
                  onClick={() => handleFeedback('up')}
                >
                  <ThumbsUp size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Helpful</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn("h-8 w-8", feedback === 'down' && "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300")}
                  onClick={() => handleFeedback('down')}
                >
                  <ThumbsDown size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Not helpful</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className={cn("h-8 w-8", showComment && "bg-primary/10")}
                  onClick={() => setShowComment(!showComment)}
                >
                  <MessageCircle size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Leave a comment</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      
      {showComment && (
        <div className="space-y-2">
          <textarea 
            className="w-full p-2 rounded-md border border-border bg-background text-sm"
            placeholder="Tell us what you think about this result..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <div className="flex justify-end">
            <Button 
              size="sm" 
              variant="default" 
              onClick={handleComment}
            >
              Submit
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackButtons;
