
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FactCheckResult } from '@/context/FactCheckContext';
import { Twitter, Facebook, Linkedin, Mail, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

interface ShareFactDialogProps {
  result: FactCheckResult;
  trigger?: React.ReactNode;
}

export const ShareFactDialog: React.FC<ShareFactDialogProps> = ({ 
  result, 
  trigger = <Button size="sm" variant="outline">Share</Button>
}) => {
  const [copied, setCopied] = useState(false);
  
  const shareUrl = `${window.location.origin}/share?id=${result.id}`;
  const shareTitle = `Fact Check: "${result.query}"`;
  const shareText = `${result.status === 'true' ? 'TRUE' : 
                     result.status === 'false' ? 'FALSE' : 
                     result.status === 'neutral' ? 'NEUTRAL' : 'UNKNOWN'}: ${result.query}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = (platform: string) => {
    let shareLink = '';
    
    switch (platform) {
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
        break;
      case 'email':
        shareLink = `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(`${shareText}\n\nLearn more: ${shareUrl}`)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank');
  };
  
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this fact check</DialogTitle>
          <DialogDescription>
            Share the results with others via social media or directly with a link.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <div className="text-sm font-medium text-muted-foreground mb-2">Share on social media</div>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('twitter')}
                title="Share on Twitter"
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('facebook')}
                title="Share on Facebook"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('linkedin')}
                title="Share on LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => handleShare('email')}
                title="Share via Email"
              >
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <label className="text-sm font-medium text-muted-foreground">Or copy link</label>
            <div className="flex items-center">
              <Input
                readOnly
                className="flex-1"
                value={shareUrl}
              />
              <Button 
                type="submit" 
                size="sm" 
                className="ml-2" 
                onClick={handleCopyLink}
                variant="outline"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-center">
          <div className="text-xs text-muted-foreground text-center mt-2">
            Sharing this will create a public link to this fact check.
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
