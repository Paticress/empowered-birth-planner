
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface PregnancyQuestionProps {
  value: string | null;
  onChange: (value: string) => void;
  showValidation?: boolean;
  onValidation?: (isValid: boolean) => void;
}

export function PregnancyQuestion({ 
  value, 
  onChange, 
  showValidation = true,
  onValidation
}: PregnancyQuestionProps) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isValid = !!value;
    
    if (touched) {
      setError(isValid ? null : "Por favor, selecione uma opção");
      
      if (onValidation) {
        onValidation(isValid);
      }
    }
  }, [value, touched, onValidation]);

  const handleChange = (newValue: string) => {
    setTouched(true);
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-base">Você está grávida?</Label>
        {touched && showValidation && error && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{error}</span>
          </div>
        )}
      </div>
      <RadioGroup 
        value={value || ""} 
        onValueChange={handleChange}
        className={`flex flex-col space-y-1 ${touched && showValidation && error ? 'border border-red-500 rounded-md p-2' : ''}`}
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
  );
}
