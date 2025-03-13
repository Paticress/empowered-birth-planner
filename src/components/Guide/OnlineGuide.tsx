
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { CheckCircle, FileText, MessageCircle, ClipboardList, BookOpen, ArrowLeft, ChevronRight } from 'lucide-react';
import { GuideIntroduction } from './GuideIntroduction';
import { GuideStructure } from './GuideStructure';
import { GuideRights } from './GuideRights';
import { GuideCommunication } from './GuideCommunication';
import { GuideChecklist } from './GuideChecklist';
import { Footer } from '@/components/Footer';

export function OnlineGuide() {
  const [activeTab, setActiveTab] = useState("introduction");
  
  const handleNextSection = (next: string) => {
    setActiveTab(next);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-maternal-50 min-h-screen">
      <header className="bg-maternal-600 text-white py-4 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6" />
            <h1 className="text-xl font-bold">Guia do Plano de Parto</h1>
          </div>
          <Button variant="outline" className="text-white border-white hover:bg-maternal-500">
            <a href="/plano-personalizado">Modelo Personalizado</a>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full mb-8 bg-white shadow-sm">
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
                <GuideChecklist onPrevious={() => handleNextSection("communication")} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
        
        <div className="flex justify-between items-center mt-8 mb-16">
          {activeTab !== "introduction" ? (
            <Button 
              variant="outline" 
              className="flex items-center" 
              onClick={() => {
                const tabs = ["introduction", "structure", "rights", "communication", "checklist"];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                  scrollToTop();
                }
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
            </Button>
          ) : (
            <div></div>
          )}
          
          {activeTab !== "checklist" ? (
            <Button 
              className="bg-maternal-600 hover:bg-maternal-700 flex items-center ml-auto" 
              onClick={() => {
                const tabs = ["introduction", "structure", "rights", "communication", "checklist"];
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1]);
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
