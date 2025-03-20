
import { Button } from '@/components/ui/button';
import { Edit, ChevronRight } from 'lucide-react';

interface PreviewFooterProps {
  onEdit: () => void;
  onNext: () => void;
}

export function PreviewFooter({ onEdit, onNext }: PreviewFooterProps) {
  return (
    <div className="flex justify-between mt-8 print:hidden">
      <Button 
        variant="outline"
        onClick={onEdit}
        className="flex items-center"
      >
        <Edit className="mr-2 h-4 w-4" /> Editar Plano
      </Button>
      
      <Button 
        onClick={onNext}
        className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
      >
        Compartilhar Plano <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
