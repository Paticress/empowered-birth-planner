import { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function FAQ() {
  const [activeTab, setActiveTab] = useState("geral");
  
  // FAQ data organized by categories
  const faqData = {
    geral: [
      {
        question: "O que é a Energia Materna?",
        answer: "A Energia Materna é uma plataforma dedicada a apoiar gestantes em sua jornada para terem experiências de parto mais conscientes, respeitosas e transformadoras. Oferecemos recursos educacionais, guias, ferramentas entre outros recursos para ajudar no planejamento do parto e na reconexão com seu corpo, sua potência feminina, sua habilidade natural de dar a vida."
      },
      {
        question: "Como posso entrar em contato com a equipe da Energia Materna?",
        answer: "Você pode entrar em contato conosco através do e-mail juntas@energiamaterna.com.br ou através de nossas redes sociais (Instagram e Facebook)."
      },
      {
        question: "Os conteúdos da Energia Materna substituem orientações médicas?",
        answer: "Não. Nossos conteúdos são informativos e educacionais, mas não substituem orientações de profissionais de saúde. Sempre consulte seu médico ou equipe de saúde para decisões relacionadas à sua gestação e parto."
      }
    ],
    guia: [
      {
        question: "O que é o Guia do Parto Respeitoso?",
        answer: "O Guia do Parto Respeitoso é um recurso digital completo que fornece informações baseadas em evidências sobre gestação, trabalho de parto, direitos da gestante, procedimentos médicos e muito mais. É um guia educacional para ajudar gestantes a tomarem decisões informadas."
      },
      {
        question: "Como posso acessar o Guia Online?",
        answer: "Após a compra, você pode acessar o Guia Online através da página https://www.energiamaterna.com.br/acesse-guia-online-do-plano-de-parto no nosso site. O acesso é permanente e você pode consultar o conteúdo quantas vezes desejar."
      },
      {
        question: "O Guia Online é atualizado com frequência?",
        answer: "Sim, revisamos e atualizamos o conteúdo regularmente para garantir que as informações estejam em conformidade com as evidências científicas mais recentes e as melhores práticas em assistência obstétrica."
      }
    ],
    plano: [
      {
        question: "O que é um Plano de Parto?",
        answer: "Um Plano de Parto é um documento que expressa suas preferências, desejos e expectativas para o trabalho de parto, parto e pós-parto imediato. Ele serve como uma ferramenta de comunicação entre você e sua equipe de assistência."
      },
      {
        question: "Como funciona o Construtor de Plano de Parto?",
        answer: "Nosso Construtor de Plano de Parto é uma ferramenta interativa que, através de um questionário guiado com respostas prontas para você selecionar, ajuda você a criar um documento personalizado com suas preferências para o parto. O processo é dividido em seções temáticas e você pode editar livremente o conteúdo final."
      },
      {
        question: "Posso modificar meu Plano de Parto depois de criá-lo?",
        answer: "Sim, você pode editar seu Plano de Parto quantas vezes quiser. Seu plano ficará salvo na sua conta e você pode acessá-lo e modificá-lo até o momento do parto."
      },
      {
        question: "Como posso compartilhar meu Plano de Parto?",
        answer: "Após criar seu plano, você pode exportá-lo em formato PDF ou Word para imprimir ou enviar digitalmente para sua equipe de assistência, família e outras pessoas envolvidas no seu parto."
      }
    ],
    acessos: [
      {
        question: "Como faço para acessar a plataforma?",
        answer: "Na página de login, clique em 'Receber Link de Acesso' e siga as instruções enviadas ao seu e-mail para entrar na plataforma."
      },
      {
        question: "Por quanto tempo tenho acesso ao Construtor Virtual de Plano de Parto?",
        answer: "O acesso ao Construtor Virtual é válido por 9 meses, a partir da sua compra. Ao pagar por este acesso, você tem acesso vitalício ao Guia Online e ao Curso Gestando."
      },
      {
        question: "Posso acessar os produtos em diferentes dispositivos?",
        answer: "Sim, você pode acessar nossos produtos em qualquer dispositivo (computador, tablet ou smartphone) com acesso à internet, usando o mesmo login."
      }
    ]
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl font-bold text-maternal-900 mb-8 text-center">
            Perguntas Frequentes
          </h1>
          
          <p className="text-lg text-maternal-700 mb-10 text-center">
            Encontre respostas para as dúvidas mais comuns sobre nossos produtos e serviços.
          </p>
          
          <Tabs defaultValue="geral" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
              <TabsTrigger value="geral" className="text-sm md:text-base">Geral</TabsTrigger>
              <TabsTrigger value="guia" className="text-sm md:text-base">Guia Online</TabsTrigger>
              <TabsTrigger value="plano" className="text-sm md:text-base">Plano de Parto</TabsTrigger>
              <TabsTrigger value="acessos" className="text-sm md:text-base">Acessos</TabsTrigger>
            </TabsList>
            
            {Object.entries(faqData).map(([category, questions]) => (
              <TabsContent key={category} value={category} className="mt-6">
                <Accordion type="single" collapsible className="w-full">
                  {questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium text-maternal-900">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-maternal-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
          
          <div className="mt-16 p-6 bg-maternal-50 rounded-lg border border-maternal-100">
            <h2 className="text-xl font-semibold text-maternal-900 mb-4">
              Não encontrou sua pergunta?
            </h2>
            <p className="text-maternal-700 mb-4">
              Entre em contato conosco e ficaremos felizes em ajudar.
            </p>
            <a 
              href="mailto:contato@energiamaterna.com.br" 
              className="inline-flex items-center text-maternal-600 hover:text-maternal-800 font-medium"
            >
              contato@energiamaterna.com.br
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
