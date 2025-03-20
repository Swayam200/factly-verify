
import React from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Settings, History, Github, Info, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const { setIsModalOpen } = useFactCheck();
  
  return (
    <nav className={cn(
      "w-full px-4 h-16 flex items-center justify-between border-b border-border backdrop-blur-sm bg-background/70 sticky top-0 z-50",
      className
    )}>
      <div className="flex items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-md h-9 w-9 bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">FC</span>
          </div>
          <span className="font-semibold text-xl hidden sm:inline-block">
            Fact Check
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <Link to="/history">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <History size={18} />
            <span className="hidden sm:inline">History</span>
          </Button>
        </Link>
        
        <Link to="/about">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Info size={18} />
            <span className="hidden sm:inline">About</span>
          </Button>
        </Link>
        
        <Link to="/legal">
          <Button variant="ghost" size="sm" className="gap-1.5">
            <Scale size={18} />
            <span className="hidden sm:inline">Legal</span>
          </Button>
        </Link>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1.5" 
          onClick={() => setIsModalOpen(true)}
        >
          <Settings size={18} />
          <span className="hidden sm:inline">Settings</span>
        </Button>
        
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:block"
        >
          <Button variant="ghost" size="icon">
            <Github size={18} />
          </Button>
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
