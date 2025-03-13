
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface GuideIntroductionProps {
  onNext: () => void;
}

export function GuideIntroduction({ onNext }: GuideIntroductionProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-gold-900 mb-6">Bem-vinda ao Guia do Plano de Parto!</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Olá, futura mamãe! Estamos muito felizes que você decidiu se preparar para ter um parto mais consciente e respeitoso.
        </p>
        
        <p className="mb-6">
          Este guia foi criado para ajudar você a entender o que é um plano de parto, 
          como ele pode ser uma ferramenta poderosa para garantir seus direitos e como 
          elaborar o seu próprio plano de forma simples e eficaz.
        </p>
        
        <h2 className="text-2xl font-semibold text-gold-800 mt-8 mb-4">O que é um Plano de Parto?</h2>
        
        <p className="mb-4">
          Um plano de parto é um documento escrito que comunica seus desejos, 
          preferências e expectativas para o trabalho de parto, parto e pós-parto 
          imediato à sua equipe de assistência. Não é um contrato rígido, mas sim 
          um guia que ajuda a todos a entenderem o que é importante para você.
        </p>
        
        <p className="mb-4">
          O plano de parto é reconhecido pela Organização Mundial da Saúde (OMS) 
          como uma ferramenta importante para garantir um parto respeitoso e humanizado.
        </p>
        
        <h2 className="text-2xl font-semibold text-gold-800 mt-8 mb-4">Por que criar um Plano de Parto?</h2>
        
        <div className="bg-pink-50 p-4 rounded-lg mb-6">
          <ul className="list-disc pl-5 space-y-2">
            <li>Para se sentir mais segura e confiante durante o processo de parto</li>
            <li>Para garantir que suas preferências sejam conhecidas pela equipe médica</li>
            <li>Para reduzir intervenções desnecessárias</li>
            <li>Para ter uma experiência de parto mais positiva e satisfatória</li>
            <li>Para incluir seu(sua) parceiro(a) ou acompanhante no processo</li>
          </ul>
        </div>
        
        <p className="mb-6">
          Nos próximos capítulos, vamos explorar como estruturar seu plano de parto, 
          quais são seus direitos, como se comunicar efetivamente com a equipe médica 
          e um checklist essencial para garantir que você tenha considerado todos os 
          aspectos importantes.
        </p>
        
        <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-gold-600 mb-6">
          <p className="font-medium text-gold-900">
            Lembre-se: seu corpo, sua escolha. Este guia vai te ajudar a se sentir empoderada 
            para fazer escolhas informadas sobre o seu parto.
          </p>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Button 
          onClick={onNext}
          className="bg-gold-600 hover:bg-gold-700 flex items-center mx-auto"
        >
          Próximo: Como Estruturar seu Plano de Parto <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
