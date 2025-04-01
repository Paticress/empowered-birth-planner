
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, HashRouter } from "react-router-dom";
import NotFound from "./pages/NotFound";
import { Header } from "./components/Header";

// Pages
import { OnlineGuide } from "./components/Guide/OnlineGuide";
import { BirthPlanBuilder } from "./components/BirthPlan/BirthPlanBuilder";
import { EmbeddedBirthPlanBuilder } from "./components/BirthPlan/EmbeddedBirthPlanBuilder";
import { EmbeddedOnlineGuide } from "./components/Guide/EmbeddedOnlineGuide";

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
});

// Enhanced log for debugging
console.log("APP COMPONENT INITIALIZING - SETTING UP ROUTES");

// Define the App component
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
                  <div className="pt-16 md:pt-20">
                    <OnlineGuide />
                  </div>
                </>
              } 
            />
            <Route 
              path="/embedded-guia" 
              element={
                <>
                  {console.log("ROUTE /embedded-guia ACCESSED - RENDERING EMBEDDED ONLINE GUIDE")}
                  <EmbeddedOnlineGuide />
                </>
              } 
            />
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
            <Route 
              path="/embedded-plano" 
              element={
                <>
                  {console.log("ROUTE /embedded-plano ACCESSED - RENDERING EMBEDDED BIRTH PLAN BUILDER")}
                  <EmbeddedBirthPlanBuilder />
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

// Export App as default for module imports
export default App;

// Manually expose App to window with proper type casting for legacy code paths
if (typeof window !== 'undefined') {
  try {
    // Make sure we expose App to window for non-module code paths
    window.App = App;
    console.log("App component exported to window.App successfully");
  } catch (error) {
    console.error("Error assigning App to window:", error);
  }
}
