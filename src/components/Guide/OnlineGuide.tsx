
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, MessageCircle, ClipboardList, BookOpen, ArrowLeft, ChevronRight, Download, Printer, Share2 } from 'lucide-react';
import { GuideIntroduction } from './GuideIntroduction';
import { GuideStructure } from './GuideStructure';
import { GuideRights } from './GuideRights';
import { GuideCommunication } from './GuideCommunication';
import { GuideChecklist } from './GuideChecklist';
import { GuideResources } from './GuideResources';
import { Footer } from '@/components/Footer';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

export function OnlineGuide() {
  const [activeTab, setActiveTab] = useState("introduction");
  const [progress, setProgress] = useState(0);
  
  const tabs = ["introduction", "structure", "rights", "communication", "checklist", "resources"];
  
  const handleNextSection = (next: string) => {
    setActiveTab(next);
    updateProgress(next);
  };

  const updateProgress = (tab: string) => {
    const currentIndex = tabs.indexOf(tab);
    const progressPercentage = ((currentIndex + 1) / tabs.length) * 100;
    setProgress(progressPercentage);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handlePrint = () => {
    window.print();
    toast({
      title: "Preparando para impressão",
      description: "Seu guia completo está sendo preparado para impressão.",
    });
  };
  
  const handleDownload = () => {
    toast({
      title: "Download Iniciado",
      description: "Seu guia completo está sendo baixado.",
    });
    
    // In a real application, this would trigger a PDF download
    setTimeout(() => {
      window.open('/guia-plano-parto-humanizado.pdf', '_blank');
    }, 1500);
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Guia do Plano de Parto',
        text: 'Confira este guia completo para criar seu plano de parto!',
        url: window.location.href,
      })
      .catch((error) => console.log('Erro ao compartilhar', error));
    } else {
      // Fallback for browsers that don't support Web Share API
      toast({
        title: "Link Copiado!",
        description: "O link do guia foi copiado para a área de transferência.",
      });
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="bg-maternal-50 min-h-screen">
      <header className="bg-maternal-600 text-white py-4 px-4 sm:px-6 lg:px-8 shadow-md print:hidden">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-xl font-bold">Guia do Plano de Parto</h1>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" className="text-white border-white hover:bg-maternal-500" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" /> Imprimir
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-maternal-500" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" /> Download
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-maternal-500" onClick={handleShare}>
              <Share2 className="h-4 w-4 mr-2" /> Compartilhar
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 print:hidden">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-maternal-700">Seu progresso</span>
            <span className="text-sm font-medium text-maternal-700">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="mb-8 animate-fade-in print:block">
          <Tabs value={activeTab} onValueChange={(value) => {
            setActiveTab(value);
            updateProgress(value);
            scrollToTop();
          }} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full mb-8 bg-white shadow-sm print:hidden">
              <TabsTrigger value="introduction" className="px-2 md:px-3">
                <span className="flex flex-col md:flex-row items-center">
                  <BookOpen className="h-5 w-5 md:mr-2" />
                  <span className="text-xs md:text-sm">Introdução</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="structure" className="px-2 md:px-3">
                <span className="flex flex-col md:flex-row items-center">
                  <FileText className="h-5 w-5 md:mr-2" />
                  <span className="text-xs md:text-sm">Estrutura</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="rights" className="px-2 md:px-3">
                <span className="flex flex-col md:flex-row items-center">
                  <CheckCircle className="h-5 w-5 md:mr-2" />
                  <span className="text-xs md:text-sm">Direitos</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="communication" className="px-2 md:px-3">
                <span className="flex flex-col md:flex-row items-center">
                  <MessageCircle className="h-5 w-5 md:mr-2" />
                  <span className="text-xs md:text-sm">Comunicação</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="checklist" className="px-2 md:px-3">
                <span className="flex flex-col md:flex-row items-center">
                  <ClipboardList className="h-5 w-5 md:mr-2" />
                  <span className="text-xs md:text-sm">Checklist</span>
                </span>
              </TabsTrigger>
              <TabsTrigger value="resources" className="px-2 md:px-3">
                <span className="flex flex-col md:flex-row items-center">
                  <BookOpen className="h-5 w-5 md:mr-2" />
                  <span className="text-xs md:text-sm">Recursos</span>
                </span>
              </TabsTrigger>
            </TabsList>
            
            <div className="bg-white shadow-md rounded-lg p-6 md:p-8">
              <TabsContent value="introduction" className="mt-0">
                <GuideIntroduction onNext={() => handleNextSection("structure")} />
              </TabsContent>
              
              <TabsContent value="structure" className="mt-0">
                <GuideStructure 
                  onPrevious={() => handleNextSection("introduction")} 
                  onNext={() => handleNextSection("rights")} 
                />
              </TabsContent>
              
              <TabsContent value="rights" className="mt-0">
                <GuideRights 
                  onPrevious={() => handleNextSection("structure")} 
                  onNext={() => handleNextSection("communication")} 
                />
              </TabsContent>
              
              <TabsContent value="communication" className="mt-0">
                <GuideCommunication 
                  onPrevious={() => handleNextSection("rights")} 
                  onNext={() => handleNextSection("checklist")} 
                />
              </TabsContent>
              
              <TabsContent value="checklist" className="mt-0">
                <GuideChecklist
                  onPrevious={() => handleNextSection("communication")}
                  onNext={() => handleNextSection("resources")}
                />
              </TabsContent>
              
              <TabsContent value="resources" className="mt-0">
                <GuideResources
                  onPrevious={() => handleNextSection("checklist")}
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <div className="flex justify-between items-center mt-8 mb-16 print:hidden">
          {activeTab !== "introduction" ? (
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={() => {
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                  updateProgress(tabs[currentIndex - 1]);
                  scrollToTop();
                }
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
            </Button>
          ) : (
            <div></div>
          )}
          
          {activeTab !== "resources" ? (
            <Button 
              className="bg-maternal-600 hover:bg-maternal-700 flex items-center ml-auto" 
              onClick={() => {
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1]);
                  updateProgress(tabs[currentIndex + 1]);
                  scrollToTop();
                }
              }}
            >
              Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

