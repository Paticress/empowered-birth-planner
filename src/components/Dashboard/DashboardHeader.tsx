
// Este arquivo não está mais sendo usado, mas o mantemos por enquanto
// em caso de necessidade futura de referência.

import React from 'react';

interface DashboardHeaderProps {
  greeting: string;
  guideProgress: number;
  birthPlanProgress: number;
  lastVisited: string | null;
  isGuideCompleted: boolean;
  isBirthPlanCompleted: boolean;
}

export function DashboardHeader({
  greeting,
  guideProgress,
  birthPlanProgress,
  lastVisited,
  isGuideCompleted,
  isBirthPlanCompleted
}: DashboardHeaderProps) {
  // Get the user's first name if available
  const firstName = localStorage.getItem('user_first_name') || 'Bem-vindo';

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-maternal-900 mb-2">
        {greeting}, {firstName}!
      </h1>
      <p className="text-lg text-maternal-600 mb-6">
        Continue com a leitura do guia e depois crie seu plano de parto personalizado.
      </p>
    </div>
  );
}
