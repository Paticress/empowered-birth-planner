
import { Button } from '@/components/ui/button';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { GuideRisksInterventions } from './GuideRisksInterventions';

interface GuideStructureProps {
  onPrevious: () => void;
  onNext: () => void;
}

export function GuideStructure({ onPrevious, onNext }: GuideStructureProps) {
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Como Estruturar seu Plano de Parto</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Um plano de parto bem estruturado facilita a comunicação com a equipe médica e 
          aumenta as chances de que seus desejos sejam respeitados.
        </p>
        
        <GuideRisksInterventions />
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Seções Essenciais</h2>
        
        <div className="space-y-6 mb-8">
          <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-2">1. Dados Pessoais</h3>
            <p>
              Inclua seu nome completo, o nome do(a) parceiro(a) ou acompanhante, 
              data prevista do parto, médico/obstetra responsável, doula (se houver), 
              hospital/maternidade escolhido.
            </p>
          </div>
          
          <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-2">2. Preferências para o Trabalho de Parto</h3>
            <p>
              Detalhe suas preferências para ambiente (luzes, sons, privacidade), 
              movimentação (liberdade para andar, posições), métodos de alívio da dor, 
              monitoramento fetal, alimentação e hidratação durante o trabalho de parto.
            </p>
          </div>
          
          <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-2">3. Preferências para o Parto</h3>
            <p>
              Especifique posições para o parto, preferências sobre episiotomia, uso de fórceps ou vácuo extrator, 
              clampeamento do cordão, contato pele a pele imediato, amamentação na primeira hora.
            </p>
          </div>
          
          <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-2">4. Preferências para o Pós-Parto</h3>
            <p>
              Inclua preferências sobre exames do recém-nascido, permanência do bebê com a mãe, 
              banho do bebê, amamentação contínua, visitas, alta hospitalar.
            </p>
          </div>
          
          <div className="bg-white border border-maternal-200 rounded-lg p-4 shadow-sm">
            <h3 className="text-xl font-medium text-maternal-800 mb-2">5. Cesárea (se necessária)</h3>
            <p>
              Mesmo que você planeje um parto normal, é importante incluir preferências 
              para o caso de uma cesárea ser necessária: anestesia, presença do acompanhante, 
              visualização do nascimento, contato pele a pele.
            </p>
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-8 mb-4">Dicas para uma Boa Estrutura</h2>
        
        <ul className="list-disc pl-5 space-y-3 mb-6">
          <li>
            <strong>Seja concisa:</strong> Mantenha seu plano de parto entre 1-2 páginas para facilitar a leitura.
          </li>
          <li>
            <strong>Use linguagem clara:</strong> Evite termos técnicos desnecessários ou ambíguos.
          </li>
          <li>
            <strong>Priorize seus desejos:</strong> Destaque o que é mais importante para você.
          </li>
          <li>
            <strong>Seja flexível:</strong> Use frases como "se possível" e reconheça que circunstâncias imprevistas podem ocorrer.
          </li>
          <li>
            <strong>Use tópicos e marcadores:</strong> Facilita a leitura rápida pela equipe médica.
          </li>
        </ul>
        
        <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-maternal-600 mb-6">
          <p className="font-medium text-maternal-900">
            Lembre-se: Um plano de parto não garante que tudo ocorrerá exatamente como planejado, 
            mas aumenta significativamente as chances de você ter uma experiência positiva e respeitosa.
          </p>
        </div>
        
        <p>
          Discuta seu plano de parto com seu médico/obstetra durante o pré-natal, 
          idealmente por volta da 32ª-34ª semana. Isso permite tempo para ajustes e 
          garante que todos estejam na mesma página.
        </p>
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button 
          variant="navigation" 
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar à Introdução
        </Button>
        
        <Button 
          onClick={onNext}
          variant="navigation"
          className="flex items-center"
        >
          Próximo: Seus Direitos <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
