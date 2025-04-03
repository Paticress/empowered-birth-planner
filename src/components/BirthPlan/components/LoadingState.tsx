
import { Loader2 } from 'lucide-react';

export function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-maternal-50">
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <Loader2 className="h-12 w-12 animate-spin text-maternal-500 mx-auto" />
        <p className="mt-4 text-lg font-medium text-maternal-800">Verificando seu acesso...</p>
        <p className="mt-2 text-sm text-maternal-600">Aguarde um momento, estamos preparando tudo para você.</p>
      </div>
    </div>
  );
}
