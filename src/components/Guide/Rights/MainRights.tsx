
import { Shield } from 'lucide-react';

export function MainRights() {
  return (
    <div className="bg-maternal-50 p-6 rounded-lg mb-8">
      <h2 className="text-2xl font-semibold text-maternal-800 mb-4 flex items-center">
        <Shield className="mr-2 h-6 w-6 text-maternal-600" /> 
        Principais Direitos Garantidos por Lei
      </h2>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-maternal-800 mb-2">Acompanhante de Escolha</h3>
          <p className="mb-2">
            <strong>Lei Federal nº 11.108/2005:</strong> Garante à gestante o direito a um acompanhante 
            de sua livre escolha durante todo o período de trabalho de parto, parto e pós-parto imediato.
          </p>
          <p className="text-sm text-maternal-700">
            Este direito é válido tanto no SUS quanto em hospitais privados, e não pode ser negado sob nenhuma circunstância.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-maternal-800 mb-2">Atendimento Humanizado</h3>
          <p className="mb-2">
            <strong>Lei nº 17.137/2019 (Estado de São Paulo):</strong> Estabelece o direito à assistência humanizada à mulher em trabalho de parto, parto e puerpério.
          </p>
          <p className="text-sm text-maternal-700">
            Diversos estados e municípios possuem leis semelhantes que garantem o direito ao parto humanizado.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-maternal-800 mb-2">Presença de Doula</h3>
          <p className="mb-2">
            <strong>Leis estaduais e municipais:</strong> Muitos estados e municípios possuem legislação 
            específica que garante o direito à presença de doulas durante o trabalho de parto e parto, 
            além do acompanhante.
          </p>
          <p className="text-sm text-maternal-700">
            Verifique a legislação do seu estado ou município sobre a presença de doulas.
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-maternal-800 mb-2">Vinculação à Maternidade</h3>
          <p className="mb-2">
            <strong>Lei nº 11.634/2007:</strong> Garante à gestante o direito ao conhecimento e à vinculação 
            prévia à maternidade onde será realizado seu parto.
          </p>
          <p className="text-sm text-maternal-700">
            Você tem o direito de conhecer a maternidade onde ocorrerá seu parto e fazer visitas prévias.
          </p>
        </div>
      </div>
    </div>
  );
}
