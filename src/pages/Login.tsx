
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

export function Login() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const navigate = useNavigate();

  useEffect(() => {
    // Process authentication as soon as the page loads
    const processAuth = async () => {
      // Get full URL for debugging
      const fullUrl = window.location.href;
      const hash = window.location.hash;
      const search = window.location.search;
      const path = window.location.pathname;
      const hostname = window.location.hostname;
      
      // Debug logging
      console.log("Login page loaded with URL info:", {
        fullUrl,
        hash: hash ? hash.substring(0, 50) + '...' : 'none',
        search: search ? search.substring(0, 50) + '...' : 'none',
        path,
        hostname
      });
      
      // Save debug info for display
      setDebugInfo({
        fullUrl,
        hash: hash ? hash.substring(0, 50) + '...' : 'none',
        search: search ? search.substring(0, 50) + '...' : 'none',
        path,
        hostname,
        timestamp: new Date().toISOString()
      });
      
      // Enhanced detection of auth tokens in different parts of the URL
      const hasAuthInPath = fullUrl.includes('/auth/callback#access_token=') || 
                           fullUrl.includes('/auth/callback?') || 
                           fullUrl.includes('/auth/callback/access_token=');
      
      const hasAuthInHash = window.location.hash && window.location.hash.includes('access_token=');
      const hasAuthInSearch = window.location.search && 
                             (window.location.search.includes('access_token=') || 
                              window.location.search.includes('code='));
      
      // Debug token location
      console.log("Auth token detection:", {
        hasAuthInPath,
        hasAuthInHash,
        hasAuthInSearch
      });
      
      // If there are no auth parameters, redirect to access page after a delay
      if (!hasAuthInHash && !hasAuthInSearch && !hasAuthInPath) {
        console.log("No auth tokens found in URL, redirecting to acesso-plano after delay");
        
        // Don't redirect immediately so we can see the debug info
        setTimeout(() => {
          navigate('/acesso-plano', { replace: true });
        }, 5000); // 5 second delay to allow viewing debug info
        
        return;
      }
      
      // Process authentication
      setIsProcessing(true);
      toast.loading("Processando autenticação...");
      
      try {
        console.log("Processing authentication from URL");
        
        // Fix path-based tokens by converting them to hash format
        if (hasAuthInPath && !hasAuthInHash) {
          console.log("Auth token detected in path, converting to hash format");
          
          // Extract token from path
          let tokenPart = '';
          if (fullUrl.includes('/auth/callback/access_token=')) {
            const tokenIndex = fullUrl.indexOf('/auth/callback/access_token=');
            tokenPart = fullUrl.substring(tokenIndex + '/auth/callback/'.length);
          } else if (fullUrl.includes('access_token=')) {
            const tokenIndex = fullUrl.indexOf('access_token=');
            tokenPart = fullUrl.substring(tokenIndex);
          }
          
          if (tokenPart) {
            console.log("Extracted token part:", tokenPart.substring(0, 20) + '...');
            setDebugInfo(prev => ({
              ...prev,
              extractedToken: tokenPart.substring(0, 20) + '...',
              tokenFixAttempted: true
            }));
            
            // Create a new URL with the token in hash format
            const baseUrl = window.location.origin + '/login';
            const fixedUrl = baseUrl + '#' + tokenPart;
            
            console.log("Redirecting to:", fixedUrl.substring(0, baseUrl.length + 20) + '...');
            window.location.href = fixedUrl;
            return;
          }
        }
        
        // Try multiple methods to handle the authentication
        // Method 1: Exchange the code/token for a session
        console.log("Method 1: Using exchangeCodeForSession with fullUrl");
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(fullUrl);
          
          if (error) {
            console.error("Error with Method 1:", error);
            setDebugInfo(prev => ({
              ...prev,
              method1Error: error.message,
              method1ErrorCode: error.status
            }));
          } else if (data?.session) {
            console.log("Method 1 successful, session established");
            handleSuccessfulAuth(data.session);
            return;
          }
        } catch (err1) {
          console.error("Exception with Method 1:", err1);
          setDebugInfo(prev => ({
            ...prev,
            method1Exception: err1 instanceof Error ? err1.message : String(err1)
          }));
        }
        
        // Method 2: If hash contains tokens, try setSession directly
        if (hasAuthInHash) {
          console.log("Method 2: Using hash parameters directly");
          try {
            // Parse hash params
            const hashParams = new URLSearchParams(hash.substring(1));
            const accessToken = hashParams.get('access_token');
            const refreshToken = hashParams.get('refresh_token');
            
            if (accessToken && refreshToken) {
              console.log("Found tokens in hash, trying setSession");
              const { error: setSessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (setSessionError) {
                console.error("Error with Method 2:", setSessionError);
                setDebugInfo(prev => ({
                  ...prev,
                  method2Error: setSessionError.message,
                  method2ErrorCode: setSessionError.status
                }));
              } else {
                // Check if we got a valid session
                const { data: sessionData } = await supabase.auth.getSession();
                if (sessionData.session) {
                  console.log("Method 2 successful, session established");
                  handleSuccessfulAuth(sessionData.session);
                  return;
                }
              }
            }
          } catch (err2) {
            console.error("Exception with Method 2:", err2);
            setDebugInfo(prev => ({
              ...prev,
              method2Exception: err2 instanceof Error ? err2.message : String(err2)
            }));
          }
        }
        
        // Method 3: As a last resort, try getSession to see if auth was already processed
        console.log("Method 3: Checking if session already exists");
        try {
          const { data: sessionCheck } = await supabase.auth.getSession();
          if (sessionCheck.session) {
            console.log("Method 3 successful, session already exists");
            handleSuccessfulAuth(sessionCheck.session);
            return;
          }
        } catch (err3) {
          console.error("Exception with Method 3:", err3);
          setDebugInfo(prev => ({
            ...prev,
            method3Exception: err3 instanceof Error ? err3.message : String(err3)
          }));
        }
        
        // If we reached here, all methods failed
        console.error("All authentication methods failed");
        setError("Falha ao processar autenticação após tentar múltiplos métodos.");
        setIsProcessing(false);
        toast.error("Erro no processamento de autenticação");
      } catch (err) {
        console.error("Unexpected error processing authentication:", err);
        setError(err instanceof Error ? err.message : "Erro inesperado");
        setDebugInfo(prev => ({
          ...prev,
          finalError: err instanceof Error ? err.message : String(err)
        }));
        toast.error("Erro durante processamento da autenticação");
        setIsProcessing(false);
      }
    };
    
    processAuth();
  }, [navigate]);

  // Helper function for successful authentication
  const handleSuccessfulAuth = (session: any) => {
    console.log("Authentication successful, user logged in:", session.user.email);
    
    // Store authentication data
    localStorage.setItem('birthPlanLoggedIn', 'true');
    localStorage.setItem('birthPlanEmail', session.user.email || '');
    
    // Ensure user is in database
    supabase
      .from('users_db_birthplanbuilder')
      .upsert({ 
        email: session.user.email 
      }, { 
        onConflict: 'email' 
      })
      .then(({ error: dbError }) => {
        if (dbError) {
          console.error("Error adding user to database:", dbError);
        }
        
        toast.success("Login realizado com sucesso!");
        
        // Redirect to criar-plano page
        setTimeout(() => {
          navigate('/criar-plano', { replace: true });
        }, 1000);
      });
  };

  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 pb-6">
            {isProcessing ? (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-maternal-600 mb-4" />
                <h2 className="text-xl font-semibold text-maternal-800 mb-2">
                  Processando autenticação...
                </h2>
                <p className="text-maternal-600">
                  Por favor, aguarde enquanto validamos seu acesso.
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                  <h3 className="font-medium">Erro na autenticação</h3>
                  <p className="mt-1">{error}</p>
                </div>
                <p className="mb-4">
                  O link de acesso pode ter expirado ou ser inválido.
                </p>
                <button 
                  onClick={() => navigate('/acesso-plano')}
                  className="bg-maternal-600 hover:bg-maternal-700 text-white py-2 px-4 rounded"
                >
                  Voltar para página de acesso
                </button>
                
                {/* Debug Information Section */}
                <div className="mt-8 text-left">
                  <details className="bg-gray-100 p-3 rounded-md">
                    <summary className="cursor-pointer text-sm font-semibold flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Informações de depuração para suporte
                    </summary>
                    <div className="mt-2 text-xs overflow-x-auto">
                      <pre className="bg-gray-200 p-2 rounded">
                        {JSON.stringify(debugInfo, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Loader2 className="h-12 w-12 mx-auto animate-spin text-maternal-600 mb-4" />
                <p>Redirecionando...</p>
                
                {/* Debug Information Section */}
                <div className="mt-8 text-left">
                  <details className="bg-gray-100 p-3 rounded-md">
                    <summary className="cursor-pointer text-sm font-semibold flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Informações de depuração para suporte
                    </summary>
                    <div className="mt-2 text-xs overflow-x-auto">
                      <pre className="bg-gray-200 p-2 rounded">
                        {JSON.stringify(debugInfo, null, 2)}
                      </pre>
                    </div>
                  </details>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
