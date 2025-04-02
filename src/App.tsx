
import React from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import { OnlineGuide } from "./components/Guide/OnlineGuide";
import GuiaGratuito from "./pages/GuiaGratuito";
import { BirthPlanBuilder } from "./components/BirthPlan/BirthPlanBuilder";
import { BirthPlanSuccess } from "./components/BirthPlan/BirthPlanSuccess";
import { LoginPage } from "./components/BirthPlan/LoginPage";

// Enhanced log for debugging
console.log("APP COMPONENT INITIALIZING - SETTING UP ROUTES");

const App = () => {
  console.log("APP COMPONENT RENDERING");
  
  // Move QueryClient inside the component
  const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Sonner />
          <HashRouter>
            <Routes>
              {/* Página inicial redireciona para o guia online */}
              <Route path="/" element={<Navigate to="/guia-online" replace />} />
              
              {/* Rotas do Guia (acesso livre) */}
              <Route path="/guia-online" element={<OnlineGuide />} />
              <Route path="/guia-gratuito" element={<GuiaGratuito />} />
              
              {/* Rotas do Plano de Parto (acesso restrito) */}
              <Route path="/acesso-plano" element={<LoginPage />} />
              <Route 
                path="/criar-plano" 
                element={
                  <>
                    {console.log("ROUTE /criar-plano ACCESSED - RENDERING BIRTH PLAN BUILDER")}
                    <BirthPlanBuilder />
                  </>
                } 
              />
              <Route 
                path="/plano-concluido" 
                element={
                  <>
                    {console.log("ROUTE /plano-concluido ACCESSED - RENDERING SUCCESS PAGE")}
                    <BirthPlanSuccess />
                  </>
                } 
              />
              
              {/* Rota de fallback para páginas não encontradas */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
