
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Pages
import { OnlineGuide } from "./components/Guide/OnlineGuide";
import GuiaGratuito from "./pages/GuiaGratuito";
import { BirthPlanBuilder } from "./components/BirthPlan/BirthPlanBuilder";
import { EmbeddedBirthPlanBuilder } from "./components/BirthPlan/EmbeddedBirthPlanBuilder";
import { BirthPlanSuccess } from "./components/BirthPlan/BirthPlanSuccess";
import PlanoPersonalizado from "./pages/PlanoPersonalizado";
import { Header } from "./components/Header";

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
            <Route 
              path="/guia-online" 
              element={
                <>
                  <Header />
                  <OnlineGuide />
                </>
              } 
            />
            <Route 
              path="/guia-gratuito" 
              element={
                <>
                  <Header />
                  <GuiaGratuito />
                </>
              } 
            />
            <Route 
              path="/plano-personalizado" 
              element={
                <>
                  <Header />
                  <PlanoPersonalizado />
                </>
              } 
            />
            <Route 
              path="/criar-plano" 
              element={
                <>
                  {console.log("ROUTE /criar-plano ACCESSED - RENDERING BIRTH PLAN BUILDER")}
                  <Header />
                  <div className="mt-16 md:mt-20">
                    <BirthPlanBuilder />
                  </div>
                </>
              } 
            />
            <Route 
              path="/embedded-plano" 
              element={
                <>
                  {console.log("ROUTE /embedded-plano ACCESSED - RENDERING EMBEDDED BIRTH PLAN BUILDER")}
                  {/* Removido o Header nesta rota específica */}
                  <EmbeddedBirthPlanBuilder />
                </>
              } 
            />
            <Route 
              path="/plano-concluido" 
              element={
                <>
                  {console.log("ROUTE /plano-concluido ACCESSED - RENDERING SUCCESS PAGE")}
                  <Header />
                  <div className="mt-16 md:mt-20">
                    <BirthPlanSuccess />
                  </div>
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
