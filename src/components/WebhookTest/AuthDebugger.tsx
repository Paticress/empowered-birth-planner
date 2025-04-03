
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function AuthDebugger() {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [authUsers, setAuthUsers] = useState<any[]>([]);
  const [accessUsers, setAccessUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, signIn, signOut } = useAuth();

  const fetchAuthDebugInfo = async () => {
    setLoading(true);
    
    try {
      // Fetch users that have access to the Birth Plan Builder
      const { data: accessData, error: accessError } = await supabase
        .from('Users_DB_BirthPlanBuilder')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (accessError) throw accessError;
      setAccessUsers(accessData || []);
      
      toast.success('Fetched latest access records');
    } catch (error: any) {
      console.error('Error fetching debug info:', error);
      toast.error(`Error fetching debug data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    if (!userEmail || !userPassword) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      // First, create the user account in Supabase Auth
      const { data: userData, error: authError } = await supabase.auth.signUp({
        email: userEmail,
        password: userPassword
      });
      
      if (authError) throw authError;
      
      // Then add them to the birth plan users table
      const { error: dbError } = await supabase
        .from('Users_DB_BirthPlanBuilder')
        .insert({ email: userEmail });
        
      if (dbError) throw dbError;
      
      toast.success('Test user created and added to birth plan access');
      fetchAuthDebugInfo();
      
    } catch (error: any) {
      console.error('Error creating test user:', error);
      toast.error(`Error creating test user: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    if (!userEmail || !userPassword) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const { error } = await signIn(userEmail, userPassword);
      
      if (error) throw error;
      
      toast.success('Login successful');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testMagicLink = async () => {
    if (!userEmail) {
      toast.error('Please enter an email');
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: userEmail,
        options: {
          emailRedirectTo: window.location.origin + '/webhook-test'
        }
      });
      
      if (error) throw error;
      
      toast.success('Magic link sent successfully');
    } catch (error: any) {
      console.error('Magic link error:', error);
      toast.error(`Failed to send magic link: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const addUserToBirthPlan = async () => {
    if (!userEmail) {
      toast.error('Please enter an email');
      return;
    }
    
    setLoading(true);
    
    try {
      // Check if the email already exists in the birth plan access table
      const { data: existingUser } = await supabase
        .from('Users_DB_BirthPlanBuilder')
        .select('email')
        .eq('email', userEmail)
        .maybeSingle();
        
      if (existingUser) {
        toast.info('User already has birth plan access');
        return;
      }
      
      // Add the email to the birth plan access table
      const { error } = await supabase
        .from('Users_DB_BirthPlanBuilder')
        .insert({ email: userEmail });
        
      if (error) throw error;
      
      toast.success('User granted birth plan access');
      fetchAuthDebugInfo();
      
    } catch (error: any) {
      console.error('Error adding user to birth plan:', error);
      toast.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthDebugInfo();
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Authentication Debugger</CardTitle>
        <CardDescription>
          Test and debug authentication issues with the Birth Plan Builder
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Current Auth Status</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <p><strong>Logged in:</strong> {user ? 'Yes' : 'No'}</p>
              {user && (
                <>
                  <p><strong>User ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={signOut}
                    className="mt-2"
                  >
                    Sign Out
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Test Authentication</h3>
            <div className="space-y-2">
              <Input
                placeholder="Email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="default" 
                  onClick={testLogin}
                  disabled={loading}
                >
                  Test Login
                </Button>
                <Button 
                  variant="outline" 
                  onClick={createTestUser}
                  disabled={loading}
                >
                  Create Test User
                </Button>
                <Button 
                  variant="secondary"
                  onClick={addUserToBirthPlan}
                  disabled={loading}
                >
                  Add to Birth Plan
                </Button>
                <Button 
                  variant="default"
                  onClick={testMagicLink}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Test Magic Link
                </Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Birth Plan Access (Last 10)</h3>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={fetchAuthDebugInfo}
                disabled={loading}
              >
                Refresh
              </Button>
            </div>
            
            {accessUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No access records found</p>
            ) : (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {accessUsers.map((user, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 text-sm">{user.email}</td>
                        <td className="px-4 py-2 text-sm">{new Date(user.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 text-sm text-muted-foreground">
        <p>
          Note: Create a test user to both register in Supabase Auth and grant access to the Birth Plan Builder
        </p>
      </CardFooter>
    </Card>
  );
}
