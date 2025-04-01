
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFactCheck } from '@/context/FactCheckContext';
import { Loader2, Search, Users, BarChart3, Settings } from 'lucide-react';

const Admin: React.FC = () => {
  const { user } = useAuth();
  const { resultsHistory } = useFactCheck();
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  
  // Simulated admin data - in a real app, this would come from the backend
  useEffect(() => {
    const mockUsers = [
      { id: '1', email: 'user1@example.com', username: 'user1', factChecks: 15, lastActive: '2023-08-14T12:35:22Z' },
      { id: '2', email: 'user2@example.com', username: 'user2', factChecks: 8, lastActive: '2023-08-13T09:12:45Z' },
      { id: '3', email: 'user3@example.com', username: 'user3', factChecks: 23, lastActive: '2023-08-14T16:47:30Z' },
      { id: '4', email: 'admin@factcheck.com', username: 'admin', factChecks: 42, lastActive: '2023-08-14T18:22:10Z' },
    ];
    
    setTimeout(() => {
      setUsers(mockUsers);
      setIsLoading(false);
    }, 500);
  }, []);
  
  // Redirect if not admin
  if (!user || user.email !== 'admin@factcheck.com') {
    return <Navigate to="/" />;
  }
  
  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate system stats
  const totalChecks = resultsHistory.length;
  const trueChecks = resultsHistory.filter(check => check.status === 'true').length;
  const falseChecks = resultsHistory.filter(check => check.status === 'false').length;
  
  return (
    <div className="container py-8 mx-auto">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Users</CardTitle>
                <CardDescription>Active accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Fact Checks</CardTitle>
                <CardDescription>Total checks performed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalChecks}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">True Claims</CardTitle>
                <CardDescription>Verified as true</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{trueChecks}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">False Claims</CardTitle>
                <CardDescription>Verified as false</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-500">{falseChecks}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
              <CardDescription>Fact check distribution and usage statistics</CardDescription>
            </CardHeader>
            <CardContent>
              {resultsHistory.length > 0 ? (
                <div className="h-80">
                  <div className="h-full flex items-center justify-center border border-dashed rounded-md">
                    <p className="text-muted-foreground">Analytics visualization will be displayed here</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No fact checks data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input 
                    placeholder="Search users..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="border rounded-md">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="text-left p-3 font-medium">Username</th>
                          <th className="text-left p-3 font-medium">Email</th>
                          <th className="text-right p-3 font-medium">Fact Checks</th>
                          <th className="text-left p-3 font-medium">Last Active</th>
                          <th className="text-right p-3 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.length > 0 ? (
                          filteredUsers.map((user) => (
                            <tr key={user.id} className="border-t">
                              <td className="p-3 font-medium">{user.username}</td>
                              <td className="p-3">{user.email}</td>
                              <td className="p-3 text-right">{user.factChecks}</td>
                              <td className="p-3">
                                {new Date(user.lastActive).toLocaleString()}
                              </td>
                              <td className="p-3 text-right">
                                <Button variant="outline" size="sm">View Details</Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="text-center py-4 text-muted-foreground">
                              No users found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system settings and API connections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">API Rate Limiting</label>
                <p className="text-sm text-muted-foreground">
                  Configure the rate limits for API requests to prevent abuse.
                </p>
              </div>
              
              <div className="space-y-1">
                <label className="text-sm font-medium">Moderation Settings</label>
                <p className="text-sm text-muted-foreground">
                  Configure content moderation settings for user-submitted content.
                </p>
              </div>
              
              <Button variant="outline" size="sm" className="mt-4">
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
