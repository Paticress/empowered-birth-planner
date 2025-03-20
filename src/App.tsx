
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Pages
import { OnlineGuide } from "./components/Guide/OnlineGuide";
import GuiaGratuito from "./pages/GuiaGratuito";
import { BirthPlanBuilder } from "./components/BirthPlan/BirthPlanBuilder";
import { Header } from "./components/Header";

// Create a new query client with specific settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
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
        <HashRouter>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex-grow pt-16 md:pt-20">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <>
                      {console.log("ROUTE / ACCESSED - REDIRECTING TO GUIDE")}
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
                      {console.log("ROUTE /guia-gratuito ACCESSED - RENDERING FREE GUIDE")}
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
            </div>
          </div>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
