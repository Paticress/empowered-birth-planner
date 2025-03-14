
import { BookOpen, FileText, MessageCircle, ClipboardList, CheckCircle, BookMarked } from 'lucide-react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type GuideTabsProps = {
  activeTab: string;
  onChange: (value: string) => void;
};

export function GuideTabs({ activeTab, onChange }: GuideTabsProps) {
  return (
    <TabsList 
      className="grid grid-cols-2 md:grid-cols-6 w-full mb-8 bg-white shadow-sm print:hidden"
      aria-label="Seções do Guia do Plano de Parto"
    >
      <TabsTrigger 
        value="introduction" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("introduction")}
        id="tab-introduction"
        aria-selected={activeTab === "introduction"}
        aria-controls="panel-introduction"
      >
        <span className="flex flex-col md:flex-row items-center">
          <BookOpen className="h-5 w-5 md:mr-2" aria-hidden="true" />
          <span className="text-xs md:text-sm">Introdução</span>
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="structure" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("structure")}
        id="tab-structure"
        aria-selected={activeTab === "structure"}
        aria-controls="panel-structure"
      >
        <span className="flex flex-col md:flex-row items-center">
          <FileText className="h-5 w-5 md:mr-2" aria-hidden="true" />
          <span className="text-xs md:text-sm">Estrutura</span>
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="rights" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("rights")}
        id="tab-rights"
        aria-selected={activeTab === "rights"}
        aria-controls="panel-rights"
      >
        <span className="flex flex-col md:flex-row items-center">
          <CheckCircle className="h-5 w-5 md:mr-2" aria-hidden="true" />
          <span className="text-xs md:text-sm">Direitos</span>
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="communication" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("communication")}
        id="tab-communication"
        aria-selected={activeTab === "communication"}
        aria-controls="panel-communication"
      >
        <span className="flex flex-col md:flex-row items-center">
          <MessageCircle className="h-5 w-5 md:mr-2" aria-hidden="true" />
          <span className="text-xs md:text-sm">Comunicação</span>
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="checklist" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("checklist")}
        id="tab-checklist"
        aria-selected={activeTab === "checklist"}
        aria-controls="panel-checklist"
      >
        <span className="flex flex-col md:flex-row items-center">
          <ClipboardList className="h-5 w-5 md:mr-2" aria-hidden="true" />
          <span className="text-xs md:text-sm">Checklist</span>
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="resources" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("resources")}
        id="tab-resources"
        aria-selected={activeTab === "resources"}
        aria-controls="panel-resources"
      >
        <span className="flex flex-col md:flex-row items-center">
          <BookMarked className="h-5 w-5 md:mr-2" aria-hidden="true" />
          <span className="text-xs md:text-sm">Recursos</span>
        </span>
      </TabsTrigger>
    </TabsList>
  );
}
