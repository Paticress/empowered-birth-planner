
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Pages
import { OnlineGuide } from "./components/Guide/OnlineGuide";
import GuiaGratuito from "./pages/GuiaGratuito";
import { BirthPlanBuilder } from "./components/BirthPlan/BirthPlanBuilder";
import { BirthPlanSuccess } from "./components/BirthPlan/BirthPlanSuccess";
import { LoginPage } from "./components/BirthPlan/LoginPage";

const queryClient = new QueryClient();

// Enhanced log for debugging
console.log("APP COMPONENT INITIALIZING - SETTING UP ROUTES");

const App = () => {
  console.log("APP COMPONENT RENDERING");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/guia-online" replace />} />
            <Route path="/guia-online" element={<OnlineGuide />} />
            <Route path="/guia-gratuito" element={<GuiaGratuito />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
