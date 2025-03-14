
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DueDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  showValidation?: boolean;
  onValidation?: (isValid: boolean) => void;
  required?: boolean;
}

export function DueDatePicker({ 
  value, 
  onChange, 
  showValidation = true,
  onValidation,
  required = true
}: DueDatePickerProps) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isValid = !required || !!value;
    
    if (touched && required) {
      setError(isValid ? null : "Por favor, selecione uma data");
      
      if (onValidation) {
        onValidation(isValid);
      }
    }
  }, [value, touched, onValidation, required]);

  const handleSelect = (date: Date | undefined) => {
    setTouched(true);
    onChange(date);
  };

  const getBorderColor = () => {
    if (!touched || !showValidation || !required) return "border-maternal-200";
    return !error ? "border-green-500" : "border-red-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Data Prevista para o Parto (DPP)</Label>
        {touched && showValidation && error && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            <span>{error}</span>
          </div>
        )}
      </div>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal rounded-xl",
              getBorderColor(),
              !value && "text-muted-foreground"
            )}
            onBlur={() => setTouched(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd/MM/yyyy") : <span>Selecione a data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleSelect}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
            disabled={(date) => 
              date < new Date() // Não permitir datas no passado
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
