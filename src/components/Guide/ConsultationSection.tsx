
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export function ConsultationSection() {
  return (
    <div className="bg-maternal-100 p-6 rounded-lg border-l-4 border-maternal-600 mb-8">
      <h3 className="text-xl font-semibold text-maternal-800 mb-3">Consulta Acolhedora</h3>
      <p className="text-maternal-700 mb-4">
        Um espaço acolhedor para tirar suas dúvidas sobre seu plano de parto com a fundadora do Energia Materna, que criou o modelo de plano de parto personalizado.
      </p>
      <p className="text-maternal-700 mb-4">
        Explore alternativas e receba orientação personalizada para ajustar o que for necessário, tornando seu Plano de Parto um documento ideal para a sua jornada.
      </p>
      <Button 
        className="bg-maternal-700 hover:bg-maternal-800 text-white"
        onClick={() => window.open('https://www.energiamaterna.com.br/service-page/consulta-acolhedora', '_blank')}
      >
        <Calendar className="mr-2 h-4 w-4" /> Agendar Consulta Acolhedora
      </Button>
    </div>
  );
}
