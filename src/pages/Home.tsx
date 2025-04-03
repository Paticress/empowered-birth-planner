
import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BirthPlanNavButton } from '@/components/BirthPlan/NavButton';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigation } from '@/hooks/useNavigation';
import { useEffect } from 'react';

export function Home() {
  const { user } = useAuth();
  const { navigateTo } = useNavigation();
  
  // If user is authenticated, automatically redirect to the birth plan builder
  useEffect(() => {
    if (user) {
      navigateTo('/criar-plano');
    }
  }, [user, navigateTo]);

  return (
    <div className="min-h-screen flex flex-col bg-maternal-50">
      <Header />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-maternal-900 mb-6 text-center">Plano de Parto Personalizado</h1>
          <p className="text-lg text-maternal-800 mb-8 text-center max-w-2xl">
            Bem-vinda à plataforma de criação do seu plano de parto personalizado.
            Aqui você poderá criar, editar e compartilhar seu plano de parto.
          </p>
          
          <div className="mt-8">
            <BirthPlanNavButton className="text-lg px-8 py-4" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
