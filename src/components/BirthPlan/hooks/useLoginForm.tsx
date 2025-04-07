
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
  const [isLoading, setIsLoading] = useState(false);
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

    try {
      const email = loginCredentials.email.toLowerCase().trim();
      console.log("Attempting login with email:", email);
      
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
        
        if (userData) {
          console.log("User found in database, redirecting to birth plan builder");
          navigateTo('/criar-plano');
        } else {
          console.log("User not found in database, adding user");
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
      }
    } catch (error) {
      console.error('Exception in login flow:', error);
      toast.error('Ocorreu um erro inesperado. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
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
      console.log("Attempting signup with email:", email);
      
      const { error } = await signUp(email, signupCredentials.password);
      
      if (error) {
        console.error('Signup error:', error);
        toast.error('Falha no cadastro: ' + error.message);
      } else {
        toast.success('Cadastro realizado com sucesso!');
        toast.info('Por favor, verifique seu email para confirmar o cadastro');
        
        setTimeout(() => {
          const loginTab = document.getElementById('login-tab') as HTMLButtonElement;
          if (loginTab) loginTab.click();
          
          setLoginCredentials(prev => ({
            ...prev,
            email: email
          }));
        }, 1500);
      }
    } catch (error) {
      console.error('Exception in signup flow:', error);
      toast.error('Ocorreu um erro inesperado. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    loginCredentials,
    signupCredentials,
    isLoading,
    handleLoginChange,
    handleSignupChange,
    handleLogin,
    handleSignup
  };
}
