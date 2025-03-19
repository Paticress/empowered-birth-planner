
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PregnancyFieldProps {
  value: string | null;
  onChange: (value: string) => void;
}

export const PregnancyField = ({ value, onChange }: PregnancyFieldProps) => {
  return (
    <div className="space-y-2">
      <Label className="text-base">Você está grávida?</Label>
      <RadioGroup 
        value={value || ""} 
        onValueChange={onChange}
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
  );
};
