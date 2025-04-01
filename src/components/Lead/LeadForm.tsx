
import { useState, useEffect, useCallback, memo } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { formatWhatsAppNumber, validateWhatsapp } from './utils/formatters';
import { NameField } from './FormFields/NameField';
import { EmailField } from './FormFields/EmailField';
import { WhatsAppField } from './FormFields/WhatsAppField';
import { PregnancyField } from './FormFields/PregnancyField';
import { DueDateField } from './FormFields/DueDateField';
import { TermsField } from './FormFields/TermsField';
import { SubmitButton } from './FormFields/SubmitButton';

interface LeadFormProps {
  onSuccess?: () => void;
  buttonText?: string;
  withWhatsapp?: boolean;
}

export const LeadForm = memo(function LeadForm({ 
  onSuccess, 
  buttonText = "Acessar Agora", 
  withWhatsapp = true 
}: LeadFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [formattedWhatsapp, setFormattedWhatsapp] = useState('');
  const [isPregnant, setIsPregnant] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Apply mask to WhatsApp number
  useEffect(() => {
    setFormattedWhatsapp(formatWhatsAppNumber(whatsapp));
  }, [whatsapp]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Prepare data for CRM
      const formData = {
        name,
        email,
        whatsapp: withWhatsapp ? whatsapp.replace(/\D/g, '') : null,
        isPregnant,
        dueDate: dueDate ? format(dueDate, 'yyyy-MM-dd') : null,
        timestamp: new Date().toISOString()
      };
      
      console.log("Form data for CRM:", formData);
      
      toast.success("Obrigado! Seu guia está pronto para acesso.");
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form
      setEmail('');
      setName('');
      setWhatsapp('');
      setIsPregnant(null);
      setDueDate(undefined);
      setAcceptTerms(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Ocorreu um erro. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }, [email, name, whatsapp, isPregnant, dueDate, acceptTerms, withWhatsapp, onSuccess]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <NameField value={name} onChange={setName} />
      <EmailField value={email} onChange={setEmail} />
      
      {withWhatsapp && (
        <WhatsAppField value={formattedWhatsapp} onChange={setWhatsapp} />
      )}
      
      <PregnancyField value={isPregnant} onChange={setIsPregnant} />
      
      {(isPregnant === 'sim' || isPregnant === 'parceira') && (
        <DueDateField value={dueDate} onChange={setDueDate} />
      )}
      
      <TermsField checked={acceptTerms} onChange={setAcceptTerms} />
      
      <SubmitButton isSubmitting={isSubmitting} text={buttonText} />
    </form>
  );
});

export default LeadForm;
