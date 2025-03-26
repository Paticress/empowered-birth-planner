
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useNavigation } from '@/hooks/useNavigation';
import { toast } from 'sonner';
import { Check, Heart, Download, Share2 } from 'lucide-react';

export function BirthPlanSuccess() {
  const { navigateTo } = useNavigation();
  
  useEffect(() => {
    // Show a toast to confirm success when the page loads
    toast.success("Plano de Parto concluído!", {
      description: "Seu plano foi criado com sucesso"
    });
    
    // Scroll to top of page
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 mb-8 border-t-4 border-maternal-400">
      <div className="max-w-3xl mx-auto text-center">
        {/* Success icon */}
        <div className="mb-6 inline-flex items-center justify-center p-4 bg-maternal-100 rounded-full">
          <Check className="h-12 w-12 text-maternal-600" />
        </div>
        
        {/* Main heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-maternal-900 mb-4">
          Parabéns! Seu Plano de Parto está pronto!
        </h1>
        
        {/* Subheading */}
        <p className="text-xl text-maternal-700 mb-8">
          Obrigada por confiar na Energia Materna para te ajudar a criar um plano de parto
          personalizado para sua experiência única.
        </p>
        
        {/* Divider */}
        <div className="my-8 border-t border-maternal-200 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-2">
            <Heart className="h-6 w-6 text-maternal-400" />
          </div>
        </div>
        
        {/* Well wishes */}
        <div className="bg-maternal-50 p-6 rounded-lg mb-8 text-left">
          <h2 className="text-2xl font-semibold text-maternal-800 mb-4">
            Nossos desejos para sua jornada
          </h2>
          <p className="mb-4">
            Desejamos que seu parto seja uma experiência positiva, ativa e conectada. 
            Que você se sinta empoderada, respeitada e apoiada durante todo o processo.
          </p>
          <p className="mb-4">
            Seu plano de parto é uma ferramenta importante para comunicar seus desejos à equipe 
            médica, mas lembre-se que a flexibilidade também é essencial. Cada nascimento é único, 
            e o mais importante é que você e seu bebê estejam bem.
          </p>
          <p>
            Estamos torcendo por você nessa jornada incrível!
          </p>
        </div>
        
        {/* What's next section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-maternal-800 mb-4">
            E agora?
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div className="border border-maternal-200 rounded-lg p-6 text-left">
              <h3 className="text-lg font-medium text-maternal-800 mb-2">
                Compartilhe seu plano
              </h3>
              <p className="text-maternal-700 mb-4">
                Compartilhe seu plano de parto com sua equipe médica, parceiro(a) e qualquer pessoa que fará 
                parte do seu momento especial.
              </p>
              <Button
                onClick={() => navigateTo('/criar-plano')}
                variant="outline"
                className="w-full flex items-center justify-center border-maternal-400"
              >
                <Share2 className="mr-2 h-4 w-4" /> Voltar ao Plano
              </Button>
            </div>
            
            <div className="border border-maternal-200 rounded-lg p-6 text-left">
              <h3 className="text-lg font-medium text-maternal-800 mb-2">
                Salve uma cópia
              </h3>
              <p className="text-maternal-700 mb-4">
                Baixe uma cópia do seu plano de parto para imprimir e levar com você para a maternidade.
              </p>
              <Button
                onClick={() => navigateTo('/criar-plano')}
                variant="outline"
                className="w-full flex items-center justify-center border-maternal-400"
              >
                <Download className="mr-2 h-4 w-4" /> Voltar para Baixar
              </Button>
            </div>
          </div>
        </div>
        
        {/* Final CTA */}
        <div className="bg-maternal-100 p-6 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-left">
              <h3 className="text-xl font-semibold text-maternal-800 mb-1">
                Quer se preparar ainda mais?
              </h3>
              <p className="text-maternal-700">
                Conheça nossos outros recursos para uma gestação e parto mais tranquilos.
              </p>
            </div>
            <Link to="/guia-online">
              <Button variant="navigation" className="whitespace-nowrap">
                Acessar Guia Completo
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Logo and signature */}
        <div className="mt-12 mb-4">
          <img 
            src="/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png" 
            alt="Energia Materna" 
            className="h-16 mx-auto" 
          />
          <p className="text-maternal-700 mt-4">
            Com carinho,<br />
            <span className="font-semibold">Equipe Energia Materna</span>
          </p>
        </div>
      </div>
    </div>
  );
}
