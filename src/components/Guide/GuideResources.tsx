
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, Download, FileText, ExternalLink, BookHeart, Notebook, Calendar, ShoppingCart, Check, AlertTriangle, Info } from 'lucide-react';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GuideResourcesProps {
  onPrevious: () => void;
}

export function GuideResources({ onPrevious }: GuideResourcesProps) {
  const [activeResource, setActiveResource] = useState<string | null>(null);
  const [showProceduresGuide, setShowProceduresGuide] = useState(false);

  const handleResourceClick = (resource: string) => {
    if (resource === 'checklist') {
      setShowProceduresGuide(!showProceduresGuide);
    } else {
      setActiveResource(resource === activeResource ? null : resource);
    }
  };

  const handleDownload = (resourceName: string) => {
    toast({
      title: "Download Iniciado",
      description: `O recurso "${resourceName}" está sendo baixado.`,
    });
    
    // In a real application, this would trigger an actual download
    setTimeout(() => {
      toast({
        title: "Download Concluído",
        description: "O arquivo foi baixado com sucesso.",
      });
    }, 1500);
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Recursos Adicionais</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Confira estes recursos adicionais para aprofundar ainda mais seus conhecimentos sobre o plano de parto e garantir uma experiência de parto positiva e respeitosa.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div 
            className={`resource-card p-6 rounded-lg border border-maternal-200 cursor-pointer transition-all duration-300 ${activeResource === 'template' ? 'bg-maternal-50 shadow-md' : 'bg-white hover:shadow-sm'}`}
            onClick={() => handleResourceClick('template')}
          >
            <div className="flex items-center mb-4">
              <div className="bg-maternal-100 p-3 rounded-full mr-4">
                <FileText className="h-6 w-6 text-maternal-600" />
              </div>
              <h3 className="text-xl font-medium text-maternal-800">Modelo de Plano de Parto</h3>
            </div>
            
            <p className="text-maternal-700 mb-3">
              Um modelo pronto para usar como base para o seu plano de parto, já estruturado com todas as seções importantes.
            </p>
            
            <div className="mt-4">
              <Button 
                className="w-full bg-maternal-600 hover:bg-maternal-700"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open('https://www.energiamaterna.com.br/challenge-page/personalize-seu-plano-de-parto', '_blank');
                }}
              >
                <ShoppingCart className="mr-2 h-4 w-4" /> Adquirir Modelo
              </Button>
            </div>
          </div>
          
          <div 
            className={`resource-card p-6 rounded-lg border border-maternal-200 cursor-pointer transition-all duration-300 ${activeResource === 'checklist' ? 'bg-maternal-50 shadow-md' : 'bg-white hover:shadow-sm'}`}
            onClick={() => handleResourceClick('checklist')}
          >
            <div className="flex items-center mb-4">
              <div className="bg-maternal-100 p-3 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-maternal-600" />
              </div>
              <h3 className="text-xl font-medium text-maternal-800">Guia de Procedimentos</h3>
            </div>
            
            <p className="text-maternal-700 mb-3">
              Glossário com explicações sobre os procedimentos mais comuns do parto, para você entender melhor suas opções.
            </p>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload('Guia de Procedimentos');
                  setShowProceduresGuide(true);
                }}
              >
                <Download className="mr-2 h-4 w-4" /> Baixar Guia
              </Button>
            </div>
          </div>
        </div>
        
        {/* Exibição do Guia de Procedimentos quando clicado */}
        {showProceduresGuide && (
          <div className="bg-white p-6 rounded-lg border border-maternal-200 mb-8 animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-maternal-800">Guia de Procedimentos no Parto</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowProceduresGuide(false)}
              >
                Fechar
              </Button>
            </div>
            
            <p className="text-maternal-700 mb-6">
              Este guia explica os procedimentos comuns durante o trabalho de parto e nascimento, 
              ajudando você a entender melhor suas opções e tomar decisões informadas para seu plano de parto.
            </p>
            
            <div className="space-y-6">
              <div className="border-l-4 border-maternal-300 pl-4">
                <h3 className="text-xl font-medium text-maternal-800 mb-2">Monitoramento Fetal</h3>
                <p className="text-maternal-700 mb-2">
                  O monitoramento fetal verifica os batimentos cardíacos do bebê durante o trabalho de parto.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="bg-maternal-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <div className="bg-maternal-100 p-2 rounded-full mr-3 mt-1">
                        <Info className="h-4 w-4 text-maternal-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-maternal-800">Monitoramento Intermitente</h4>
                        <p className="text-sm text-maternal-700">
                          Permite maior liberdade de movimento. O profissional checa os batimentos em intervalos regulares.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-maternal-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <div className="bg-maternal-100 p-2 rounded-full mr-3 mt-1">
                        <Info className="h-4 w-4 text-maternal-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-maternal-800">Monitoramento Contínuo</h4>
                        <p className="text-sm text-maternal-700">
                          Registro contínuo dos batimentos cardíacos e contrações. Pode limitar a movimentação.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-maternal-300 pl-4">
                <h3 className="text-xl font-medium text-maternal-800 mb-2">Manejo da Dor</h3>
                <p className="text-maternal-700 mb-2">
                  Existem diferentes métodos para alívio da dor durante o trabalho de parto.
                </p>
                <div className="space-y-3 mt-3">
                  <div className="bg-maternal-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <div className="bg-maternal-100 p-2 rounded-full mr-3 mt-1">
                        <Check className="h-4 w-4 text-maternal-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-maternal-800">Métodos Não-Farmacológicos</h4>
                        <p className="text-sm text-maternal-700">
                          Técnicas como respiração, banho morno, massagem, bola de parto, mudanças de posição e hipnose. 
                          Não causam efeitos colaterais e permitem maior mobilidade.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-maternal-50 p-3 rounded-md">
                    <div className="flex items-start">
                      <div className="bg-maternal-100 p-2 rounded-full mr-3 mt-1">
                        <Info className="h-4 w-4 text-maternal-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-maternal-800">Analgesia Farmacológica</h4>
                        <p className="text-sm text-maternal-700">
                          A analgesia peridural é comum e administrada por anestesista. Bloqueia a sensação de dor, 
                          mas pode limitar a mobilidade e, em alguns casos, prolongar o segundo estágio do trabalho de parto.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-maternal-300 pl-4">
                <h3 className="text-xl font-medium text-maternal-800 mb-2">Episiotomia</h3>
                <p className="text-maternal-700 mb-2">
                  Corte cirúrgico realizado no períneo para ampliar o canal de parto.
                </p>
                <div className="bg-maternal-50 p-3 rounded-md mt-3">
                  <div className="flex items-start">
                    <div className="bg-maternal-100 p-2 rounded-full mr-3 mt-1">
                      <AlertTriangle className="h-4 w-4 text-maternal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-maternal-700">
                        A OMS não recomenda o uso rotineiro de episiotomia. Estudos mostram que o procedimento 
                        pode causar mais dor, risco de infecção e traumatismo do que um rompimento natural. 
                        Quando necessária, deve ser feita com consentimento informado.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-maternal-300 pl-4">
                <h3 className="text-xl font-medium text-maternal-800 mb-2">Indução do Parto</h3>
                <p className="text-maternal-700 mb-2">
                  Procedimento para iniciar artificialmente o trabalho de parto.
                </p>
                <div className="bg-maternal-50 p-3 rounded-md mt-3">
                  <div className="flex items-start">
                    <div className="bg-maternal-100 p-2 rounded-full mr-3 mt-1">
                      <Info className="h-4 w-4 text-maternal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-maternal-700">
                        Pode ser realizada por diversos métodos, como administração de ocitocina sintética, 
                        ruptura artificial da bolsa ou uso de prostaglandinas. Geralmente indicada quando há 
                        riscos para a mãe ou bebê na continuação da gravidez.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-maternal-300 pl-4">
                <h3 className="text-xl font-medium text-maternal-800 mb-2">Cesárea</h3>
                <p className="text-maternal-700 mb-2">
                  Cirurgia para extração do bebê através de uma incisão no abdômen e útero.
                </p>
                <div className="bg-maternal-50 p-3 rounded-md mt-3">
                  <div className="flex items-start">
                    <div className="bg-maternal-100 p-2 rounded-full mr-3 mt-1">
                      <Info className="h-4 w-4 text-maternal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-maternal-700">
                        Recomendada apenas quando há indicações médicas específicas. É considerada uma cirurgia 
                        de grande porte com tempo de recuperação maior. Se necessária, você pode discutir opções 
                        como cesárea humanizada, com o bebê colocado imediatamente em contato pele a pele.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-maternal-300 pl-4">
                <h3 className="text-xl font-medium text-maternal-800 mb-2">Clampeamento do Cordão</h3>
                <p className="text-maternal-700 mb-2">
                  Momento em que o cordão umbilical é pinçado e cortado após o nascimento.
                </p>
                <div className="bg-maternal-50 p-3 rounded-md mt-3">
                  <div className="flex items-start">
                    <div className="bg-maternal-100 p-2 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-maternal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-maternal-700">
                        O clampeamento tardio (após 1-5 minutos do nascimento ou quando o cordão parar de pulsar) 
                        é recomendado pela OMS por beneficiar o bebê com maior volume sanguíneo e reservas de ferro. 
                        O clampeamento imediato pode ser necessário em algumas situações específicas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-l-4 border-maternal-300 pl-4">
                <h3 className="text-xl font-medium text-maternal-800 mb-2">Contato Pele a Pele</h3>
                <p className="text-maternal-700 mb-2">
                  Colocação do recém-nascido diretamente sobre o corpo da mãe após o nascimento.
                </p>
                <div className="bg-maternal-50 p-3 rounded-md mt-3">
                  <div className="flex items-start">
                    <div className="bg-maternal-100 p-2 rounded-full mr-3 mt-1">
                      <Check className="h-4 w-4 text-maternal-600" />
                    </div>
                    <div>
                      <p className="text-sm text-maternal-700">
                        Recomendado pela OMS, favorece o vínculo mãe-bebê, regulação da temperatura, 
                        início da amamentação e redução do estresse do bebê. A maioria dos procedimentos 
                        de rotina pode ser realizada enquanto o bebê está em contato pele a pele.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6 text-maternal-700 text-sm">
              <p>
                <strong>Observação:</strong> Este é um guia informativo simplificado. Converse sempre com sua 
                equipe médica sobre suas preferências e possibilidades. Cada parto é único e pode requerer 
                adaptações com base nas circunstâncias específicas.
              </p>
            </div>
          </div>
        )}
        
        {/* Consulta Acolhedora - Adjusted from "Modelo Personalizado" */}
        <div className="bg-maternal-100 p-6 rounded-lg border-l-4 border-maternal-600 mb-8">
          <h3 className="text-xl font-semibold text-maternal-800 mb-3">Consulta Acolhedora</h3>
          <p className="text-maternal-700 mb-4">
            Um espaço acolhedor para tirar suas dúvidas sobre seu plano de parto com a fundadora do Energia Materna, que criou o modelo de plano de parto personalizado.
          </p>
          <p className="text-maternal-700 mb-4">
            Explore alternativas e receba orientação personalizada para ajustar o que for necessário, tornando seu Plano de Parto um documento ideal para a sua jornada.
          </p>
          <Button 
            className="bg-maternal-600 hover:bg-maternal-700"
            onClick={() => window.open('https://www.energiamaterna.com.br/service-page/consulta-acolhedora', '_blank')}
          >
            <Calendar className="mr-2 h-4 w-4" /> Agendar Consulta Acolhedora
          </Button>
        </div>
        
        {/* Updated section for other Energia Materna products */}
        <h2 className="text-2xl font-semibold text-maternal-800 mt-10 mb-6">Produtos para sua Jornada Materna</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-maternal-200 hover:border-maternal-300 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-maternal-800">Meu Diário da Maternidade</CardTitle>
              <CardDescription>Registre memórias e sentimentos</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-maternal-700 mb-4">
                Este diário foi criado para você registrar suas memórias, sentimentos e aprendizados, criando uma lembrança afetiva desse período tão especial. Escreva, reflita e celebre cada passo do seu caminho.
              </p>
              <Button 
                className="w-full bg-maternal-600 hover:bg-maternal-700"
                onClick={() => window.open('https://www.energiamaterna.com.br/especiais/diario-da-maternidade', '_blank')}
              >
                <BookHeart className="mr-2 h-4 w-4" /> Conhecer Diário
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-maternal-200 hover:border-maternal-300 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-maternal-800">Afirmações para um Parto Positivo</CardTitle>
              <CardDescription>64 afirmações poderosas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-maternal-700 mb-4">
                eBook com 64 afirmações poderosas para nutrir sua confiança ao longo da gestação, trazer leveza ao momento do nascimento e fortalecer sua conexão com seu bebê. Deixe que essas palavras te guiem em cada etapa dessa experiência única.
              </p>
              <Button 
                className="w-full bg-maternal-600 hover:bg-maternal-700"
                onClick={() => window.open('https://www.energiamaterna.com.br/especiais/afirmacoes-para-um-parto-positivo', '_blank')}
              >
                <BookOpen className="mr-2 h-4 w-4" /> Obter eBook
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-maternal-200 hover:border-maternal-300 transition-all duration-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-maternal-800">Caderno de Bem-Estar</CardTitle>
              <CardDescription>Seu refúgio para autocuidado</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-maternal-700 mb-4">
                Este caderno foi pensado para ser seu refúgio: um espaço para se expressar, aliviar a mente e reencontrar seu equilíbrio. Cuide de você, porque estar bem consigo mesma é vital para cuidar de quem ama.
              </p>
              <Button 
                className="w-full bg-maternal-600 hover:bg-maternal-700"
                onClick={() => window.open('https://www.energiamaterna.com.br/especiais/caderno-de-bem-estar', '_blank')}
              >
                <Notebook className="mr-2 h-4 w-4" /> Adquirir Caderno
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <h2 className="text-2xl font-semibold text-maternal-800 mt-10 mb-4">Próximos Passos</h2>
        
        <p className="mb-4">
          Agora que você conhece os elementos essenciais de um plano de parto, recomendamos:
        </p>
        
        <ol className="list-decimal pl-5 space-y-2 mb-6">
          <li>Baixe o modelo e comece a preencher seu plano de parto</li>
          <li>Converse com seu parceiro/acompanhante sobre suas preferências</li>
          <li>Discuta seu plano de parto com seu médico/obstetra na próxima consulta</li>
          <li>Faça ajustes conforme necessário após essa conversa</li>
          <li>Imprima várias cópias e leve para o hospital no dia do parto</li>
        </ol>
      </div>
      
      <div className="mt-8">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao Checklist
        </Button>
      </div>
    </div>
  );
}
