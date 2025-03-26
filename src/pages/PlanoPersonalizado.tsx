
import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FeatureCard } from '@/components/FeatureCard';
import { Testimonial } from '@/components/Testimonial';
import { useNavigation } from '@/hooks/useNavigation';
import { toast } from 'sonner';
import { Check, ArrowRight } from 'lucide-react';

const PlanoPersonalizado = () => {
  const { navigateTo } = useNavigation();
  const [hasPaid, setHasPaid] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(true);
  
  // Verificar se o usuário já pagou
  useEffect(() => {
    const checkPaymentStatus = () => {
      const paidStatus = localStorage.getItem('birthPlanPaid');
      const paymentTimestamp = localStorage.getItem('birthPlanPaymentTimestamp');
      
      if (paidStatus === 'true' && paymentTimestamp) {
        const paymentDate = Number(paymentTimestamp);
        const expirationDate = paymentDate + (9 * 30 * 24 * 60 * 60 * 1000); // 9 meses em milissegundos
        
        if (Date.now() < expirationDate) {
          setHasPaid(true);
        }
      }
      
      setIsCheckingPayment(false);
    };
    
    checkPaymentStatus();
  }, []);
  
  const handleAccessPlan = () => {
    navigateTo('/criar-plano');
  };
  
  const handlePurchase = () => {
    // Redirecionar para o construtor de plano de parto, que vai verificar o pagamento
    navigateTo('/criar-plano');
  };

  return (
    <div className="min-h-screen page-transition">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 md:pt-36 bg-gradient-to-br from-maternal-50 via-purple-50 to-pink-50">
        <div className="landing-container">
          <div className="max-w-3xl mx-auto text-center section-transition">
            <span className="badge mb-4">Plano de Parto Personalizado</span>
            <h1 className="heading-primary text-maternal-900">
              Seu Plano de Parto pronto em minutos!
            </h1>
            <p className="subheading mb-8">
              Personalize seu plano de parto e garanta que suas vontades sejam respeitadas no momento mais especial da sua vida.
            </p>
            
            {isCheckingPayment ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-maternal-600"></div>
              </div>
            ) : hasPaid ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                  <p className="text-green-800 flex items-center">
                    <Check className="w-5 h-5 mr-2" /> 
                    Seu acesso está ativo até {new Date(Number(localStorage.getItem('birthPlanPaymentTimestamp')) + (9 * 30 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                  </p>
                </div>
                <Button 
                  onClick={handleAccessPlan}
                  className="btn-primary"
                >
                  Acessar Meu Plano de Parto <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handlePurchase}
                className="btn-primary"
              >
                Quero Meu Plano Agora
              </Button>
            )}
          </div>
        </div>
        
        <div className="h-24 md:h-32 bg-wave-pattern bg-repeat-x bg-bottom"></div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 md:py-24">
        <div className="landing-container">
          <div className="text-center mb-16 section-transition">
            <h2 className="heading-secondary text-maternal-900">Benefícios do Plano Personalizado</h2>
            <p className="subheading max-w-3xl mx-auto">
              Com o Modelo Personalizável de Plano de Parto, você pode definir todos os detalhes do seu parto de forma simples e rápida
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="Evite Intervenções Indesejadas"
              description="Comunique claramente suas preferências e evite procedimentos desnecessários durante o parto"
            />
            
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Mais Segurança"
              description="Tenha mais segurança e tranquilidade sabendo que suas escolhas foram documentadas e comunicadas"
            />
            
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              }
              title="Defenda Suas Escolhas"
              description="Um documento bem estruturado para defender suas escolhas com respeito e clareza"
            />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-maternal-50">
        <div className="landing-container">
          <div className="text-center mb-16 section-transition">
            <h2 className="heading-secondary text-maternal-900">Como Funciona?</h2>
            <p className="subheading max-w-3xl mx-auto">
              Nosso processo é simples e eficiente, permitindo que você tenha seu plano de parto pronto em poucos minutos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
              <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-maternal-900 mb-3">Faça seu pagamento</h3>
              <p className="text-maternal-700">
                Acesso único por R$ 97,00 válido por 9 meses, tempo suficiente para planejar e ajustar seu plano até o nascimento
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
              <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-maternal-900 mb-3">Personalize</h3>
              <p className="text-maternal-700">
                Responda algumas perguntas simples e nosso construtor criará automaticamente um plano de parto para você editar
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
              <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-maternal-900 mb-3">Compartilhe</h3>
              <p className="text-maternal-700">
                Imprima e compartilhe seu plano com sua equipe médica e acompanhantes
              </p>
            </div>
          </div>
          
          {isCheckingPayment ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-maternal-600"></div>
            </div>
          ) : hasPaid ? (
            <div className="text-center">
              <Button 
                onClick={handleAccessPlan}
                className="btn-primary"
              >
                Acessar Meu Plano de Parto <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Button 
                onClick={handlePurchase}
                className="btn-primary"
              >
                Quero Meu Plano Agora
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* Pricing Section */}
      {!hasPaid && (
        <section className="py-16 md:py-24">
          <div className="landing-container">
            <div className="text-center mb-16 section-transition">
              <h2 className="heading-secondary text-maternal-900">Investimento</h2>
              <p className="subheading max-w-3xl mx-auto">
                Acesso completo ao construtor de plano de parto personalizado
              </p>
            </div>
            
            <div className="max-w-md mx-auto">
              <Card className="border-2 border-maternal-300 shadow-xl overflow-hidden">
                <div className="bg-maternal-600 p-6 text-white text-center">
                  <h3 className="text-2xl font-bold">Construtor de Plano de Parto</h3>
                  <p className="text-lg mt-2">Acesso por 9 meses</p>
                </div>
                
                <div className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-4xl font-bold text-maternal-900">R$ 97,00</p>
                    <p className="text-maternal-600">Pagamento único</p>
                  </div>
                  
                  <ul className="space-y-3 mb-6">
                    {[
                      "Questionário personalizado",
                      "Construtor automático de plano",
                      "Editor intuitivo de texto",
                      "Compartilhamento fácil",
                      "Gerador de PDF",
                      "Acesso por 9 meses",
                      "Atualizações ilimitadas durante o período"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="bg-maternal-100 rounded-full p-1 mr-3 mt-0.5">
                          <Check className="h-4 w-4 text-maternal-600" />
                        </div>
                        <span className="text-maternal-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={handlePurchase}
                    className="w-full py-6 text-lg"
                    variant="birth-plan-builder"
                  >
                    Obter Acesso Agora
                  </Button>
                  
                  <p className="text-xs text-center text-maternal-500 mt-4">
                    Acesso imediato após a confirmação do pagamento
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </section>
      )}
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-maternal-50">
        <div className="landing-container">
          <div className="text-center mb-16 section-transition">
            <h2 className="heading-secondary text-maternal-900">O que as mães estão dizendo</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial 
              quote="Com o construtor de plano de parto, finalmente me senti preparada e confiante. Levou apenas 15 minutos para criar um documento completo!"
              name="Ana C."
              role="Mãe do Lucas"
            />
            
            <Testimonial 
              quote="O plano de parto personalizado me ajudou a comunicar minhas preferências de forma clara e objetiva. Minha equipe médica respeitou todas as minhas decisões."
              name="Juliana M."
              role="Mãe da Sofia"
            />
            
            <Testimonial 
              quote="Ter um plano de parto bem organizado me deu segurança para viver esse momento tão especial. O construtor simplificou todo o processo!"
              name="Carolina F."
              role="Mãe do Pedro"
            />
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default PlanoPersonalizado;
