
import { Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { DebugInfoPanel } from './DebugInfoPanel';

interface LoginContentProps {
  isProcessing: boolean;
  error: string | null;
  debugInfo: any;
  onRetry: () => void;
}

export function LoginContent({ isProcessing, error, debugInfo, onRetry }: LoginContentProps) {
  if (isProcessing) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-12 w-12 mx-auto animate-spin text-maternal-600 mb-4" />
        <h2 className="text-xl font-semibold text-maternal-800 mb-2">
          Processando autenticação...
        </h2>
        <p className="text-maternal-600">
          Por favor, aguarde enquanto validamos seu acesso.
        </p>
        <DebugInfoPanel debugInfo={debugInfo} />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
          <h3 className="font-medium">Erro na autenticação</h3>
          <p className="mt-1">{error}</p>
        </div>
        <p className="mb-4">
          O link de acesso pode ter expirado ou ser inválido.
        </p>
        <button 
          onClick={onRetry}
          className="bg-maternal-600 hover:bg-maternal-700 text-white py-2 px-4 rounded"
        >
          Voltar para página de acesso
        </button>
        
        <DebugInfoPanel debugInfo={debugInfo} />
      </div>
    );
  }
  
  return (
    <div className="text-center py-8">
      <Loader2 className="h-12 w-12 mx-auto animate-spin text-maternal-600 mb-4" />
      <p>Redirecionando...</p>
      <DebugInfoPanel debugInfo={debugInfo} />
    </div>
  );
}
