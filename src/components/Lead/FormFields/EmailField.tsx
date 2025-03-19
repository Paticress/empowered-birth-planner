
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export const EmailField = ({ value, onChange }: EmailFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="seu@email.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
        required
      />
    </div>
  );
};
