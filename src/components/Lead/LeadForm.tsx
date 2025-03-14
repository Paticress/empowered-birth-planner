
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { WhatsAppInput } from './FormFields/WhatsAppInput';
import { PregnancyQuestion } from './FormFields/PregnancyQuestion';
import { DueDatePicker } from './FormFields/DueDatePicker';
import { sendToCRM, validateWhatsapp, type LeadFormData } from './services/formService';

interface LeadFormProps {
  onSuccess?: () => void;
  buttonText?: string;
  withWhatsapp?: boolean;
}

export function LeadForm({ onSuccess, buttonText = "Acessar Agora", withWhatsapp = true }: LeadFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isPregnant, setIsPregnant] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !name || !isPregnant || !acceptTerms) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    if (withWhatsapp && !validateWhatsapp(whatsapp)) {
      toast.error("Por favor, insira um número de WhatsApp válido");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData: LeadFormData = {
        name,
        email,
        whatsapp: withWhatsapp ? whatsapp.replace(/\D/g, '') : null,
        isPregnant,
        dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
        timestamp: new Date().toISOString()
      };
      
      const result = await sendToCRM(formData);
      
      console.log("Lead registrado com ID:", result.id);
      
      toast.success("Obrigado! Seu guia está pronto para acesso.");
      
      if (onSuccess) {
        onSuccess();
      }
      
      resetForm();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setName('');
    setWhatsapp('');
    setIsPregnant(null);
    setDueDate(undefined);
    setAcceptTerms(false);
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
        <WhatsAppInput 
          value={whatsapp}
          onChange={setWhatsapp}
        />
      )}
      
      <PregnancyQuestion 
        value={isPregnant}
        onChange={setIsPregnant}
      />
      
      {(isPregnant === 'sim' || isPregnant === 'parceira') && (
        <DueDatePicker
          value={dueDate}
          onChange={setDueDate}
        />
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
