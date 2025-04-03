
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
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from '@vercel/analytics/react';
import { SupabaseTest } from './components/SupabaseTest';
import { WebhookTest } from './pages/WebhookTest';

function AppContent() {
  const location = useLocation();
  // Conditionally apply the background class based on the route
  const isBirthPlanRoute = location.pathname.startsWith('/criar-plano');
  const backgroundClass = isBirthPlanRoute ? 'bg-maternal-100' : 'bg-white';

  return (
    <div className={`min-h-screen ${backgroundClass}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/guia-online" element={<GuiaOnline />} />
        <Route path="/plano-de-parto" element={<BirthPlan />} />
        <Route path="/acesso-plano" element={<AcessoPlano />} />
        <Route path="/criar-plano" element={<CriarPlano />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route path="/test-supabase" element={<SupabaseTest />} />
        <Route path="/webhook-test" element={<WebhookTest />} />
      </Routes>
      <Toaster />
      <Analytics />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
