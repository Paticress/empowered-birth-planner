
import { BookHeart, BookOpen, Notebook } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductsSection() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-maternal-800 mt-10 mb-6">Produtos para sua Jornada Materna</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-maternal-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="h-64 overflow-hidden">
            <img 
              src="/lovable-uploads/6b2f6105-ec41-413d-bd52-f974c7aba5ce.png" 
              alt="Capa do Diário da Maternidade" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <h3 className="text-xl font-semibold text-maternal-800 mb-1">Meu Diário da Maternidade</h3>
            <p className="text-maternal-600 text-sm mb-3">Registre memórias e sentimentos</p>
            <p className="text-maternal-700 mb-4 text-sm">
              Este diário foi criado para você registrar suas memórias, sentimentos e aprendizados, criando uma lembrança afetiva desse período tão especial. Escreva, reflita e celebre cada passo do seu caminho.
            </p>
            <Button 
              variant="resource"
              className="w-full"
              onClick={() => window.open("https://www.energiamaterna.com.br/especiais/diario-da-maternidade", "_blank")}
            >
              <BookHeart className="mr-2 h-4 w-4" /> Conhecer Diário
            </Button>
          </div>
        </div>
        
        <div className="bg-white border border-maternal-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="h-64 overflow-hidden">
            <img 
              src="/lovable-uploads/fd7784b0-3d05-498e-a352-ea4c018d70b4.png" 
              alt="Introdução do eBook de Afirmações Positivas" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <h3 className="text-xl font-semibold text-maternal-800 mb-1">Afirmações para um Parto Positivo</h3>
            <p className="text-maternal-600 text-sm mb-3">64 afirmações poderosas</p>
            <p className="text-maternal-700 mb-4 text-sm">
              eBook com 64 afirmações poderosas para nutrir sua confiança ao longo da gestação, trazer leveza ao momento do nascimento e fortalecer sua conexão com seu bebê. Deixe que essas palavras te guiem em cada etapa dessa experiência única.
            </p>
            <Button 
              variant="resource"
              className="w-full"
              onClick={() => window.open("https://www.energiamaterna.com.br/especiais/afirmacoes-para-um-parto-positivo", "_blank")}
            >
              <BookOpen className="mr-2 h-4 w-4" /> Obter eBook
            </Button>
          </div>
        </div>
        
        <div className="bg-white border border-maternal-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="h-64 overflow-hidden">
            <img 
              src="/lovable-uploads/88664f99-92f8-4a42-b203-a96d63ecbe3d.png" 
              alt="Capa do Caderno de Bem-Estar" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <h3 className="text-xl font-semibold text-maternal-800 mb-1">Caderno de Bem-Estar</h3>
            <p className="text-maternal-600 text-sm mb-3">Seu refúgio para autocuidado</p>
            <p className="text-maternal-700 mb-4 text-sm">
              Este caderno foi pensado para ser seu refúgio: um espaço para se expressar, aliviar a mente e reencontrar seu equilíbrio. Cuide de você, porque estar bem consigo mesma é vital para cuidar de quem ama.
            </p>
            <Button 
              variant="resource"
              className="w-full"
              onClick={() => window.open("https://www.energiamaterna.com.br/especiais/caderno-de-bem-estar", "_blank")}
            >
              <Notebook className="mr-2 h-4 w-4" /> Adquirir Caderno
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
