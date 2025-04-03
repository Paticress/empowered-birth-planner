
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/hooks/useNavigation';

export function LoginHeader() {
  const { navigateTo } = useNavigation();
  
  return (
    <header className="bg-white text-brand-black py-4 px-4 sm:px-6 lg:px-8 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold text-brand-black">Plano de Parto Personalizado</h1>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigateTo("/guia-online")}
          className="text-maternal-900"
        >
          Voltar ao Guia
        </Button>
      </div>
    </header>
  );
}
