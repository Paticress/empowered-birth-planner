
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { Home } from "./pages/Home";
import { GuiaOnline } from "./pages/GuiaOnline";
import { BirthPlan } from "./pages/BirthPlan";
import { AcessoPlano } from "./pages/AcessoPlano";
import { CriarPlano } from "./pages/CriarPlano";
import { PaymentSuccess } from "./pages/PaymentSuccess";
import { PaymentCancel } from "./pages/PaymentCancel";
import { MyAccess } from "./pages/MyAccess";
import { FAQ } from "./pages/FAQ";
import { AuthCallback } from "./pages/AuthCallback";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/react';
import { SupabaseTest } from './components/SupabaseTest';
import { WebhookTest } from './pages/WebhookTest';
import NotFound from './pages/NotFound';
import { Loader2 } from 'lucide-react';
import { useEffect } from "react";

function AppContent() {
  const location = useLocation();
  const { isLoading } = useAuth();
  
  // Log current location to help with debugging
  useEffect(() => {
    console.log("Current route:", location.pathname);
    console.log("Full URL:", window.location.href);
    
    // Store last visited page for the dashboard
    if (location.pathname !== '/dashboard') {
      localStorage.setItem('last-visited-page', location.pathname);
    }
  }, [location]);
  
  // Conditionally apply the background class based on the route
  const isBirthPlanRoute = location.pathname.startsWith('/criar-plano');
  const backgroundClass = isBirthPlanRoute ? 'bg-maternal-100' : 'bg-white';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
        <span className="ml-2 text-pink-600 font-medium">Carregando sessão...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${backgroundClass}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/guia-online" element={<GuiaOnline />} />
        <Route path="/plano-de-parto" element={<BirthPlan />} />
        <Route path="/acesso-plano" element={<AcessoPlano />} />
        <Route path="/criar-plano" element={<CriarPlano />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/meus-acessos" element={<MyAccess />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test-supabase" element={<SupabaseTest />} />
        <Route path="/webhook-test" element={<WebhookTest />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
      <Analytics />
    </div>
  );
}

function App() {
  // Add useEffect to detect and log page loads and refreshes
  useEffect(() => {
    console.log("App mounted/remounted");
    console.log("Initial URL:", window.location.href);
    console.log("Navigation type:", getNavigationType());
    
    // Try to detect if this is a page refresh
    if (getNavigationType() === 'reload') {
      console.log("Page was refreshed (F5)");
    }
  }, []);
  
  // Helper function to detect navigation type
  const getNavigationType = () => {
    const nav = window.performance?.getEntriesByType?.('navigation')[0] as PerformanceNavigationTiming;
    return nav?.type || 'unknown';
  };

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
