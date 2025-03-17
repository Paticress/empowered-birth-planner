
import { useState, useEffect, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface LeadFormProps {
  onSuccess?: () => void;
  buttonText?: string;
  withWhatsapp?: boolean;
}

// Helper functions moved outside component to avoid recreating on each render
const formatWhatsAppNumber = (number: string): string => {
  if (!number) return '';
  
  // Remove non-numeric characters
  const numbers = number.replace(/\D/g, '');
  
  // Apply mask based on length
  if (numbers.length <= 2) {
    return `(${numbers}`;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

const validateWhatsapp = (number: string): boolean => {
  const digits = number.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
};

export const LeadForm = memo(function LeadForm({ onSuccess, buttonText = "Acessar Agora", withWhatsapp = true }: LeadFormProps) {
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
            value={formattedWhatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
            required
          />
        </div>
      )}
      
      {/* Pregnancy question */}
      <div className="space-y-2">
        <Label className="text-base">Você está grávida?</Label>
        <RadioGroup 
          value={isPregnant || ""} 
          onValueChange={setIsPregnant}
          className="flex flex-col space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sim" id="pregnant-yes" />
            <Label htmlFor="pregnant-yes">Sim</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="nao" id="pregnant-no" />
            <Label htmlFor="pregnant-no">Não</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="parceira" id="pregnant-partner" />
            <Label htmlFor="pregnant-partner">Minha parceira está</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Due Date (only visible if pregnant or partner is pregnant) */}
      {(isPregnant === 'sim' || isPregnant === 'parceira') && (
        <div className="space-y-2">
          <Label>Data Prevista para o Parto (DPP)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-xl border-maternal-200",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "dd/MM/yyyy") : <span>Selecione a data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
                disabled={(date) => 
                  date < new Date() // Don't allow past dates
                }
              />
            </PopoverContent>
          </Popover>
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
});

export default LeadForm;
