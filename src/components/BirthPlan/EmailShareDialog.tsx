
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

interface EmailShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmailShareDialog({ open, onOpenChange }: EmailShareDialogProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  
  const handleSendEmail = () => {
    if (!email) {
      toast({
        title: "E-mail necessário",
        description: "Por favor, insira um endereço de e-mail válido."
      });
      return;
    }
    
    // In a real implementation, this would send an actual email
    toast({
      title: "E-mail enviado",
      description: `Seu plano de parto foi enviado para ${email}.`
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
}
