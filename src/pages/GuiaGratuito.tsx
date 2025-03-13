
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LeadForm } from '@/components/Lead/LeadForm';
import { SuccessDownload } from '@/components/Lead/SuccessDownload';
import { FeatureCard } from '@/components/FeatureCard';
import { Testimonial } from '@/components/Testimonial';

const GuiaGratuito = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSuccess = () => {
    setFormSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen page-transition">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 md:pt-36 bg-gradient-to-br from-maternal-50 via-purple-50 to-indigo-50">
        <div className="landing-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="section-transition">
              <span className="badge mb-4">Guia Gratuito</span>
              <h1 className="heading-primary text-maternal-900">
                Quer um parto mais seguro, respeitoso e sem surpresas?
              </h1>
              <p className="subheading mb-8">
                Baixe agora o Guia Completo do Plano de Parto e descubra como garantir seus direitos e escolher o parto que deseja!
              </p>
              {!formSubmitted && (
                <div className="hidden md:block">
                  <a href="#form-section" className="btn-primary inline-block">
                    Quero Meu Guia Agora
                  </a>
                </div>
              )}
            </div>
            
            <div className="form-section animate-fade-in">
              {formSubmitted ? (
                <SuccessDownload />
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-maternal-900 mb-4 text-center">
                    Baixe seu guia gratuito
                  </h2>
                  <p className="text-maternal-700 mb-6 text-center">
                    Preencha o formulário abaixo para receber seu guia por email:
                  </p>
                  <LeadForm onSuccess={handleFormSuccess} />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="h-24 md:h-32 bg-wave-pattern bg-repeat-x bg-bottom"></div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 md:py-24" id="benefits">
        <div className="landing-container">
          <div className="text-center mb-16 section-transition">
            <h2 className="heading-secondary text-maternal-900">O que você vai aprender</h2>
            <p className="subheading max-w-3xl mx-auto">
              Nosso guia completo fornece tudo o que você precisa para criar um plano de parto eficaz e garantir seus direitos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              }
              title="Estrutura Clara"
              description="Como estruturar seu plano de parto de forma clara e objetiva para que a equipe médica compreenda facilmente"
            />
            
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              }
              title="Seus Direitos"
              description="Quais são seus direitos na gestação, parto e pós-parto, baseados na legislação brasileira e recomendações da OMS"
            />
            
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              }
              title="Comunicação Eficaz"
              description="Como se comunicar com a equipe médica e evitar intervenções desnecessárias durante o trabalho de parto"
            />
            
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Checklist Essencial"
              description="Checklist completo para garantir que todos os detalhes importantes sejam considerados no seu plano de parto"
            />
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 md:py-24 bg-maternal-50">
        <div className="landing-container">
          <div className="text-center mb-16 section-transition">
            <h2 className="heading-secondary text-maternal-900">O que as mães estão dizendo</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Testimonial 
              quote="Baixei o guia do Energia Materna e finalmente consegui organizar tudo para meu parto! Foi um divisor de águas na minha preparação."
              name="Mariana S."
              role="Mãe do Gabriel"
            />
            
            <Testimonial 
              quote="O guia me ajudou a entender meus direitos e a me comunicar melhor com minha equipe médica. Meu parto foi muito mais tranquilo!"
              name="Fernanda L."
              role="Mãe da Beatriz"
            />
          </div>
          
          {!formSubmitted && (
            <div className="text-center mt-16">
              <a href="#form-section" className="btn-primary inline-block">
                Quero Baixar o Guia Agora
              </a>
            </div>
          )}
        </div>
      </section>
      
      {/* Form Section (Mobile) */}
      {!formSubmitted && (
        <section className="py-16 md:hidden" id="form-section">
          <div className="landing-container">
            <div className="form-section">
              <h2 className="text-2xl font-bold text-maternal-900 mb-4 text-center">
                Baixe seu guia gratuito
              </h2>
              <p className="text-maternal-700 mb-6 text-center">
                Preencha o formulário abaixo para receber seu guia por email:
              </p>
              <LeadForm onSuccess={handleFormSuccess} />
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default GuiaGratuito;
