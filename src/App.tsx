
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Header from "./components/Header";

// Pages
import { OnlineGuide } from "./components/Guide/OnlineGuide";
import GuiaGratuito from "./pages/GuiaGratuito";
import { BirthPlanBuilder } from "./components/BirthPlan/BirthPlanBuilder";

// Configuração do cliente de query com retry e logs melhorados
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 60000,
    },
  },
  logger: {
    log: (message) => console.log(`[Query]: ${message}`),
    warn: (message) => console.warn(`[Query Warning]: ${message}`),
    error: (message) => console.error(`[Query Error]: ${message}`),
  },
});

// Enhanced log for debugging
console.log("APP COMPONENT INITIALIZING - SETTING UP ROUTES");

const App = () => {
  console.log("APP COMPONENT RENDERING");
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Sonner />
        <div className="flex flex-col min-h-screen">
          <Header />
          <div className="pt-16"> {/* Adicionando padding para compensar o header fixo */}
            <HashRouter>
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <>
                      {console.log("ROUTE / ACCESSED - REDIRECTING TO /guia-online")}
                      <Navigate to="/guia-online" replace />
                    </>
                  } 
                />
                <Route 
                  path="/guia-online" 
                  element={
                    <>
                      {console.log("ROUTE /guia-online ACCESSED - RENDERING ONLINE GUIDE")}
                      <OnlineGuide />
                    </>
                  } 
                />
                <Route 
                  path="/guia-gratuito" 
                  element={
                    <>
                      {console.log("ROUTE /guia-gratuito ACCESSED - RENDERING GUIA GRATUITO")}
                      <GuiaGratuito />
                    </>
                  } 
                />
                <Route 
                  path="/criar-plano" 
                  element={
                    <>
                      {console.log("ROUTE /criar-plano ACCESSED - RENDERING BIRTH PLAN BUILDER")}
                      <BirthPlanBuilder />
                    </>
                  } 
                />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route 
                  path="*" 
                  element={
                    <>
                      {console.log("ROUTE NOT FOUND - RENDERING 404 PAGE")}
                      <NotFound />
                    </>
                  } 
                />
              </Routes>
            </HashRouter>
          </div>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
