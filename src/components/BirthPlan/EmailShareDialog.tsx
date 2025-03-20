
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface EmailShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExportPDF: () => void; // This will be used to export the Word document instead
}

export function EmailShareDialog({ open, onOpenChange, onExportPDF }: EmailShareDialogProps) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Meu Plano de Parto');
  const [message, setMessage] = useState(
    'Olá,\n\nGostaria de compartilhar com você meu plano de parto para o nascimento do meu bebê. ' +
    'Você encontrará em anexo um documento com minhas preferências, que gostaria de discutir em nossa próxima consulta.\n\n' +
    'Desde já agradeço sua atenção e apoio neste momento tão especial.\n\n' +
    'Atenciosamente,'
  );
  const [isSending, setIsSending] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast("Por favor, informe um endereço de e-mail.");
      return;
    }
    
    setIsSending(true);
    
    try {
      // First generate the Word document
      await onExportPDF();
      
      // We would normally send the email via an API here
      // For now, we'll just open the user's mail client with a pre-filled message
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
      window.open(mailtoLink, '_blank');
      
      toast("E-mail preparado! Não se esqueça de anexar o documento Word que você baixou.");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error sending email:", error);
      toast("Ocorreu um erro ao preparar o e-mail. Por favor, tente novamente.");
    } finally {
      setIsSending(false);
    }
  };
  
  const resetForm = () => {
    setEmail('');
    setSubject('Meu Plano de Parto');
    setMessage(
      'Olá,\n\nGostaria de compartilhar com você meu plano de parto para o nascimento do meu bebê. ' +
      'Você encontrará em anexo um documento com minhas preferências, que gostaria de discutir em nossa próxima consulta.\n\n' +
      'Desde já agradeço sua atenção e apoio neste momento tão especial.\n\n' +
      'Atenciosamente,'
    );
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Compartilhar por E-mail</DialogTitle>
          <DialogDescription>
            Envie seu plano de parto para seu médico, doula ou outro profissional de saúde
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail do destinatário</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="nome@exemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input 
              id="subject" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea 
              id="message" 
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSending}>
              {isSending ? "Enviando..." : "Enviar E-mail"}
            </Button>
          </DialogFooter>
        </form>
        
        <div className="mt-4 text-sm text-gray-500">
          <p>
            <strong>Nota:</strong> Isso abrirá seu cliente de e-mail padrão. Você precisará anexar manualmente 
            o documento Word que foi baixado.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
