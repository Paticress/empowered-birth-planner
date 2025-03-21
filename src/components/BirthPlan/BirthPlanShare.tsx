
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EmailShareDialog } from './EmailShareDialog';
import { NextSteps } from './share/NextSteps';
import { ShareOptionsGrid } from './share/ShareOptionsGrid';
import { useExportHandlers } from './share/ExportHandlers';
import { renderBirthPlanForExport } from './utils/export';

interface BirthPlanShareProps {
  birthPlan: Record<string, any>;
  onEdit: () => void;
}

export function BirthPlanShare({ birthPlan, onEdit }: BirthPlanShareProps) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  // Debug log to check birth plan data
  console.log("Birth plan data in Share component:", birthPlan);
  
  // Get all export handlers
  const {
    handleCopyText,
    handleExportPDF,
    handleExportWord,
    handleExportText,
    handleShareViaWhatsApp
  } = useExportHandlers(birthPlan);
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-6">Compartilhe seu Plano de Parto</h1>
      
      <div className="prose max-w-none mb-8">
        <p className="text-lg">
          Seu plano de parto está pronto! Agora você pode compartilhá-lo com sua equipe médica, 
          familiares ou outros cuidadores que estarão envolvidos no nascimento do seu bebê.
        </p>
        
        <div className="bg-maternal-50 p-4 rounded-lg border-l-4 border-maternal-400 my-6">
          <p className="font-medium text-maternal-900 mb-0">
            <strong>Dica:</strong> Exporte seu plano de parto como documento Word para poder editá-lo 
            conforme suas necessidades específicas antes de compartilhar com sua equipe médica.
          </p>
        </div>
      </div>
      
      {/* Hidden container for document generation */}
      <div id="birth-plan-content" className="hidden">
        {/* Content will be dynamically generated before export */}
      </div>
      
      {/* Share options grid */}
      <ShareOptionsGrid 
        onCopyText={handleCopyText}
        onExportWord={handleExportWord}
        onShareWhatsApp={handleShareViaWhatsApp}
        onOpenEmailDialog={() => setEmailDialogOpen(true)}
      />
      
      {/* Next steps section */}
      <NextSteps />
      
      {/* Back button */}
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline"
          onClick={onEdit}
          className="flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar e Editar
        </Button>
      </div>
      
      {/* Email Dialog */}
      <EmailShareDialog 
        open={emailDialogOpen} 
        onOpenChange={setEmailDialogOpen} 
        onExportPDF={handleExportWord} // Using Word export here
      />
    </div>
  );
}
