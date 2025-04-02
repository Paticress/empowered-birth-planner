import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FeatureCard } from '@/components/FeatureCard';
import { Testimonial } from '@/components/Testimonial';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const PlanoPersonalizado = () => {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    acceptTerms: false
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, acceptTerms: checked }));
  };
  
  const handlePurchase = () => {
    setIsCheckingOut(true);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.whatsapp || !formData.acceptTerms) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    // Simulate payment processing
    toast.success("Parabéns! Seu acesso foi liberado com sucesso!");
    
    // Reset form and state
    setFormData({
      name: '',
      email: '',
      whatsapp: '',
      acceptTerms: false
    });
    setIsCheckingOut(false);
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
            {!isCheckingOut && (
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
              <h3 className="text-xl font-semibold text-maternal-900 mb-3">Baixe o modelo</h3>
              <p className="text-maternal-700">
                Após a compra, você recebe acesso imediato ao modelo personalizável em formato editável
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
              <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-maternal-900 mb-3">Personalize</h3>
              <p className="text-maternal-700">
                Preencha o modelo com suas escolhas e preferências para cada etapa do trabalho de parto
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
              <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-maternal-900 mb-3">Utilize</h3>
              <p className="text-maternal-700">
                Imprima e compartilhe seu plano com sua equipe médica e acompanhantes
              </p>
            </div>
          </div>
          
          {!isCheckingOut && (
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
      
      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="landing-container">
          <div className="text-center mb-16 section-transition">
            <h2 className="heading-secondary text-maternal-900">O que as mães estão dizendo</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Testimonial 
              quote="Com o modelo do Energia Materna, finalmente me senti preparada e confiante para o parto. Foi a melhor decisão!"
              name="Ana C."
              role="Mãe do Lucas"
            />
            
            <Testimonial 
              quote="O plano de parto personalizado me ajudou a comunicar minhas preferências de forma clara e objetiva. Minha equipe médica respeitou todas as minhas decisões."
              name="Juliana M."
              role="Mãe da Sofia"
            />
            
            <Testimonial 
              quote="Ter um plano de parto bem organizado me deu segurança para viver esse momento tão especial. Valeu muito a pena!"
              name="Carolina F."
              role="Mãe do Pedro"
            />
          </div>
        </div>
      </section>
      
      {/* Checkout Section */}
      {isCheckingOut && (
        <section className="py-16 md:py-24 bg-maternal-50">
          <div className="landing-container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="form-section animate-fade-in">
                <h2 className="text-2xl font-bold text-maternal-900 mb-6">Complete sua compra</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome completo"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      name="whatsapp"
                      placeholder="(00) 00000-0000"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
                      required
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      checked={formData.acceptTerms} 
                      onCheckedChange={handleCheckboxChange}
                      className="text-maternal-600 focus:ring-maternal-400"
                    />
                    <Label htmlFor="terms" className="text-sm text-maternal-700">
                      Concordo com os termos de uso e política de privacidade
                    </Label>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-maternal-600 hover:bg-maternal-700 text-white rounded-full py-6 transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Finalizar Compra
                  </Button>
                </form>
              </div>
              
              <div className="animate-fade-in-up">
                <Card className="bg-white border-maternal-100 shadow-md p-6">
                  <h3 className="text-xl font-bold text-maternal-900 mb-4">Modelo Personalizado de Plano de Parto</h3>
                  
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-maternal-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-maternal-700">Modelo completo em formato editável</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-maternal-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-maternal-700">Checklist para revisar com a equipe médica</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-maternal-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-maternal-700">Guia de comunicação com a equipe médica</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-maternal-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-maternal-700">Acesso vitalício a atualizações</span>
                    </li>
                  </ul>
                  
                  <div className="border-t border-maternal-100 pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-maternal-700">Preço:</span>
                      <span className="text-maternal-900 font-bold">R$ 128,00</span>
                    </div>
                  </div>
                  
                  <div className="bg-maternal-50 border border-maternal-100 rounded-lg p-4 mb-4">
                    <h4 className="text-sm font-semibold text-maternal-800 mb-2">🎁 BÔNUS EXCLUSIVO</h4>
                    <p className="text-maternal-700 text-sm">
                      Checklist completo para revisar seu plano com a equipe médica!
                    </p>
                  </div>
                  
                  <div className="bg-maternal-50 border border-maternal-100 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-maternal-800 mb-1">Garantia de satisfação:</h4>
                    <p className="text-maternal-700 text-sm">
                      Se você não gostar do material, devolvemos seu dinheiro em até 7 dias.
                    </p>
                  </div>
                </Card>
                
                <Button 
                  variant="outline"
                  onClick={() => setIsCheckingOut(false)}
                  className="mt-4 w-full border-maternal-300 text-maternal-700"
                >
                  Voltar
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
      
      <Footer />
    </div>
  );
};

export default PlanoPersonalizado;
