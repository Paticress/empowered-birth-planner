
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NameFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const NameField = ({ value, onChange }: NameFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">Nome</Label>
      <Input
        id="name"
        placeholder="Seu nome completo"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
        required
      />
    </div>
  );
};
