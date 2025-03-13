
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";

// Landing Pages
import GuiaGratuito from "./pages/GuiaGratuito";
import PlanoPersonalizado from "./pages/PlanoPersonalizado";
import Depoimentos from "./pages/Depoimentos";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<GuiaGratuito />} />
          <Route path="/guia-gratuito" element={<GuiaGratuito />} />
          <Route path="/plano-personalizado" element={<PlanoPersonalizado />} />
          <Route path="/depoimentos" element={<Depoimentos />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
