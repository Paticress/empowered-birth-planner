import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Mail, Share2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ShareOption } from './ShareOption';
import { EmailShareDialog } from './EmailShareDialog';
import { createShareableText } from './utils/birthPlanUtils';

interface BirthPlanShareProps {
  birthPlan: Record<string, any>;
  onEdit: () => void;
}

export function BirthPlanShare({ birthPlan, onEdit }: BirthPlanShareProps) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  const handleCopyText = () => {
    const text = createShareableText(birthPlan);
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast("Copiado para a área de transferência", {
          description: "Seu plano de parto foi copiado e está pronto para ser compartilhado."
        });
      })
      .catch(() => {
        toast("Erro ao copiar", {
          description: "Não foi possível copiar o texto para a área de transferência."
        });
      });
  };
  
  const handleShareViaWhatsApp = () => {
    const text = encodeURIComponent(createShareableText(birthPlan));
    const whatsappUrl = `https://wa.me/?text=${text}`;
    
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Compartilhe seu Plano de Parto</h1>
      
      <div className="prose max-w-none mb-8">
        <p className="text-lg">
          Seu plano de parto está pronto! Agora você pode compartilhá-lo com sua equipe médica, 
          familiares ou outros cuidadores que estarão envolvidos no nascimento do seu bebê.
        </p>
        
        <div className="bg-maternal-50 p-4 rounded-lg border-l-4 border-maternal-600 my-6">
          <p className="font-medium text-maternal-900 mb-0">
            <strong>Dica:</strong> Compartilhe seu plano de parto com seu médico/obstetra pelo menos um mês antes da sua data prevista.
            Isso dará tempo suficiente para discutir quaisquer ajustes necessários.
          </p>
        </div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-maternal-800 mb-6">Opções de Compartilhamento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ShareOption
            icon={Copy}
            title="Copiar Texto"
            description="Copie o conteúdo para compartilhar"
            onClick={handleCopyText}
          />
          
          <ShareOption
            icon={Share2}
            title="WhatsApp"
            description="Compartilhe via WhatsApp"
            onClick={handleShareViaWhatsApp}
          />
          
          <ShareOption
            icon={Mail}
            title="E-mail"
            description="Envie por e-mail para sua equipe"
            onClick={() => setEmailDialogOpen(true)}
          />
        </div>
      </div>
      
      <div className="bg-maternal-100 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-maternal-800 mb-4">Próximos Passos</h3>
        <ol className="list-decimal pl-5 space-y-2 mb-0">
          <li>Discuta seu plano com seu parceiro ou acompanhante de parto</li>
          <li>Agende uma consulta com seu médico para discutir o plano</li>
          <li>Faça as alterações recomendadas pelo seu médico, se necessário</li>
          <li>Imprima várias cópias para levar ao hospital/maternidade</li>
          <li>Coloque uma cópia na sua bolsa de maternidade</li>
        </ol>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline"
          onClick={onEdit}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar e Editar
        </Button>
      </div>
      
      {/* Email Dialog */}
      <EmailShareDialog 
        open={emailDialogOpen} 
        onOpenChange={setEmailDialogOpen} 
      />
    </div>
  );
}
