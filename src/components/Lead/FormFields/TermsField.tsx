
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface TermsFieldProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const TermsField = ({ checked, onChange }: TermsFieldProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="terms" 
        checked={checked} 
        onCheckedChange={(checked) => onChange(checked as boolean)}
        className="text-maternal-600 focus:ring-maternal-400"
      />
      <Label htmlFor="terms" className="text-sm text-maternal-700">
        Concordo em receber conteúdos sobre maternidade e parto humanizado
      </Label>
    </div>
  );
};
