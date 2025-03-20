
import { Button } from '@/components/ui/button';
import { Edit, ChevronRight, Check } from 'lucide-react';

interface PreviewFooterProps {
  onEdit: () => void;
  onNext: () => void;
  isSharePage?: boolean;
}

export function PreviewFooter({ onEdit, onNext, isSharePage = false }: PreviewFooterProps) {
  return (
    <div className="flex justify-between mt-8 print:hidden">
      <Button 
        variant="outline"
        onClick={onEdit}
        className="flex items-center border-maternal-300 text-maternal-700 hover:bg-maternal-50"
      >
        <Edit className="mr-2 h-4 w-4" /> Editar Plano
      </Button>
      
      {isSharePage ? (
        <Button 
          onClick={onNext}
          className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
        >
          Concluir <Check className="ml-2 h-4 w-4" />
        </Button>
      ) : (
        <Button 
          onClick={onNext}
          className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
        >
          Compartilhar Plano <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
