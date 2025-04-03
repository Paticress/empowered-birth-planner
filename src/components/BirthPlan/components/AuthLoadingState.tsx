
import React from 'react';

interface AuthLoadingStateProps {
  isProcessingAuth: boolean;
}

export function AuthLoadingState({ isProcessingAuth }: AuthLoadingStateProps) {
  return (
    <div className="flex-grow flex items-center justify-center">
      <div className="text-center p-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-maternal-500 border-r-transparent"></div>
        <p className="mt-4 text-maternal-800">
          {isProcessingAuth 
            ? "Autenticando, por favor aguarde..." 
            : "Carregando..."}
        </p>
      </div>
    </div>
  );
}
