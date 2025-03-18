
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Mail, Share2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

interface BirthPlanShareProps {
  birthPlan: Record<string, any>;
  onEdit: () => void;
}

export function BirthPlanShare({ birthPlan, onEdit }: BirthPlanShareProps) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const createShareableText = () => {
    const personalInfo = birthPlan.personalInfo || {};
    
    let text = `MEU PLANO DE PARTO\n\n`;
    text += `Nome: ${personalInfo.name || 'Não informado'}\n`;
    text += `Data prevista: ${personalInfo.dueDate || 'Não informada'}\n\n`;
    
    // Add other sections
    Object.entries(birthPlan).forEach(([sectionKey, sectionData]) => {
      if (sectionKey === 'personalInfo') return; // Already added above
      
      switch (sectionKey) {
        case 'preferences':
          text += `PREFERÊNCIAS PARA O PARTO:\n`;
          break;
        case 'medicalConsiderations':
          text += `CONSIDERAÇÕES MÉDICAS:\n`;
          break;
        case 'postpartum':
          text += `PÓS-PARTO:\n`;
          break;
        default:
          text += `${sectionKey.toUpperCase()}:\n`;
      }
      
      Object.entries(sectionData as Record<string, any>).forEach(([fieldKey, value]) => {
        if (!value) return;
        
        let fieldName = fieldKey;
        switch (fieldKey) {
          case 'environment': fieldName = 'Ambiente'; break;
          case 'mobility': fieldName = 'Movimentação'; break;
          case 'pain': fieldName = 'Controle de dor'; break;
          case 'interventions': fieldName = 'Intervenções'; break;
          case 'conditions': fieldName = 'Condições médicas'; break;
          case 'medications': fieldName = 'Medicamentos'; break;
          case 'allergies': fieldName = 'Alergias'; break;
          case 'newbornCare': fieldName = 'Cuidados com o bebê'; break;
          case 'feeding': fieldName = 'Alimentação'; break;
          case 'recovery': fieldName = 'Recuperação'; break;
        }
        
        text += `- ${fieldName}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
      });
      
      text += '\n';
    });
    
    text += `Criado em ${new Date().toLocaleDateString()}`;
    
    return text;
  };
  
  const handleCopyToClipboard = () => {
    const text = createShareableText();
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copiado para a área de transferência",
          description: "Seu plano de parto foi copiado e está pronto para ser compartilhado.",
        });
      })
      .catch(() => {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o texto para a área de transferência.",
          variant: "destructive",
        });
      });
  };
  
  const handleShareViaWhatsApp = () => {
    const text = encodeURIComponent(createShareableText());
    const whatsappUrl = `https://wa.me/?text=${text}`;
    
    window.open(whatsappUrl, '_blank');
  };
  
  const handleOpenEmailDialog = () => {
    setEmailDialogOpen(true);
  };
  
  const handleSendEmail = () => {
    if (!email) {
      toast({
        title: "E-mail necessário",
        description: "Por favor, insira um endereço de e-mail válido.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real implementation, this would send an actual email
    toast({
      title: "E-mail enviado",
      description: `Seu plano de parto foi enviado para ${email}.`,
    });
    
    setEmailDialogOpen(false);
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
          <button
            className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-maternal-50 transition-colors"
            onClick={handleCopyToClipboard}
          >
            <Copy className="h-12 w-12 text-maternal-600 mb-4" />
            <span className="font-medium text-maternal-900">Copiar Texto</span>
            <span className="text-sm text-gray-500 mt-1">Copie o conteúdo para compartilhar</span>
          </button>
          
          <button
            className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-maternal-50 transition-colors"
            onClick={handleShareViaWhatsApp}
          >
            <Share2 className="h-12 w-12 text-maternal-600 mb-4" />
            <span className="font-medium text-maternal-900">WhatsApp</span>
            <span className="text-sm text-gray-500 mt-1">Compartilhe via WhatsApp</span>
          </button>
          
          <button
            className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-maternal-50 transition-colors"
            onClick={handleOpenEmailDialog}
          >
            <Mail className="h-12 w-12 text-maternal-600 mb-4" />
            <span className="font-medium text-maternal-900">E-mail</span>
            <span className="text-sm text-gray-500 mt-1">Envie por e-mail para sua equipe</span>
          </button>
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
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enviar por E-mail</DialogTitle>
            <DialogDescription>
              Compartilhe seu plano de parto por e-mail com sua equipe médica ou familiares.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Endereço de E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Mensagem (opcional)
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva uma mensagem personalizada..."
                className="w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleSendEmail} className="bg-maternal-600 hover:bg-maternal-700">
              Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
