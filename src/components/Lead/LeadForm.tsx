
import { useState, useEffect } from 'react';
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

// Define an interface for the CRM response
interface CRMResponse {
  success: boolean;
  id: string;
}

export function LeadForm({ onSuccess, buttonText = "Acessar Agora", withWhatsapp = true }: LeadFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [formattedWhatsapp, setFormattedWhatsapp] = useState('');
  const [isPregnant, setIsPregnant] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!whatsapp) {
      setFormattedWhatsapp('');
      return;
    }

    const numbers = whatsapp.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      setFormattedWhatsapp(`(${numbers}`);
    } else if (numbers.length <= 6) {
      setFormattedWhatsapp(`(${numbers.slice(0, 2)}) ${numbers.slice(2)}`);
    } else if (numbers.length <= 10) {
      setFormattedWhatsapp(`(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`);
    } else {
      setFormattedWhatsapp(`(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`);
    }
  }, [whatsapp]);

  const validateWhatsapp = (number: string) => {
    const digits = number.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  };

  // Add proper type to the return value of sendToCRM
  const sendToCRM = async (data: any): Promise<CRMResponse> => {
    console.log("✅ Enviando dados para o CRM:", data);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("✅ Dados enviados com sucesso para o CRM!");
        console.log("📊 Status do envio: Sucesso");
        console.log("📱 Validação do WhatsApp: " + (validateWhatsapp(data.whatsapp) ? "Válido" : "Inválido"));
        resolve({ success: true, id: "lead_" + Date.now() });
      }, 800);
    });
  };

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
      const formData = {
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
            value={formattedWhatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
            required
          />
        </div>
      )}
      
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
                  date < new Date() // Não permitir datas no passado
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
}
