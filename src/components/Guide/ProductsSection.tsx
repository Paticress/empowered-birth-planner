
import { BookHeart, BookOpen, Notebook } from 'lucide-react';
import { ProductCard } from './ProductCard';

export function ProductsSection() {
  return (
    <>
      <h2 className="text-2xl font-semibold text-maternal-800 mt-10 mb-6">Produtos para sua Jornada Materna</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <ProductCard
          title="Meu Diário da Maternidade"
          subtitle="Registre memórias e sentimentos"
          description="Este diário foi criado para você registrar suas memórias, sentimentos e aprendizados, criando uma lembrança afetiva desse período tão especial. Escreva, reflita e celebre cada passo do seu caminho."
          buttonText="Conhecer Diário"
          buttonIcon={<BookHeart className="mr-2 h-4 w-4" />}
          url="https://www.energiamaterna.com.br/especiais/diario-da-maternidade"
          imageSrc="/lovable-uploads/6b2f6105-ec41-413d-bd52-f974c7aba5ce.png"
          imageAlt="Capa do Diário da Maternidade"
        />
        
        <ProductCard
          title="Afirmações para um Parto Positivo"
          subtitle="64 afirmações poderosas"
          description="eBook com 64 afirmações poderosas para nutrir sua confiança ao longo da gestação, trazer leveza ao momento do nascimento e fortalecer sua conexão com seu bebê. Deixe que essas palavras te guiem em cada etapa dessa experiência única."
          buttonText="Obter eBook"
          buttonIcon={<BookOpen className="mr-2 h-4 w-4" />}
          url="https://www.energiamaterna.com.br/especiais/afirmacoes-para-um-parto-positivo"
          imageSrc="/lovable-uploads/fd7784b0-3d05-498e-a352-ea4c018d70b4.png"
          imageAlt="Introdução do eBook de Afirmações Positivas"
        />
        
        <ProductCard
          title="Caderno de Bem-Estar"
          subtitle="Seu refúgio para autocuidado"
          description="Este caderno foi pensado para ser seu refúgio: um espaço para se expressar, aliviar a mente e reencontrar seu equilíbrio. Cuide de você, porque estar bem consigo mesma é vital para cuidar de quem ama."
          buttonText="Adquirir Caderno"
          buttonIcon={<Notebook className="mr-2 h-4 w-4" />}
          url="https://www.energiamaterna.com.br/especiais/caderno-de-bem-estar"
          imageSrc="/lovable-uploads/88664f99-92f8-4a42-b203-a96d63ecbe3d.png"
          imageAlt="Capa do Caderno de Bem-Estar"
        />
      </div>
    </>
  );
}
