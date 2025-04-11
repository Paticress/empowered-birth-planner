
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to handle navigation within the application
 * Controls access rules and redirects based on user authentication status
 */
export const useNavigation = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  /**
   * Verifica se o usuário tem permissão para acessar o guia online
   * Os leads e clientes têm acesso ao guia online
   */
  const checkGuideAccess = async (email: string | undefined) => {
    if (!email) return false;
    
    try {
      const { data, error } = await supabase
        .from('users_db_birthplanbuilder')
        .select('email')
        .eq('email', email)
        .maybeSingle();
        
      // Se o usuário estiver autenticado, ele tem acesso ao guia
      return !error && !!data;
    } catch (error) {
      console.error("Erro ao verificar acesso ao guia:", error);
      return false;
    }
  };
  
  /**
   * Navega para um caminho específico, aplicando regras de redirecionamento
   * baseado no tipo de usuário (Visitante, Lead ou Cliente)
   */
  const navigateTo = async (path: string) => {
    console.log("Navigation requested to:", path);
    
    // Special handling for URLs with auth data (access_token)
    if (path.includes('access_token=')) {
      console.log("Detected auth data in navigation target - special handling");
      
      // For URLs with auth tokens, use direct location change
      // This ensures that Supabase can correctly process the tokens
      const basePath = '/acesso-plano';
      
      // Extract token part for hash fragment
      const tokenIndex = path.indexOf('access_token=');
      const tokenPart = path.substring(tokenIndex);
      
      // Use direct location change for more reliable auth handling
      window.location.href = basePath + '#' + tokenPart;
      return;
    }
    
    // Rotas públicas que todos os usuários podem acessar
    const publicRoutes = ['/', '/faq', '/login', '/auth/callback', '/acesso-plano'];
    
    // Se estiver navegando para uma rota pública, permite a navegação direta
    if (publicRoutes.includes(path)) {
      console.log("Navigating to public route:", path);
      
      // Use replace instead of push for auth-related redirects to avoid history issues
      if (path === '/acesso-plano') {
        navigate(path, { replace: true });
      } else {
        // For all other routes, use normal navigation
        // This preserves the route in the browser history
        navigate(path);
      }
      return;
    }
    
    // === FLUXO PARA VISITANTES (não autenticados) ===
    if (!isAuthenticated) {
      console.log("User not authenticated, applying visitor navigation rules");
      
      // Regras para Visitantes
      if (path === '/guia-online') {
        // Redireciona para a página de captura do Lead no Wix
        console.log("Redirecting visitor to Wix lead capture page for Guide");
        window.location.href = "https://www.energiamaterna.com.br/seu-guia-gratuito-do-plano-de-parto";
        return;
      } 
      
      if (path === '/criar-plano' || path.includes('/criar-plano')) {
        // Redireciona para a landing page de conversão no Wix
        console.log("Redirecting visitor to Wix conversion page for Birth Plan");
        window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos";
        return;
      }
      
      if (path === '/dashboard') {
        // Visitantes não podem acessar o dashboard, direcionando para login
        console.log("Redirecting visitor to login page (attempted dashboard access)");
        // Adiciona parâmetro indicando redirecionamento do dashboard
        navigate('/acesso-plano?from=dashboard');
        return;
      }
      
      // Para outras rotas protegidas, redireciona para login com indicação da origem
      console.log("Redirecting visitor to login page");
      if (path === '/guia-online') {
        navigate('/acesso-plano?from=guide');
      } else {
        navigate('/acesso-plano');
      }
      return;
    }
    
    // === FLUXO PARA USUÁRIOS AUTENTICADOS (Lead ou Cliente) ===
    // Verificamos o acesso do usuário para determinar se é Lead ou Cliente
    const userEmail = user?.email || localStorage.getItem('birthPlanEmail');
    const hasAccess = await checkGuideAccess(userEmail);
    
    if (path === '/criar-plano' && !hasAccess) {
      // Usuário é um Lead (tem acesso apenas ao guia)
      console.log("User is a Lead, redirecting to Wix conversion page");
      window.location.href = "https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos";
      return;
    }
    
    // Redireciona LEADs diretamente para o dashboard após login bem-sucedido
    if (path === '/guia-online' && isAuthenticated && !localStorage.getItem('dashboard-visited')) {
      console.log("First login for LEAD, redirecting to dashboard");
      localStorage.setItem('dashboard-visited', 'true');
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // Para Clientes ou navegação normal, usa o navegador padrão
    console.log("Standard navigation to:", path);
    
    // Use replace instead of push for auth-related redirects to avoid history issues
    if (path === '/acesso-plano' || path === '/criar-plano') {
      navigate(path, { replace: true });
    } else {
      // For all other routes, use normal navigation
      // This preserves the route in the browser history
      navigate(path);
    }
  };
  
  return { navigateTo };
};
