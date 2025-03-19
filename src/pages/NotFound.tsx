
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Página não encontrada</p>
        <p className="text-gray-500 mb-6">
          O endereço solicitado não existe neste site.
        </p>
        <Link to="/" className="text-blue-500 hover:text-blue-700 underline">
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
