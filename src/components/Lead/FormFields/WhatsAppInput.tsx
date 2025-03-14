
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WhatsAppInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export function WhatsAppInput({ value, onChange, required = true }: WhatsAppInputProps) {
  const [formattedValue, setFormattedValue] = useState('');

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

  return (
    <div className="space-y-2">
      <Label htmlFor="whatsapp">WhatsApp</Label>
      <Input
        id="whatsapp"
        placeholder="(00) 00000-0000"
        value={formattedValue}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
        required={required}
      />
    </div>
  );
}
