
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User } from 'lucide-react';
import MovingBackground from '@/components/MovingBackground';

const Profile: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth();
  const [username, setUsername] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Initialize the username field with current username
  useEffect(() => {
    if (user?.user_metadata?.username) {
      setUsername(user.user_metadata.username);
    }
  }, [user]);
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    
    try {
      setIsUpdating(true);
      await updateProfile(username);
      // Username is now updated in the user object
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  // Get the current username from metadata if available
  const currentUsername = user.user_metadata?.username || 'Not set';
  
  return (
    <div className="container relative flex flex-col items-center justify-center min-h-screen px-4 mx-auto">
      <MovingBackground />
      
      <div className="w-full max-w-md space-y-6 z-10">
        <h1 className="text-4xl font-bold text-center">My Profile</h1>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Manage your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Email</Label>
              <div className="p-2 border rounded-md bg-muted">
                {user.email}
              </div>
            </div>
            
            <div className="space-y-1">
              <Label>Current Username</Label>
              <div className="p-2 border rounded-md bg-muted">
                {currentUsername}
              </div>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="username">Update Username</Label>
                <Input
                  id="username"
                  placeholder="Enter new username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              
              <Button type="submit" disabled={isUpdating || !username.trim()}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Username"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleSignOut} className="w-full">
              Sign Out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
