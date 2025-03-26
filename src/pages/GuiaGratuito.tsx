
import { useState } from 'react';
import { LeadForm } from '@/components/Lead/LeadForm';
import { OnlineGuide } from '@/components/Guide/OnlineGuide';
import { Testimonial } from '@/components/Testimonial';
import { BookOpen, Shield, MessageCircle, CheckSquare } from 'lucide-react';
import { FeatureCard } from '@/components/FeatureCard';

const GuiaGratuito = () => {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSuccess = () => {
    setFormSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Debug log to check rendering
  console.log("Rendering GuiaGratuito, formSubmitted:", formSubmitted);

  return (
    <div className="min-h-screen bg-gradient-to-br from-maternal-50 via-purple-50 to-indigo-50 page-transition">
      {formSubmitted ? (
        <OnlineGuide />
      ) : (
        <main className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="section-transition">
                <span className="badge mb-4">Guia Gratuito</span>
                <h1 className="heading-primary text-maternal-900">
                  Quer um parto mais seguro, respeitoso e sem surpresas?
                </h1>
                <p className="subheading mb-8">
                  Acesse agora o Guia Completo do Plano de Parto e descubra como garantir seus direitos e escolher o parto que deseja!
                </p>
              </div>
              
              <div className="form-section animate-fade-in">
                <h2 className="text-2xl font-bold text-maternal-900 mb-4 text-center">
                  Acesse seu guia gratuito
                </h2>
                <p className="text-maternal-700 mb-6 text-center">
                  Preencha o formulário abaixo para acessar o guia online:
                </p>
                <LeadForm 
                  onSuccess={handleFormSuccess} 
                  buttonText="Acessar Meu Guia" 
                />
              </div>
            </div>
          </section>
          
          {/* Benefits Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-maternal-900 mb-6 text-center">
              O que você vai aprender
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <FeatureCard 
                icon={<BookOpen className="h-8 w-8" />}
                title="Estrutura clara e objetiva"
                description="Como estruturar seu plano de parto de forma clara para que a equipe médica compreenda facilmente"
              />
              
              <FeatureCard 
                icon={<Shield className="h-8 w-8" />}
                title="Seus direitos garantidos"
                description="Quais são seus direitos na gestação, parto e pós-parto, baseados na legislação brasileira"
              />
              
              <FeatureCard 
                icon={<MessageCircle className="h-8 w-8" />}
                title="Comunicação eficaz"
                description="Como se comunicar com a equipe médica e evitar intervenções desnecessárias"
              />
              
              <FeatureCard 
                icon={<CheckSquare className="h-8 w-8" />}
                title="Checklist essencial"
                description="Checklist completo para garantir que todos os detalhes importantes sejam considerados"
              />
            </div>
            
            <div className="text-center mt-10">
              <p className="text-maternal-900 font-medium text-lg mb-4">
                100% GRATUITO – Acesse agora e dê o primeiro passo para um parto consciente!
              </p>
              <a href="#form-section" className="btn-primary inline-block">
                Quero Meu Guia Agora
              </a>
            </div>
          </section>
          
          {/* Testimonial Section */}
          <section className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="section-transition">
                <img 
                  src="https://images.unsplash.com/photo-1595924733523-c87d4bc15812?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                  alt="Gestante escrevendo plano de parto" 
                  className="rounded-xl shadow-md object-cover h-80 w-full"
                />
              </div>
              
              <div className="section-transition">
                <Testimonial 
                  quote="Baixei o guia do Energia Materna e finalmente consegui organizar tudo para meu parto! Foi um divisor de águas na minha preparação."
                  name="Mariana S."
                  role="Mãe do Gabriel"
                />
                
                <div className="mt-8 text-center">
                  <a href="#form-section" className="btn-primary inline-block" id="form-section">
                    Quero Acessar o Guia Agora
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}
    </div>
  );
};

export default GuiaGratuito;
