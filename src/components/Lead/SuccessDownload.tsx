
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export function SuccessDownload() {
  return (
    <div className="text-center animate-fade-in-up">
      <div className="bg-maternal-100 text-maternal-800 p-4 rounded-full inline-flex items-center justify-center mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h3 className="text-2xl font-bold text-maternal-900 mb-2">Seu guia está pronto!</h3>
      <p className="text-maternal-700 mb-6">
        Confira seu email para acessar o Guia Completo do Plano de Parto Humanizado.
      </p>
      
      <div className="mb-8">
        <a 
          href="/guia-plano-parto-humanizado.pdf" 
          download 
          className="bg-maternal-400 hover:bg-maternal-500 text-white px-8 py-4 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 inline-block"
        >
          Baixar Novamente
        </a>
      </div>
      
      <div className="bg-maternal-50 border border-maternal-200 rounded-xl p-6 mb-6">
        <h4 className="text-lg font-semibold text-maternal-800 mb-3">E agora?</h4>
        <p className="text-maternal-700 mb-4">
          Para ter um plano de parto ainda mais completo e personalizado para suas necessidades...
        </p>
        <Link to="/plano-personalizado">
          <Button variant="navigation" className="hover:bg-gray-200">
            Conhecer o Modelo Personalizado
          </Button>
        </Link>
      </div>
    </div>
  );
}
