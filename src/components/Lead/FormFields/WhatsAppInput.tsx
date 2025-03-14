
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateWhatsappDetailed } from '../services/formService';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface WhatsAppInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  showValidation?: boolean;
  onValidation?: (isValid: boolean) => void;
}

export function WhatsAppInput({ 
  value, 
  onChange, 
  required = true, 
  showValidation = true,
  onValidation
}: WhatsAppInputProps) {
  const [formattedValue, setFormattedValue] = useState('');
  const [touched, setTouched] = useState(false);
  const [validationResult, setValidationResult] = useState({ isValid: true, message: '' });

  useEffect(() => {
    if (!value) {
      setFormattedValue('');
      return;
    }

    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      setFormattedValue(`(${numbers}`);
    } else if (numbers.length <= 6) {
      setFormattedValue(`(${numbers.slice(0, 2)}) ${numbers.slice(2)}`);
    } else if (numbers.length <= 10) {
      setFormattedValue(`(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`);
    } else {
      setFormattedValue(`(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`);
    }
  }, [value]);

  useEffect(() => {
    if (touched || value) {
      const result = validateWhatsappDetailed(value);
      setValidationResult(result);
      
      if (onValidation) {
        onValidation(result.isValid);
      }
    }
  }, [value, touched, onValidation]);

  const handleBlur = () => {
    setTouched(true);
  };

  const getBorderColor = () => {
    if (!touched || !showValidation) return "border-maternal-200";
    return validationResult.isValid ? "border-green-500" : "border-red-500";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="whatsapp">WhatsApp</Label>
      <div className="relative">
        <Input
          id="whatsapp"
          placeholder="(00) 00000-0000"
          value={formattedValue}
          onChange={(e) => onChange(e.target.value)}
          onBlur={handleBlur}
          className={`rounded-xl focus:border-maternal-400 focus:ring-maternal-400 pr-10 ${getBorderColor()}`}
          required={required}
        />
        {touched && showValidation && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            {validationResult.isValid ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
        )}
      </div>
      {touched && showValidation && !validationResult.isValid && (
        <p className="text-red-500 text-sm mt-1">{validationResult.message}</p>
      )}
    </div>
  );
}
