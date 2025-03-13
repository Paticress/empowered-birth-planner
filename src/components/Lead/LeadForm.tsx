
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface LeadFormProps {
  onSuccess?: () => void;
  buttonText?: string;
  withWhatsapp?: boolean;
}

export function LeadForm({ onSuccess, buttonText = "Acessar Agora", withWhatsapp = true }: LeadFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name || (withWhatsapp && !whatsapp) || !acceptTerms) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Obrigado! Seu guia está pronto para acesso.");
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setEmail('');
      setName('');
      setWhatsapp('');
      setAcceptTerms(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Seu nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
          required
        />
      </div>
      
      {withWhatsapp && (
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            placeholder="(00) 00000-0000"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
            required
          />
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="terms" 
          checked={acceptTerms} 
          onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
          className="text-maternal-600 focus:ring-maternal-400"
        />
        <Label htmlFor="terms" className="text-sm text-maternal-700">
          Concordo em receber conteúdos sobre maternidade e parto humanizado
        </Label>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-maternal-600 hover:bg-maternal-700 text-white rounded-full py-6 transition-all duration-300 shadow-md hover:shadow-lg"
      >
        {isSubmitting ? "Processando..." : buttonText}
      </Button>
    </form>
  );
}
