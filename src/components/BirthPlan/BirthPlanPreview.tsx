
import { birthPlanSections } from './utils/birthPlanSections';
import { BackToTopButton } from './common/BackToTopButton';
import { PreviewHeader } from './preview/PreviewHeader';
import { PrintTitle } from './preview/PrintTitle';
import { PreviewSection } from './preview/PreviewSection';
import { SignatureSection } from './preview/SignatureSection';
import { PrintFooter } from './preview/PrintFooter';
import { InfoAlert } from './preview/InfoAlert';
import { PreviewFooter } from './preview/PreviewFooter';

interface BirthPlanPreviewProps {
  birthPlan: Record<string, any>;
  onEdit: () => void;
  onNext: () => void;
}

export function BirthPlanPreview({ birthPlan, onEdit, onNext }: BirthPlanPreviewProps) {
  // Get personal info for the signature section
  const personalInfo = birthPlan.personalInfo || {};
  
  return (
    <div className="animate-fade-in">
      <div className="print:hidden">
        <PreviewHeader title="Visualização do Plano de Parto" />
      </div>
      
      <PrintTitle />
      
      <div id="birth-plan-preview" className="bg-white border border-gray-200 rounded-lg p-6 print:p-0 print:border-0">
        {birthPlanSections.map((section) => (
          <PreviewSection
            key={section.id}
            sectionId={section.id}
            title={section.title}
            fields={section.fields}
            sectionData={birthPlan[section.id] || {}}
          />
        ))}
        
        <SignatureSection personalInfo={personalInfo} />
      </div>
      
      <PrintFooter />
      
      <div className="print:hidden info-alert">
        <InfoAlert />
      </div>
      <div className="print:hidden preview-footer">
        <PreviewFooter onEdit={onEdit} onNext={onNext} />
      </div>
      
      <BackToTopButton />
    </div>
  );
}
