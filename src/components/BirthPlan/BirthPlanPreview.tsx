
import { PreviewHeader } from './preview/PreviewHeader';
import { PreviewSection } from './preview/PreviewSection';
import { SignatureSection } from './preview/SignatureSection';
import { PreviewFooter } from './preview/PreviewFooter';
import { PrintTitle } from './preview/PrintTitle';
import { PrintFooter } from './preview/PrintFooter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { birthPlanSections } from './utils/birthPlanSections';
import { BirthPlanData } from './types/questionnaire';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect } from 'react';

interface BirthPlanPreviewProps {
  birthPlan: BirthPlanData;
  onEdit: () => void;
  onNext: () => void;
}

export function BirthPlanPreview({ birthPlan, onEdit, onNext }: BirthPlanPreviewProps) {
  const isMobile = useIsMobile();
  
  // Debug log to check if birth plan data is available
  console.log("Birth plan data in Preview component:", birthPlan);
  
  const personalInfo = birthPlan.personalInfo || {};
  
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  // Group professional information for more compact display
  const renderProfessionalInfo = (info: Record<string, any>) => {
    return (
      <div className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-maternal-50">
                <th className="text-left px-3 py-2 border border-maternal-200">Profissional</th>
                <th className="text-left px-3 py-2 border border-maternal-200">Nome</th>
                <th className="text-left px-3 py-2 border border-maternal-200">Contato</th>
                <th className="text-left px-3 py-2 border border-maternal-200">Registro</th>
              </tr>
            </thead>
            <tbody>
              {info.healthProvider && (
                <tr>
                  <td className="px-3 py-2 border border-maternal-200 font-medium">Obstetra</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.healthProvider}</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.healthProviderContact || "-"}</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.healthProviderRegistry || "-"}</td>
                </tr>
              )}
              {info.pediatrician && (
                <tr>
                  <td className="px-3 py-2 border border-maternal-200 font-medium">Pediatra</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.pediatrician}</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.pediatricianContact || "-"}</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.pediatricianRegistry || "-"}</td>
                </tr>
              )}
              {info.doula && (
                <tr>
                  <td className="px-3 py-2 border border-maternal-200 font-medium">Doula</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.doula}</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.doulaContact || "-"}</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.doulaRegistry || "-"}</td>
                </tr>
              )}
              {info.midwife && (
                <tr>
                  <td className="px-3 py-2 border border-maternal-200 font-medium">Parteira</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.midwife}</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.midwifeContact || "-"}</td>
                  <td className="px-3 py-2 border border-maternal-200">{info.midwifeRegistry || "-"}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  return (
    <div className="animate-fade-in">
      <PreviewHeader title="Visualização do Plano de Parto" birthPlan={birthPlan} />
      
      <div 
        id="birth-plan-preview" 
        className="bg-white border border-gray-200 rounded-lg p-4 md:p-6 print:p-0 print:border-0 print:shadow-none"
      >
        <PrintTitle personName={personalInfo.name} />
        
        <div className="print:hidden">
          <p className={`${isMobile ? 'text-base' : 'text-lg'} mb-4 md:mb-6`}>
            Esta é a versão final do seu plano de parto. Revise cuidadosamente todas as seções
            e verifique se estão de acordo com seus desejos e necessidades.
          </p>
          
          {/* Alert with disclaimer - Visible only on screen, not in print */}
          <div className="bg-maternal-50 p-3 md:p-4 rounded-lg border-l-4 border-maternal-400 my-4 md:my-6">
            <p className="font-medium text-maternal-900 text-sm md:text-base">
              Este documento reflete minhas preferências para o parto e nascimento do meu bebê. Ele foi elaborado após 
              cuidadosa pesquisa e reflexão, em colaboração com meu parceiro e equipe de saúde. Compreendo que 
              situações imprevistas podem surgir durante o trabalho de parto, e que a saúde e bem-estar do 
              bebê e meu são prioridade. Peço gentilmente que, na ausência de emergências médicas, minhas 
              escolhas sejam respeitadas, e que quaisquer intervenções necessárias sejam discutidas comigo 
              antes de serem realizadas.
            </p>
          </div>
        </div>
        
        {/* Personal information section with compact professional info */}
        <div className="mb-8 print:mb-6">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">Informações Pessoais</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalInfo.name && (
              <div>
                <p className="font-medium">Nome:</p>
                <p>{personalInfo.name}</p>
              </div>
            )}
            
            {personalInfo.dueDate && (
              <div>
                <p className="font-medium">Data Prevista para o Parto:</p>
                <p>{personalInfo.dueDate}</p>
              </div>
            )}
            
            {personalInfo.birthLocation && (
              <div>
                <p className="font-medium">Local do Parto:</p>
                <p>{personalInfo.birthLocation}</p>
              </div>
            )}
            
            {personalInfo.hospital && (
              <div className="md:col-span-2">
                <p className="font-medium">Hospital:</p>
                <p>{personalInfo.hospital}</p>
                {personalInfo.hospitalAddress && (
                  <p className="text-sm text-gray-600">Endereço: {personalInfo.hospitalAddress}</p>
                )}
                {personalInfo.hospitalPhone && (
                  <p className="text-sm text-gray-600">Telefone: {personalInfo.hospitalPhone}</p>
                )}
              </div>
            )}
            
            {personalInfo.companions && (
              <div className="md:col-span-2">
                <p className="font-medium">Acompanhantes:</p>
                <p>{personalInfo.companions}</p>
              </div>
            )}
          </div>
          
          {/* Healthcare professionals table */}
          {(personalInfo.healthProvider || personalInfo.pediatrician || personalInfo.doula || personalInfo.midwife) && (
            <>
              <h3 className="text-lg font-medium mt-6 mb-3">Equipe de Saúde</h3>
              {renderProfessionalInfo(personalInfo)}
            </>
          )}
        </div>
        
        {/* All other sections */}
        {birthPlanSections
          .filter(section => section.id !== 'personalInfo')
          .map(section => (
            <PreviewSection 
              key={section.id}
              title={section.title} 
              sectionData={birthPlan[section.id] || {}}
              sectionId={section.id}
              fields={section.fields}
            />
          ))
        }
        
        {/* Signature section */}
        <SignatureSection personalInfo={birthPlan.personalInfo || {}} />
        
        {/* Footer only visible in print */}
        <PrintFooter />
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6 md:mt-8 print:hidden">
        <Button 
          variant="outline"
          onClick={onEdit}
          className="flex items-center justify-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar e Editar
        </Button>
        
        <Button 
          onClick={onNext}
          className="flex items-center justify-center bg-maternal-600 hover:bg-maternal-700"
        >
          Compartilhar <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
