
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WhatsAppFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const WhatsAppField = ({ value, onChange }: WhatsAppFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="whatsapp">WhatsApp</Label>
      <Input
        id="whatsapp"
        placeholder="(00) 00000-0000"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
        required
      />
    </div>
  );
};
