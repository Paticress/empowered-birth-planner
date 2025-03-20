
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Copy, Mail, Share2, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { ShareOption } from './ShareOption';
import { EmailShareDialog } from './EmailShareDialog';
import { createShareableText } from './utils/birthPlanUtils';
import { exportAsPDF, exportAsText, exportAsWord } from '@/utils/exportUtils';

interface BirthPlanShareProps {
  birthPlan: Record<string, any>;
  onEdit: () => void;
}

export function BirthPlanShare({ birthPlan, onEdit }: BirthPlanShareProps) {
  const [emailDialogOpen, setEmailDialogOpen] = useState(false);
  
  // Debug log to check birth plan data
  console.log("Birth plan data in Share component:", birthPlan);
  
  const handleCopyText = () => {
    const text = createShareableText(birthPlan);
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast("Seu plano de parto foi copiado e está pronto para ser compartilhado.");
      })
      .catch(() => {
        toast("Não foi possível copiar o texto para a área de transferência.");
      });
  };
  
  const handleExportPDF = () => {
    // First, render the birth plan content explicitly for PDF export
    renderBirthPlanForExport(birthPlan);
    
    // Then export it
    exportAsPDF('birth-plan-content', 'meu-plano-de-parto.pdf')
      .then(() => {
        toast("PDF gerado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao gerar PDF:", error);
        toast("Ocorreu um erro ao gerar o PDF. Por favor, tente exportar como documento Word.");
      });
  };
  
  const handleExportWord = () => {
    if (!birthPlan) {
      toast("Dados do plano de parto não disponíveis.");
      return;
    }
    
    // Ensure we have valid birth plan data before attempting export
    if (Object.keys(birthPlan).length === 0) {
      toast("Dados do plano de parto insuficientes para gerar um documento.");
      return;
    }
    
    exportAsWord(birthPlan, 'meu-plano-de-parto.docx')
      .then(() => {
        toast("Documento Word gerado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao gerar documento Word:", error);
        toast("Ocorreu um erro ao gerar o documento Word. Por favor, tente novamente.");
      });
  };
  
  const handleExportText = () => {
    // Render content before exporting
    renderBirthPlanForExport(birthPlan);
    
    exportAsText('birth-plan-content', 'meu-plano-de-parto.txt')
      .then(() => {
        toast("Arquivo de texto gerado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao gerar arquivo de texto:", error);
        toast("Ocorreu um erro ao gerar o arquivo de texto. Por favor, tente novamente.");
      });
  };
  
  const handleShareViaWhatsApp = () => {
    // Create a simple text message for WhatsApp with a mention of the already generated document
    const message = encodeURIComponent("Olá! Compartilho com você meu plano de parto. Acabei de gerar um documento editável.");
    const whatsappUrl = `https://wa.me/?text=${message}`;
    
    // First generate the Word document
    exportAsWord(birthPlan, 'meu-plano-de-parto.docx')
      .then(() => {
        // Then open WhatsApp
        window.open(whatsappUrl, '_blank');
        toast("Documento Word gerado e pronto para compartilhamento no WhatsApp.");
      })
      .catch((error) => {
        console.error("Erro ao exportar documento Word para WhatsApp:", error);
        toast("Não foi possível gerar o documento para compartilhamento.");
      });
  };
  
  // Function to properly render birth plan content for export
  const renderBirthPlanForExport = (birthPlanData: Record<string, any>) => {
    const container = document.getElementById('birth-plan-content');
    if (!container) return;
    
    // Clear previous content
    container.innerHTML = '';
    
    // Add title and introduction
    const titleContainer = document.createElement('div');
    titleContainer.className = 'flex justify-between items-center mb-4';
    
    const title = document.createElement('h1');
    title.className = 'text-2xl font-bold';
    title.textContent = 'PLANO DE PARTO';
    titleContainer.appendChild(title);
    
    const logo = document.createElement('img');
    logo.src = '/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png';
    logo.alt = 'Energia Materna';
    logo.className = 'h-12';
    titleContainer.appendChild(logo);
    container.appendChild(titleContainer);
    
    // Add the disclaimer
    const disclaimer = document.createElement('p');
    disclaimer.className = 'text-sm text-gray-700 mt-2 mb-6';
    disclaimer.textContent = 'Este documento reflete minhas preferências para o parto e nascimento do meu bebê. Ele foi elaborado após ' +
      'cuidadosa pesquisa e reflexão, em colaboração com meu parceiro e equipe de saúde. Compreendo que ' +
      'situações imprevistas podem surgir durante o trabalho de parto, e que a saúde e bem-estar do ' +
      'bebê e meu são prioridade. Peço gentilmente que, na ausência de emergências médicas, minhas ' +
      'escolhas sejam respeitadas, e que quaisquer intervenções necessárias sejam discutidas comigo ' +
      'antes de serem realizadas.';
    container.appendChild(disclaimer);
    
    // Add personal info section
    const personalInfo = birthPlanData.personalInfo || {};
    const personalSection = document.createElement('div');
    personalSection.className = 'mb-6';
    
    const personalTitle = document.createElement('h2');
    personalTitle.className = 'text-xl font-bold mb-2';
    personalTitle.textContent = 'Informações Pessoais';
    personalSection.appendChild(personalTitle);
    
    const personalList = document.createElement('div');
    personalList.className = 'pl-4';
    
    // Add each personal info item
    const personalFields = [
      { key: 'name', label: 'Nome' },
      { key: 'dueDate', label: 'Data prevista' },
      { key: 'birthLocation', label: 'Local planejado para o parto' },
      { key: 'hospital', label: 'Hospital/Maternidade' },
      { key: 'hospitalAddress', label: 'Endereço' },
      { key: 'hospitalPhone', label: 'Telefone' },
      { key: 'healthProvider', label: 'Médico/Obstetra' },
      { key: 'healthProviderContact', label: 'Telefone' },
      { key: 'healthProviderRegistry', label: 'CRM' }
    ];
    
    personalFields.forEach(field => {
      if (personalInfo[field.key]) {
        const item = document.createElement('div');
        item.className = 'mb-2';
        
        const label = document.createElement('h3');
        label.className = 'font-semibold';
        label.textContent = field.label;
        item.appendChild(label);
        
        const value = document.createElement('p');
        value.textContent = personalInfo[field.key];
        item.appendChild(value);
        
        personalList.appendChild(item);
      }
    });
    
    personalSection.appendChild(personalList);
    container.appendChild(personalSection);
    
    // Loop through all other birth plan sections
    Object.entries(birthPlanData).forEach(([sectionKey, sectionData]) => {
      if (sectionKey === 'personalInfo' || !sectionData || typeof sectionData !== 'object') return;
      
      const section = document.createElement('div');
      section.className = 'mb-6';
      
      const sectionTitle = document.createElement('h2');
      sectionTitle.className = 'text-xl font-bold mb-2';
      sectionTitle.textContent = getSectionDisplayName(sectionKey);
      section.appendChild(sectionTitle);
      
      const sectionContent = document.createElement('div');
      sectionContent.className = 'pl-4';
      
      // Add each field in the section
      Object.entries(sectionData as Record<string, any>).forEach(([key, value]) => {
        if (!value) return;
        
        const item = document.createElement('div');
        item.className = 'mb-2';
        
        const label = document.createElement('h3');
        label.className = 'font-semibold';
        label.textContent = key;
        item.appendChild(label);
        
        const content = document.createElement('p');
        content.textContent = Array.isArray(value) ? value.join(", ") : value;
        item.appendChild(content);
        
        sectionContent.appendChild(item);
      });
      
      section.appendChild(sectionContent);
      container.appendChild(section);
    });
    
    // Add signature section
    const signatureSection = document.createElement('div');
    signatureSection.className = 'mt-12';
    
    const signatureTitle = document.createElement('h2');
    signatureTitle.className = 'text-xl font-bold mb-4 border-b pb-2';
    signatureTitle.textContent = 'Assinaturas';
    signatureSection.appendChild(signatureTitle);
    
    const signatureGrid = document.createElement('div');
    signatureGrid.className = 'grid grid-cols-2 gap-8';
    
    // Patient signature
    const patientSignature = document.createElement('div');
    const patientLine = document.createElement('div');
    patientLine.className = 'border-b border-black h-12 mb-2';
    patientSignature.appendChild(patientLine);
    
    const patientName = document.createElement('p');
    patientName.className = 'text-center';
    patientName.textContent = personalInfo.name || '';
    patientSignature.appendChild(patientName);
    
    const patientLabel = document.createElement('p');
    patientLabel.className = 'text-center text-sm text-gray-600';
    patientLabel.textContent = 'Gestante';
    patientSignature.appendChild(patientLabel);
    
    // Doctor signature
    const doctorSignature = document.createElement('div');
    const doctorLine = document.createElement('div');
    doctorLine.className = 'border-b border-black h-12 mb-2';
    doctorSignature.appendChild(doctorLine);
    
    const doctorName = document.createElement('p');
    doctorName.className = 'text-center';
    doctorName.textContent = personalInfo.healthProvider || '_________________';
    doctorSignature.appendChild(doctorName);
    
    const doctorLabel = document.createElement('p');
    doctorLabel.className = 'text-center text-sm text-gray-600';
    doctorLabel.textContent = 'Médico/Obstetra';
    doctorSignature.appendChild(doctorLabel);
    
    const doctorCRM = document.createElement('p');
    doctorCRM.className = 'text-center text-sm text-gray-600';
    doctorCRM.textContent = `CRM: ${personalInfo.healthProviderRegistry || '_________________'}`;
    doctorSignature.appendChild(doctorCRM);
    
    signatureGrid.appendChild(patientSignature);
    signatureGrid.appendChild(doctorSignature);
    
    // Additional signatures
    const additionalSignatures = document.createElement('div');
    additionalSignatures.className = 'grid grid-cols-2 gap-8 mt-8';
    
    // Pediatrician signature
    const pediatricianSignature = document.createElement('div');
    const pediatricianLine = document.createElement('div');
    pediatricianLine.className = 'border-b border-black h-12 mb-2';
    pediatricianSignature.appendChild(pediatricianLine);
    
    const pediatricianName = document.createElement('p');
    pediatricianName.className = 'text-center';
    pediatricianName.textContent = personalInfo.pediatrician || '_________________';
    pediatricianSignature.appendChild(pediatricianName);
    
    const pediatricianLabel = document.createElement('p');
    pediatricianLabel.className = 'text-center text-sm text-gray-600';
    pediatricianLabel.textContent = 'Pediatra Neonatal';
    pediatricianSignature.appendChild(pediatricianLabel);
    
    const pediatricianCRM = document.createElement('p');
    pediatricianCRM.className = 'text-center text-sm text-gray-600';
    pediatricianCRM.textContent = `CRM: ${personalInfo.pediatricianRegistry || '_________________'}`;
    pediatricianSignature.appendChild(pediatricianCRM);
    
    // Doula signature
    const doulaSignature = document.createElement('div');
    const doulaLine = document.createElement('div');
    doulaLine.className = 'border-b border-black h-12 mb-2';
    doulaSignature.appendChild(doulaLine);
    
    const doulaName = document.createElement('p');
    doulaName.className = 'text-center';
    doulaName.textContent = personalInfo.doula || '_________________';
    doulaSignature.appendChild(doulaName);
    
    const doulaLabel = document.createElement('p');
    doulaLabel.className = 'text-center text-sm text-gray-600';
    doulaLabel.textContent = 'Doula';
    doulaSignature.appendChild(doulaLabel);
    
    const doulaRegistry = document.createElement('p');
    doulaRegistry.className = 'text-center text-sm text-gray-600';
    doulaRegistry.textContent = `Registro: ${personalInfo.doulaRegistry || '_________________'}`;
    doulaSignature.appendChild(doulaRegistry);
    
    additionalSignatures.appendChild(pediatricianSignature);
    additionalSignatures.appendChild(doulaSignature);
    
    signatureSection.appendChild(signatureGrid);
    signatureSection.appendChild(additionalSignatures);
    container.appendChild(signatureSection);
    
    // Add footer with date
    const footer = document.createElement('div');
    footer.className = 'mt-8 text-center';
    footer.textContent = `Criado em ${new Date().toLocaleDateString()}`;
    container.appendChild(footer);
    
    // Make the container visible for export
    container.style.display = 'block';
  };
  
  // Helper function to get user-friendly section names
  const getSectionDisplayName = (sectionId: string): string => {
    const sectionNameMap: Record<string, string> = {
      personalInfo: 'Informações Pessoais',
      laborPreferences: 'Preferências para o Trabalho de Parto',
      atmosphere: 'Ambiente e Acompanhamento',
      painManagement: 'Alívio da Dor',
      delivery: 'Parto',
      newborn: 'Cuidados com o Recém-Nascido',
      cesarean: 'Cesárea (Se Necessária)',
      postpartum: 'Pós-Parto',
      specialSituations: 'Situações Especiais'
    };
    
    return sectionNameMap[sectionId] || sectionId;
  };
  
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
      
      <div id="birth-plan-content" className="hidden">
        {/* This div will be used to generate the PDF but remains hidden */}
        {/* Content will be dynamically generated before export */}
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-maternal-800 mb-6">Opções de Compartilhamento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ShareOption
            icon={Copy}
            title="Copiar Texto"
            description="Copie o conteúdo para compartilhar"
            onClick={handleCopyText}
          />
          
          <ShareOption
            icon={FileText}
            title="Word (Editável)"
            description="Salve como documento editável"
            onClick={handleExportWord}
          />
          
          <ShareOption
            icon={Share2}
            title="WhatsApp"
            description="Compartilhe via WhatsApp"
            onClick={handleShareViaWhatsApp}
          />
          
          <ShareOption
            icon={Mail}
            title="E-mail"
            description="Envie por e-mail para sua equipe"
            onClick={() => setEmailDialogOpen(true)}
          />
        </div>
      </div>
      
      <div className="bg-maternal-100 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-maternal-800 mb-4">Próximos Passos</h3>
        <ol className="list-decimal pl-5 space-y-2 mb-0">
          <li>Abra o documento Word e personalize-o conforme necessário</li>
          <li>Discuta seu plano com seu parceiro ou acompanhante de parto</li>
          <li>Agende uma consulta com seu médico para discutir o plano</li>
          <li>Faça as alterações recomendadas pelo seu médico, se necessário</li>
          <li>Imprima várias cópias para levar ao hospital/maternidade</li>
          <li>Coloque uma cópia na sua bolsa de maternidade</li>
        </ol>
      </div>
      
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
        onExportPDF={handleExportWord} // Changed to export Word instead of PDF
      />
    </div>
  );
}
