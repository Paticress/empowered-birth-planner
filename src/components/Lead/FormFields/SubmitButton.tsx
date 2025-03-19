
import { Button } from '@/components/ui/button';

interface SubmitButtonProps {
  isSubmitting: boolean;
  text: string;
}

export const SubmitButton = ({ isSubmitting, text }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      disabled={isSubmitting}
      className="w-full bg-maternal-600 hover:bg-maternal-700 text-white rounded-full py-6 transition-all duration-300 shadow-md hover:shadow-lg"
    >
      {isSubmitting ? "Processando..." : text}
    </Button>
  );
};
