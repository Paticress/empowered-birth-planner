
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { WhatsAppInput } from './FormFields/WhatsAppInput';
import { PregnancyQuestion } from './FormFields/PregnancyQuestion';
import { DueDatePicker } from './FormFields/DueDatePicker';
import { 
  sendToCRM, 
  validateWhatsapp, 
  validateEmail, 
  validateName,
  type LeadFormData,
  type ValidationResult 
} from './services/formService';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface LeadFormProps {
  onSuccess?: () => void;
  buttonText?: string;
  withWhatsapp?: boolean;
}

// Define a type for validation state that ensures message is always present
interface ValidationState {
  name: ValidationResult;
  email: ValidationResult;
  whatsapp: boolean;
  isPregnant: boolean;
  dueDate: boolean;
  terms: boolean;
}

export function LeadForm({ onSuccess, buttonText = "Acessar Agora", withWhatsapp = true }: LeadFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isPregnant, setIsPregnant] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form validation states
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    terms: false
  });
  const [validationState, setValidationState] = useState<ValidationState>({
    name: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    whatsapp: true,
    isPregnant: true,
    dueDate: true,
    terms: true
  });
  const [formIsValid, setFormIsValid] = useState(false);

  // Check overall form validity
  useEffect(() => {
    const isValid = 
      validationState.name.isValid && 
      validationState.email.isValid && 
      (withWhatsapp ? validationState.whatsapp : true) && 
      validationState.isPregnant && 
      (isPregnant === 'sim' || isPregnant === 'parceira' ? validationState.dueDate : true) && 
      acceptTerms;
    
    setFormIsValid(isValid);
  }, [validationState, acceptTerms, withWhatsapp, isPregnant]);

  // Validate name field
  useEffect(() => {
    if (touched.name) {
      const result = validateName(name);
      setValidationState(prev => ({ ...prev, name: result }));
    }
  }, [name, touched.name]);

  // Validate email field
  useEffect(() => {
    if (touched.email) {
      const result = validateEmail(email);
      setValidationState(prev => ({ ...prev, email: result }));
    }
  }, [email, touched.email]);

  // Validate terms
  useEffect(() => {
    if (touched.terms) {
      setValidationState(prev => ({ 
        ...prev, 
        terms: acceptTerms 
      }));
    }
  }, [acceptTerms, touched.terms]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleWhatsappValidation = (isValid: boolean) => {
    setValidationState(prev => ({ ...prev, whatsapp: isValid }));
  };

  const handlePregnancyValidation = (isValid: boolean) => {
    setValidationState(prev => ({ ...prev, isPregnant: isValid }));
  };

  const handleDueDateValidation = (isValid: boolean) => {
    setValidationState(prev => ({ ...prev, dueDate: isValid }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all fields as touched for validation
    setTouched({
      name: true,
      email: true,
      terms: true
    });
    
    if (!formIsValid) {
      toast.error("Por favor, corrija os erros no formulário");
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
    setTouched({
      name: false,
      email: false,
      terms: false
    });
  };

  const getInputBorderClass = (fieldName: 'name' | 'email') => {
    if (!touched[fieldName]) return "border-maternal-200";
    return validationState[fieldName].isValid ? "border-green-500" : "border-red-500";
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <div className="relative">
          <Input
            id="name"
            placeholder="Seu nome completo"
            value={name}
            onChange={handleNameChange}
            onBlur={() => setTouched(prev => ({ ...prev, name: true }))}
            className={`rounded-xl focus:border-maternal-400 focus:ring-maternal-400 pr-10 ${getInputBorderClass('name')}`}
            required
          />
          {touched.name && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {validationState.name.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {touched.name && !validationState.name.isValid && (
          <p className="text-red-500 text-sm mt-1">{validationState.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={handleEmailChange}
            onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
            className={`rounded-xl focus:border-maternal-400 focus:ring-maternal-400 pr-10 ${getInputBorderClass('email')}`}
            required
          />
          {touched.email && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              {validationState.email.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          )}
        </div>
        {touched.email && !validationState.email.isValid && (
          <p className="text-red-500 text-sm mt-1">{validationState.email.message}</p>
        )}
      </div>
      
      {withWhatsapp && (
        <WhatsAppInput 
          value={whatsapp}
          onChange={setWhatsapp}
          onValidation={handleWhatsappValidation}
        />
      )}
      
      <PregnancyQuestion 
        value={isPregnant}
        onChange={setIsPregnant}
        onValidation={handlePregnancyValidation}
      />
      
      {(isPregnant === 'sim' || isPregnant === 'parceira') && (
        <DueDatePicker
          value={dueDate}
          onChange={setDueDate}
          onValidation={handleDueDateValidation}
        />
      )}
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="terms" 
          checked={acceptTerms} 
          onCheckedChange={(checked) => {
            setAcceptTerms(checked as boolean);
            setTouched(prev => ({ ...prev, terms: true }));
          }}
          className={`mt-1 text-maternal-600 focus:ring-maternal-400 ${touched.terms && !acceptTerms ? 'border-red-500' : ''}`}
        />
        <div>
          <Label htmlFor="terms" className="text-sm text-maternal-700">
            Concordo em receber conteúdos sobre maternidade e parto humanizado
          </Label>
          {touched.terms && !acceptTerms && (
            <p className="text-red-500 text-sm mt-1">Por favor, aceite os termos para continuar</p>
          )}
        </div>
      </div>
      
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className={`w-full py-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg ${
          formIsValid 
            ? 'bg-maternal-600 hover:bg-maternal-700 text-white' 
            : 'bg-maternal-300 text-white cursor-not-allowed'
        }`}
      >
        {isSubmitting ? "Processando..." : buttonText}
      </Button>
    </form>
  );
}
