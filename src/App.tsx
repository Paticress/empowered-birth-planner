
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Pages
import { OnlineGuide } from "./components/Guide/OnlineGuide";
import { BirthPlanBuilder } from "./components/BirthPlan/BirthPlanBuilder";
import { EmbeddedBirthPlanBuilder } from "./components/BirthPlan/EmbeddedBirthPlanBuilder";
import { BirthPlanSuccess } from "./components/BirthPlan/BirthPlanSuccess";
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
            {/* Default route redirects to the guide */}
            <Route path="/" element={<Navigate to="/guia-online" replace />} />
            
            {/* Online guide for free plan users from Wix */}
            <Route 
              path="/guia-online" 
              element={
                <>
                  <Header />
                  <div className="pt-16 md:pt-20">
                    <OnlineGuide />
                  </div>
                </>
              } 
            />
            
            {/* Birth plan builder for paid plan users from Wix */}
            <Route 
              path="/criar-plano" 
              element={
                <>
                  {console.log("ROUTE /criar-plano ACCESSED - RENDERING BIRTH PLAN BUILDER")}
                  <Header />
                  <div className="pt-16 md:pt-20">
                    <BirthPlanBuilder />
                  </div>
                </>
              } 
            />
            
            {/* Embedded version for Wix iframe */}
            <Route 
              path="/embedded-plano" 
              element={
                <>
                  {console.log("ROUTE /embedded-plano ACCESSED - RENDERING EMBEDDED BIRTH PLAN BUILDER")}
                  <EmbeddedBirthPlanBuilder />
                </>
              } 
            />
            
            {/* Success page after plan creation */}
            <Route 
              path="/plano-concluido" 
              element={
                <>
                  {console.log("ROUTE /plano-concluido ACCESSED - RENDERING SUCCESS PAGE")}
                  <Header />
                  <div className="pt-16 md:pt-20">
                    <BirthPlanSuccess />
                  </div>
                </>
              } 
            />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
