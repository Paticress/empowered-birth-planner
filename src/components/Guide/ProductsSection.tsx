
import { ProductCard } from './ProductCard';
import { ExternalLink } from 'lucide-react';

interface ProductsSectionProps {
  wixPlansUrl?: string;
}

export function ProductsSection({ wixPlansUrl = "https://www.energiamaterna.com.br/planos" }: ProductsSectionProps) {
  return (
    <section className="my-8">
      <h2 className="text-2xl font-bold text-maternal-900 mb-4">Produtos Virtuais</h2>
      
      <p className="mb-4">
        Para tornar sua experiência de parto ainda mais positiva, desenvolvemos produtos digitais 
        que complementam seu plano de parto e preparam você emocionalmente para este momento especial.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
        <ProductCard 
          title="Afirmações Positivas para o Parto"
          description="Conjunto de afirmações para fortalecer sua mente e aumentar a confiança durante o trabalho de parto."
          icon="heart"
        />
        
        <ProductCard 
          title="Diário da Maternidade"
          description="Documento digital para registrar emoções, expectativas e memórias desta fase única da sua vida."
          icon="book"
        />
        
        <ProductCard 
          title="Caderno de Bem-Estar"
          description="Guia prático com exercícios, técnicas de respiração e dicas de relaxamento para gestantes."
          icon="sun"
        />
      </div>
      
      <div className="bg-maternal-50 p-6 rounded-lg border border-maternal-200 mb-6">
        <h3 className="font-semibold text-maternal-900 mb-2">Produtos inclusos no Plano Especial</h3>
        <p className="mb-4">
          Todos estes produtos virtuais estão inclusos no Plano Especial (R$ 180,00) e podem fazer toda 
          a diferença na sua preparação para o parto.
        </p>
        
        <div className="text-center">
          <a 
            href={`${wixPlansUrl}#especial`}
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center text-maternal-600 font-medium hover:text-maternal-800"
          >
            Ver detalhes no Plano Especial <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
