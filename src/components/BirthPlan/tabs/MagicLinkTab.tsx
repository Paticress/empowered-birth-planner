
import { MagicLinkForm } from '../forms/MagicLinkForm';
import { useState } from 'react';
import { useNavigation } from '@/hooks/useNavigation';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export function MagicLinkTab() {
  const [magicLinkEmail, setMagicLinkEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkSent, setIsMagicLinkSent] = useState(false);
  const { navigateTo } = useNavigation();

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!magicLinkEmail || !magicLinkEmail.includes('@')) {
      toast.error('Por favor, insira um email válido');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const email = magicLinkEmail.toLowerCase().trim();
      console.log("Sending magic link to:", email);
      
      // Get the current URL and create a redirect URL for the magic link
      const origin = window.location.origin;
      const redirectTo = `${origin}/acesso-plano`;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        }
      });
      
      if (error) {
        console.error('Magic link error:', error);
        toast.error('Erro ao enviar o link de acesso: ' + error.message);
        setIsLoading(false);
        return;
      }
      
      // Store the email in localStorage for later recovery if needed
      localStorage.setItem('birthPlanEmailPending', email);
      
      toast.success('Link de acesso enviado!');
      setIsMagicLinkSent(true);
      
      // Check if this is from the guide access flow
      const searchParams = new URLSearchParams(window.location.search);
      const isFromGuide = searchParams.get('from') === 'guide';
      
      // Check for user existence in the database and add if not present
      try {
        const { data: userData, error: userError } = await supabase
          .from('users_db_birthplanbuilder')
          .select('email, plan')
          .eq('email', email)
          .maybeSingle();
        
        if (userError) {
          console.error('Error checking user in database:', userError);
        } else if (!userData) {
          console.log("User not found in database, adding user as LEAD");
          
          // If the user doesn't exist, add them with guide access only (LEAD user)
          const { error: insertError } = await supabase
            .from('users_db_birthplanbuilder')
            .insert({ 
              email,
              plan: 'free' // By default, new users are LEADs with guide access only
            });
            
          if (insertError) {
            console.error('Error adding user to database:', insertError);
          } else {
            console.log("User added to database as LEAD");
            // Store the user plan in localStorage
            localStorage.setItem('user_plan', 'free');
          }
        } else {
          console.log("User already exists in database with plan:", userData.plan);
          // Store the user plan in localStorage
          localStorage.setItem('user_plan', userData.plan);
        }
      } catch (dbError) {
        console.error('Database operation error:', dbError);
      }
      
    } catch (error) {
      console.error('Exception in magic link flow:', error);
      toast.error('Ocorreu um erro inesperado. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MagicLinkForm 
      magicLinkEmail={magicLinkEmail}
      setMagicLinkEmail={setMagicLinkEmail}
      isLoading={isLoading}
      isMagicLinkSent={isMagicLinkSent}
      setIsMagicLinkSent={setIsMagicLinkSent}
      handleMagicLinkSubmit={handleMagicLinkSubmit}
      loadingText="Enviando link de acesso..."
    />
  );
}
