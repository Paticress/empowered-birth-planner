
import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Testimonial } from '@/components/Testimonial';
import { Card } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Link } from 'react-router-dom';

const Depoimentos = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  return (
    <div className="min-h-screen page-transition">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-28 md:pt-36 bg-gradient-to-br from-maternal-50 via-pink-50 to-purple-50">
        <div className="landing-container">
          <div className="max-w-3xl mx-auto text-center section-transition">
            <span className="badge mb-4">Histórias Reais</span>
            <h1 className="heading-primary text-maternal-900">
              A história da Ana pode ser a sua!
            </h1>
            <p className="subheading mb-8">
              "Eu sempre tive medo do parto, mas com o Plano Personalizado do Energia Materna, me senti segura e respeitada. Meu parto foi transformador!"
            </p>
            <Link to="/plano-personalizado">
              <Button className="btn-primary">
                Quero Conhecer
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="h-24 md:h-32 bg-wave-pattern bg-repeat-x bg-bottom"></div>
      </section>
      
      {/* Video Testimonial Section */}
      <section className="py-16 md:py-24">
        <div className="landing-container">
          <div className="text-center mb-16 section-transition">
            <h2 className="heading-secondary text-maternal-900">Assista às histórias inspiradoras</h2>
            <p className="subheading max-w-3xl mx-auto">
              Veja como o Plano de Parto Personalizado transformou a experiência dessas mães
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto mb-16">
            <Card className="overflow-hidden shadow-lg border-maternal-200">
              <AspectRatio ratio={16 / 9}>
                <div className="relative w-full h-full bg-maternal-200 flex items-center justify-center">
                  {!videoPlaying ? (
                    <div className="text-center">
                      <div 
                        className="cursor-pointer bg-maternal-600 text-white rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 hover:bg-maternal-700 transition-colors animate-pulse-soft"
                        onClick={() => setVideoPlaying(true)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-maternal-900 font-medium">Clique para assistir ao depoimento de Ana</p>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-maternal-900 text-white">
                      <p>Depoimento em vídeo seria reproduzido aqui</p>
                    </div>
                  )}
                </div>
              </AspectRatio>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <Testimonial 
              quote="Eu não sabia por onde começar, mas com esse modelo consegui deixar tudo claro para minha equipe médica. Foi libertador!"
              name="Fernanda S."
              role="Mãe do Henrique"
            />
            
            <Testimonial 
              quote="Meu plano de parto me deu voz num momento tão importante. Consegui ter o parto que sempre sonhei, com respeito e dignidade."
              name="Débora R."
              role="Mãe da Alice"
            />
            
            <Testimonial 
              quote="O modelo personalizado me permitiu detalhar todas as minhas preferências. Os profissionais respeitaram cada escolha."
              name="Patrícia M."
              role="Mãe do Davi"
            />
            
            <Testimonial 
              quote="Sentia muito medo do parto, mas o planejamento me deu confiança. Foi uma experiência incrível e me senti no controle."
              name="Bianca L."
              role="Mãe da Laura"
            />
          </div>
          
          <div className="text-center">
            <Link to="/plano-personalizado">
              <Button className="btn-primary">
                Quero Meu Plano Personalizado
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-16 md:py-24 bg-maternal-50">
        <div className="landing-container">
          <div className="text-center mb-16 section-transition">
            <h2 className="heading-secondary text-maternal-900">Como Funciona?</h2>
            <p className="subheading max-w-3xl mx-auto">
              Veja como é simples garantir um parto mais respeitoso e tranquilo
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
              <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold text-maternal-900 mb-3">Preencha seu plano</h3>
              <p className="text-maternal-700">
                Você preenche seu plano em poucos minutos, definindo suas preferências
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
              <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold text-maternal-900 mb-3">Compartilhe</h3>
              <p className="text-maternal-700">
                Entrega para sua equipe médica e define as suas preferências
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-sm text-center">
              <div className="bg-maternal-100 text-maternal-600 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold text-maternal-900 mb-3">Viva seu parto</h3>
              <p className="text-maternal-700">
                Garante um parto mais respeitoso e tranquilo, como você planejou
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 border border-maternal-100 shadow-md text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-semibold text-maternal-900 mb-4">Mais de 1.500 gestantes já usaram nosso modelo!</h3>
            <p className="text-maternal-700 mb-6">
              Não deixe seu parto ao acaso! Tenha controle e confiança no seu momento mais especial.
            </p>
            <Link to="/plano-personalizado">
              <Button className="btn-primary">
                Quero Conhecer
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Depoimentos;
