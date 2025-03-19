
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigation } from "@/hooks/useNavigation";
import { useDomainDebug } from "@/hooks/useDomainDebug";

const NotFound = () => {
  const location = useLocation();
  const { navigateTo } = useNavigation();
  useDomainDebug(); // Add domain debugging

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    
    // Log additional information that might help with debugging
    console.log("Current URL:", window.location.href);
    console.log("Hostname:", window.location.hostname);
    console.log("React Router Path:", location.pathname);
    console.log("Using HashRouter:", window.location.hash !== "");
  }, [location.pathname]);

  const handleBackToHome = () => {
    navigateTo("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Página não encontrada</h2>
        <p className="text-gray-600 mb-6">
          O endereço <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> não existe neste site.
        </p>
        <button 
          onClick={handleBackToHome}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Voltar para o Início
        </button>
      </div>
    </div>
  );
};

export default NotFound;
