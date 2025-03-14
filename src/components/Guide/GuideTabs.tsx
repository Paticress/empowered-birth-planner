
import { BookOpen, FileText, MessageCircle, ClipboardList, CheckCircle } from 'lucide-react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

type GuideTabsProps = {
  activeTab: string;
  onChange: (value: string) => void;
};

export function GuideTabs({ activeTab, onChange }: GuideTabsProps) {
  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-6 w-full mb-8 bg-white shadow-sm print:hidden">
      <TabsTrigger 
        value="introduction" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("introduction")}
      >
        <span className="flex flex-col md:flex-row items-center">
          <BookOpen className="h-5 w-5 md:mr-2" />
          <span className="text-xs md:text-sm">Introdução</span>
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="structure" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("structure")}
      >
        <span className="flex flex-col md:flex-row items-center">
          <FileText className="h-5 w-5 md:mr-2" />
          <span className="text-xs md:text-sm">Estrutura</span>
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="rights" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("rights")}
      >
        <span className="flex flex-col md:flex-row items-center">
          <CheckCircle className="h-5 w-5 md:mr-2" />
          <span className="text-xs md:text-sm">Direitos</span>
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="communication" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("communication")}
      >
        <span className="flex flex-col md:flex-row items-center">
          <MessageCircle className="h-5 w-5 md:mr-2" />
          <span className="text-xs md:text-sm">Comunicação</span>
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="checklist" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("checklist")}
      >
        <span className="flex flex-col md:flex-row items-center">
          <ClipboardList className="h-5 w-5 md:mr-2" />
          <span className="text-xs md:text-sm">Checklist</span>
        </span>
      </TabsTrigger>
      <TabsTrigger 
        value="resources" 
        className="px-2 md:px-3 data-[state=active]:bg-brand-gold data-[state=active]:text-white text-brand-dark-gray"
        onClick={() => onChange("resources")}
      >
        <span className="flex flex-col md:flex-row items-center">
          <BookOpen className="h-5 w-5 md:mr-2" />
          <span className="text-xs md:text-sm">Recursos</span>
        </span>
      </TabsTrigger>
    </TabsList>
  );
}
