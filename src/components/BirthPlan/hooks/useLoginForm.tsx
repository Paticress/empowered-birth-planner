
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigation } from '@/hooks/useNavigation';

export function useLoginForm() {
  const [loginCredentials, setLoginCredentials] = useState({
    email: '',
    password: '',
  });
  const [signupCredentials, setSignupCredentials] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const { navigateTo } = useNavigation();
  const { signIn, signUp, signInWithMagicLink } = useAuth();

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const email = loginCredentials.email.toLowerCase().trim();
    const { error } = await signIn(email, loginCredentials.password);
    
    if (error) {
      console.error('Login error:', error);
      toast.error('Falha no login: ' + error.message);
      setIsLoading(false);
      return;
    }
    
    toast.success('Login realizado com sucesso!');
    console.log("Login successful, checking user access...");
    
    try {
      // Check if user is in the allowed users table - using correct lowercase table name
      const { data: userData, error: userError } = await supabase
        .from('users_db_birthplanbuilder')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (userError) {
        console.error('Error checking user access:', userError);
        toast.error('Erro ao verificar acesso: ' + userError.message);
        setIsLoading(false);
        return;
      }
      
      // If user exists in the database, they have access
      if (userData) {
        console.log("User found in database, redirecting to birth plan builder");
        navigateTo('/criar-plano');
      } else {
        console.log("User not found in database, adding user");
        // Add the user to the database (they've paid) - using correct lowercase table name
        const { error: insertError } = await supabase
          .from('users_db_birthplanbuilder')
          .insert({ email });
          
        if (insertError) {
          console.error('Error adding user to database:', insertError);
          toast.error('Erro ao registrar acesso, por favor contate o suporte.');
          setIsLoading(false);
          return;
        }
        
        console.log("User added to database, redirecting to birth plan builder");
        navigateTo('/criar-plano');
      }
    } catch (error) {
      console.error('Error in login flow:', error);
      toast.error('Ocorreu um erro inesperado. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (signupCredentials.password !== signupCredentials.confirmPassword) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }
    
    if (signupCredentials.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      setIsLoading(false);
      return;
    }

    const email = signupCredentials.email.toLowerCase().trim();
    const { error } = await signUp(email, signupCredentials.password);
    
    if (error) {
      console.error('Signup error:', error);
      toast.error('Falha no cadastro: ' + error.message);
    } else {
      toast.success('Cadastro realizado com sucesso!');
      toast.info('Por favor, verifique seu email para confirmar o cadastro');
      
      // After signup, wait a moment and switch to the login tab
      setTimeout(() => {
        const loginTab = document.getElementById('login-tab') as HTMLButtonElement;
        if (loginTab) loginTab.click();
        
        // Pre-fill the login email field
        setLoginCredentials(prev => ({
          ...prev,
          email: email
        }));
      }, 1500);
    }
    
    setIsLoading(false);
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const email = magicLinkEmail.toLowerCase().trim();
    if (!email) {
      toast.error('Por favor, insira seu email');
      setIsLoading(false);
      return;
    }
    
    try {
      // First add to users DB regardless, we'll auto-approve all magic link users
      const { error: addUserError } = await supabase
        .from('users_db_birthplanbuilder')
        .upsert({ email }, { onConflict: 'email' });
        
      if (addUserError) {
        console.error('Error adding user to database:', addUserError);
        // Continue anyway, don't block the magic link
      }
      
      // Get the current site URL for proper redirects across environments
      const getCurrentSiteUrl = () => {
        const protocol = window.location.protocol;
        const host = window.location.host;
        return `${protocol}//${host}`;
      };
      
      const siteUrl = getCurrentSiteUrl();
      console.log("Magic link will be created with site URL:", siteUrl);

      // Send the magic link to the complete site URL + acesso-plano path
      const { error } = await signInWithMagicLink(email, '/acesso-plano');
      
      if (error) {
        console.error('Magic link error:', error);
        toast.error('Falha ao enviar o link mágico: ' + error.message);
      } else {
        setIsMagicLinkSent(true);
        toast.success('Link de acesso enviado com sucesso!');
        toast.info('Por favor, verifique seu email para acessar sua conta');
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      toast.error('Ocorreu um erro ao enviar o link de acesso');
    }
    
    setIsLoading(false);
  };

  return {
    loginCredentials,
    signupCredentials,
    magicLinkEmail,
    isLoading,
    isMagicLinkSent,
    setMagicLinkEmail,
    setIsMagicLinkSent,
    handleLoginChange,
    handleSignupChange,
    handleLogin,
    handleSignup,
    handleMagicLinkSubmit
  };
}
