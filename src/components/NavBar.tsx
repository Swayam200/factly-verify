
import React from 'react';
import { useFactCheck } from '@/context/FactCheckContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { Settings, History, Github, Info, Scale, User, LogIn, LogOut, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  const { setIsModalOpen, isDarkMode, toggleDarkMode } = useFactCheck();
  const { user, signOut } = useAuth();
  const location = useLocation();
  
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get username from user metadata or fallback to email before @ symbol
  const displayName = user ? 
    (user.user_metadata?.username || user.email?.split('@')[0]) : 
    'Account';
  
  // Get avatar URL from metadata
  const avatarUrl = user?.user_metadata?.avatar_url;
  
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
        {location.pathname !== '/history' && (
          <Link to="/history">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <History size={18} />
              <span className="hidden sm:inline">History</span>
            </Button>
          </Link>
        )}
        
        {location.pathname !== '/about' && (
          <Link to="/about">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Info size={18} />
              <span className="hidden sm:inline">About</span>
            </Button>
          </Link>
        )}
        
        {location.pathname !== '/legal' && (
          <Link to="/legal">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <Scale size={18} />
              <span className="hidden sm:inline">Legal</span>
            </Button>
          </Link>
        )}
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1.5" 
          onClick={handleSettingsClick}
        >
          <Settings size={18} />
          <span className="hidden sm:inline">Settings</span>
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleDarkMode}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Avatar className="h-6 w-6">
                  {avatarUrl ? (
                    <AvatarImage src={avatarUrl} alt={displayName} />
                  ) : (
                    <AvatarFallback className="text-xs">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="hidden sm:inline">{displayName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer">My Profile</Link>
              </DropdownMenuItem>
              {user.email === "admin@factcheck.com" && (
                <DropdownMenuItem asChild>
                  <Link to="/admin" className="cursor-pointer">Admin Dashboard</Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link to="/auth">
            <Button variant="outline" size="sm" className="gap-1.5">
              <LogIn size={16} />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </Link>
        )}
        
        <a 
          href="https://github.com/Swayam200" 
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
