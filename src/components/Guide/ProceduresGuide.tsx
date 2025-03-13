
import { Button } from '@/components/ui/button';
import { Check, AlertTriangle, Info } from 'lucide-react';

interface ProceduresGuideProps {
  onClose: () => void;
}

export function ProceduresGuide({ onClose }: ProceduresGuideProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-maternal-200 mb-8 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-maternal-800">Guia de Procedimentos no Parto</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
        >
          Fechar
        </Button>
      </div>
      
      <p className="text-maternal-700 mb-6">
        Este guia explica os procedimentos comuns durante o trabalho de parto e nascimento, 
        ajudando você a entender melhor suas opções e tomar decisões informadas para seu plano de parto.
      </p>
      
      <div className="space-y-6">
        <ProcedureSection
          title="Monitoramento Fetal"
          description="O monitoramento fetal verifica os batimentos cardíacos do bebê durante o trabalho de parto."
        >
          <ProcedureOption
            title="Monitoramento Intermitente"
            description="Permite maior liberdade de movimento. O profissional checa os batimentos em intervalos regulares."
            icon={<Info className="h-4 w-4 text-maternal-600" />}
          />
          <ProcedureOption
            title="Monitoramento Contínuo"
            description="Registro contínuo dos batimentos cardíacos e contrações. Pode limitar a movimentação."
            icon={<Info className="h-4 w-4 text-maternal-600" />}
          />
        </ProcedureSection>
        
        <ProcedureSection
          title="Manejo da Dor"
          description="Existem diferentes métodos para alívio da dor durante o trabalho de parto."
        >
          <ProcedureOption
            title="Métodos Não-Farmacológicos"
            description="Técnicas como respiração, banho morno, massagem, bola de parto, mudanças de posição e hipnose. Não causam efeitos colaterais e permitem maior mobilidade."
            icon={<Check className="h-4 w-4 text-maternal-600" />}
          />
          <ProcedureOption
            title="Analgesia Farmacológica"
            description="A analgesia peridural é comum e administrada por anestesista. Bloqueia a sensação de dor, mas pode limitar a mobilidade e, em alguns casos, prolongar o segundo estágio do trabalho de parto."
            icon={<Info className="h-4 w-4 text-maternal-600" />}
          />
        </ProcedureSection>
        
        <ProcedureSection
          title="Episiotomia"
          description="Corte cirúrgico realizado no períneo para ampliar o canal de parto."
        >
          <ProcedureOption
            title=""
            description="A OMS não recomenda o uso rotineiro de episiotomia. Estudos mostram que o procedimento pode causar mais dor, risco de infecção e traumatismo do que um rompimento natural. Quando necessária, deve ser feita com consentimento informado."
            icon={<AlertTriangle className="h-4 w-4 text-maternal-600" />}
          />
        </ProcedureSection>
        
        <ProcedureSection
          title="Indução do Parto"
          description="Procedimento para iniciar artificialmente o trabalho de parto."
        >
          <ProcedureOption
            title=""
            description="Pode ser realizada por diversos métodos, como administração de ocitocina sintética, ruptura artificial da bolsa ou uso de prostaglandinas. Geralmente indicada quando há riscos para a mãe ou bebê na continuação da gravidez."
            icon={<Info className="h-4 w-4 text-maternal-600" />}
          />
        </ProcedureSection>
        
        <ProcedureSection
          title="Cesárea"
          description="Cirurgia para extração do bebê através de uma incisão no abdômen e útero."
        >
          <ProcedureOption
            title=""
            description="Recomendada apenas quando há indicações médicas específicas. É considerada uma cirurgia de grande porte com tempo de recuperação maior. Se necessária, você pode discutir opções como cesárea humanizada, com o bebê colocado imediatamente em contato pele a pele."
            icon={<Info className="h-4 w-4 text-maternal-600" />}
          />
        </ProcedureSection>
        
        <ProcedureSection
          title="Clampeamento do Cordão"
          description="Momento em que o cordão umbilical é pinçado e cortado após o nascimento."
        >
          <ProcedureOption
            title=""
            description="O clampeamento tardio (após 1-5 minutos do nascimento ou quando o cordão parar de pulsar) é recomendado pela OMS por beneficiar o bebê com maior volume sanguíneo e reservas de ferro. O clampeamento imediato pode ser necessário em algumas situações específicas."
            icon={<Check className="h-4 w-4 text-maternal-600" />}
          />
        </ProcedureSection>
        
        <ProcedureSection
          title="Contato Pele a Pele"
          description="Colocação do recém-nascido diretamente sobre o corpo da mãe após o nascimento."
        >
          <ProcedureOption
            title=""
            description="Recomendado pela OMS, favorece o vínculo mãe-bebê, regulação da temperatura, início da amamentação e redução do estresse do bebê. A maioria dos procedimentos de rotina pode ser realizada enquanto o bebê está em contato pele a pele."
            icon={<Check className="h-4 w-4 text-maternal-600" />}
          />
        </ProcedureSection>
      </div>
      
      <div className="mt-6 text-maternal-700 text-sm">
        <p>
          <strong>Observação:</strong> Este é um guia informativo simplificado. Converse sempre com sua 
          equipe médica sobre suas preferências e possibilidades. Cada parto é único e pode requerer 
          adaptações com base nas circunstâncias específicas.
        </p>
      </div>
    </div>
  );
}

interface ProcedureSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function ProcedureSection({ title, description, children }: ProcedureSectionProps) {
  return (
    <div className="border-l-4 border-maternal-300 pl-4">
      <h3 className="text-xl font-medium text-maternal-800 mb-2">{title}</h3>
      <p className="text-maternal-700 mb-2">{description}</p>
      <div className={title === "Monitoramento Fetal" ? "grid grid-cols-1 md:grid-cols-2 gap-4 mt-3" : "space-y-3 mt-3"}>
        {children}
      </div>
    </div>
  );
}

interface ProcedureOptionProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function ProcedureOption({ title, description, icon }: ProcedureOptionProps) {
  return (
    <div className="bg-maternal-50 p-3 rounded-md">
      <div className="flex items-start">
        <div className="bg-maternal-100 p-2 rounded-full mr-3 mt-1">
          {icon}
        </div>
        <div>
          {title && <h4 className="font-medium text-maternal-800">{title}</h4>}
          <p className="text-sm text-maternal-700">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
