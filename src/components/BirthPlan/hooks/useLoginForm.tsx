
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
  const { signIn, signUp } = useAuth();

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
    } else {
      toast.success('Login realizado com sucesso!');
      
      // Check if user is in the allowed users table - using correct lowercase table name
      const { data: userData, error: userError } = await supabase
        .from('users_db_birthplanbuilder')
        .select('email')
        .eq('email', email)
        .maybeSingle();
      
      if (userError) {
        console.error('Error checking user access:', userError);
      }
      
      // If user exists in the database, they have access
      if (userData) {
        navigateTo('/criar-plano');
      } else {
        // Add the user to the database (they've paid) - using correct lowercase table name
        const { error: insertError } = await supabase
          .from('users_db_birthplanbuilder')
          .insert({ email });
          
        if (insertError) {
          console.error('Error adding user to database:', insertError);
          toast.error('Erro ao registrar acesso, por favor contate o suporte.');
        } else {
          navigateTo('/criar-plano');
        }
      }
    }
    
    setIsLoading(false);
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
      // First check if this email has purchased access - using correct lowercase table name
      const { data: userData, error: userError } = await supabase
        .from('users_db_birthplanbuilder')
        .select('email')
        .eq('email', email)
        .maybeSingle();
        
      if (!userData && !userError) {
        toast.error('Este email não foi encontrado em nossos registros de compra. Por favor, verifique o email ou adquira o plano em nosso site.');
        setIsLoading(false);
        return;
      }
      
      // Send the magic link
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: window.location.origin + '/criar-plano'
        }
      });
      
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
