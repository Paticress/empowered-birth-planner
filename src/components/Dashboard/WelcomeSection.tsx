
import React from 'react';

interface WelcomeSectionProps {
  getWelcomeMessage: () => string;
  firstName: string;
}

export function WelcomeSection({ getWelcomeMessage, firstName }: WelcomeSectionProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-maternal-900 mb-2">
        {getWelcomeMessage()}, {firstName}!
      </h1>
      <p className="text-lg text-maternal-600 mb-6">
        Continue com a leitura do guia e depois crie seu plano de parto personalizado.
      </p>
    </div>
  );
}
