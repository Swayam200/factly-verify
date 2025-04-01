
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User, Camera, History, LogOut } from 'lucide-react';
import MovingBackground from '@/components/MovingBackground';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { useFactCheck } from '@/context/FactCheckContext';
import { useIsMobile } from '@/hooks/use-mobile';

const Profile: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth();
  const { resultsHistory } = useFactCheck();
  const [username, setUsername] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('account');
  const [avatarUrl, setAvatarUrl] = useState('');
  const isMobile = useIsMobile();
  
  // Initialize with current data
  useEffect(() => {
    if (user?.user_metadata?.username) {
      setUsername(user.user_metadata.username);
    }
    if (user?.user_metadata?.avatar_url) {
      setAvatarUrl(user.user_metadata.avatar_url);
    }
  }, [user]);
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username is required");
      return;
    }
    
    try {
      setIsUpdating(true);
      await updateProfile(username, avatarUrl);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out");
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For now, create a local URL for the avatar
      const objectUrl = URL.createObjectURL(file);
      setAvatarUrl(objectUrl);
    }
  };
  
  // Calculate user stats
  const totalChecks = resultsHistory.length;
  const trueChecks = resultsHistory.filter(check => check.status === 'true').length;
  const falseChecks = resultsHistory.filter(check => check.status === 'false').length;
  
  // Get display name
  const displayName = user.user_metadata?.username || user.email?.split('@')[0] || 'User';
  
  return (
    <div className="container relative flex flex-col items-center justify-center min-h-screen px-4 mx-auto">
      <MovingBackground />
      
      <div className="w-full max-w-4xl space-y-6 z-10 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">My Profile</h1>
          {!isMobile && (
            <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          )}
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Account</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              <span>Activity</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border-2 border-primary">
                      {avatarUrl ? (
                        <AvatarImage src={avatarUrl} alt={displayName} />
                      ) : (
                        <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                          {displayName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <label 
                      htmlFor="avatar-upload" 
                      className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors">
                      <Camera className="h-4 w-4" />
                      <input 
                        id="avatar-upload" 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                  
                  <div className="space-y-1 text-center sm:text-left">
                    <CardTitle className="text-xl">{displayName}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                    <p className="text-sm text-muted-foreground">
                      Joined {new Date(user.created_at || Date.now()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit" disabled={isUpdating} className="w-full">
                    {isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </form>
              </CardContent>
              
              {isMobile && (
                <CardFooter>
                  <Button variant="outline" onClick={handleSignOut} className="w-full">
                    Sign Out
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
                <CardDescription>View your recent fact checks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-card border rounded-lg p-4 text-center">
                    <h3 className="text-lg font-medium text-muted-foreground">Total Checks</h3>
                    <p className="text-3xl font-bold">{totalChecks}</p>
                  </div>
                  <div className="bg-card border rounded-lg p-4 text-center">
                    <h3 className="text-lg font-medium text-green-500">True Claims</h3>
                    <p className="text-3xl font-bold text-green-500">{trueChecks}</p>
                  </div>
                  <div className="bg-card border rounded-lg p-4 text-center">
                    <h3 className="text-lg font-medium text-red-500">False Claims</h3>
                    <p className="text-3xl font-bold text-red-500">{falseChecks}</p>
                  </div>
                </div>
                
                {resultsHistory.length > 0 ? (
                  <div className="space-y-4">
                    {resultsHistory.slice(0, 5).map((result) => (
                      <div key={result.id} className="border rounded-md p-4 flex items-center justify-between">
                        <div className="truncate flex-1">
                          <p className="font-medium truncate">"{result.query}"</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(result.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No fact checks yet</p>
                    <Button variant="outline" className="mt-4" asChild>
                      <a href="/">Check a fact now</a>
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <a href="/history">
                    <History className="mr-2 h-4 w-4" />
                    View Full History
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
