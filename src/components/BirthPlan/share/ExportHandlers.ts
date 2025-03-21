import { toast } from 'sonner';
import { exportAsPDF, exportAsText, exportAsWord } from '@/utils/export';
import { renderBirthPlanForExport } from '../utils/export';

export const useExportHandlers = (birthPlan: Record<string, any>) => {
  // Handler for copying text to clipboard
  const handleCopyText = () => {
    if (!birthPlan) return;
    
    const text = createShareableText(birthPlan);
    
    navigator.clipboard.writeText(text)
      .then(() => {
        toast("Seu plano de parto foi copiado e está pronto para ser compartilhado.");
      })
      .catch(() => {
        toast("Não foi possível copiar o texto para a área de transferência.");
      });
  };
  
  // Handler for exporting as PDF
  const handleExportPDF = () => {
    if (!birthPlan) return;
    
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
  
  // Handler for exporting as Word document
  const handleExportWord = () => {
    if (!birthPlan || Object.keys(birthPlan).length === 0) {
      toast("Dados do plano de parto insuficientes para gerar um documento.");
      return;
    }
    
    // Debug log to check if birth plan data is available
    console.log("Birth plan data being sent to Word export:", birthPlan);
    
    exportAsWord(birthPlan, 'meu-plano-de-parto.docx')
      .then(() => {
        toast("Documento Word gerado com sucesso!");
      })
      .catch((error) => {
        console.error("Erro ao gerar documento Word:", error);
        toast("Ocorreu um erro ao gerar o documento Word. Por favor, tente novamente.");
      });
  };
  
  // Handler for exporting as text file
  const handleExportText = () => {
    if (!birthPlan) return;
    
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
  
  // Handler for sharing via WhatsApp
  const handleShareViaWhatsApp = () => {
    if (!birthPlan) return;
    
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
  
  return {
    handleCopyText,
    handleExportPDF,
    handleExportWord,
    handleExportText,
    handleShareViaWhatsApp
  };
};

/**
 * Creates a shareable text version of the birth plan
 */
export const createShareableText = (birthPlan: Record<string, any>) => {
  const personalInfo = birthPlan.personalInfo || {};
  
  let text = `MEU PLANO DE PARTO\n\n`;
  text += `Nome: ${personalInfo.name || 'Não informado'}\n`;
  text += `Data prevista: ${personalInfo.dueDate || 'Não informada'}\n`;
  text += `Local planejado para o parto: ${personalInfo.birthLocation || 'Não informado'}\n`;
  text += `Hospital/Maternidade de referência: ${personalInfo.hospital || 'Não informado'}\n`;
  text += `Endereço: ${personalInfo.hospitalAddress || 'Não informado'}\n`;
  text += `Telefone: ${personalInfo.hospitalPhone || 'Não informado'}\n`;
  text += `Médico/Obstetra: ${personalInfo.healthProvider || 'Não informado'}\n`;
  text += `Telefone: ${personalInfo.healthProviderContact || 'Não informado'}\n`;
  text += `CRM: ${personalInfo.healthProviderRegistry || 'Não informado'}\n`;
  
  if (personalInfo.midwife) {
    text += `Enfermeira Obstetriz: ${personalInfo.midwife || 'Não informada'}\n`;
    text += `Telefone: ${personalInfo.midwifeContact || 'Não informado'}\n`;
    text += `COREN: ${personalInfo.midwifeRegistry || 'Não informado'}\n`;
  }
  
  if (personalInfo.doula) {
    text += `Doula: ${personalInfo.doula || 'Não informada'}\n`;
    text += `Telefone: ${personalInfo.doulaContact || 'Não informado'}\n`;
    text += `Certificação: ${personalInfo.doulaRegistry || 'Não informada'}\n`;
  }
  
  text += `Acompanhantes: ${personalInfo.companions || 'Não informados'}\n\n`;
  
  // Add other sections
  Object.entries(birthPlan).forEach(([sectionKey, sectionData]) => {
    if (sectionKey === 'personalInfo' || !sectionData || typeof sectionData !== 'object') return;
    
    text += `${getSectionDisplayName(sectionKey).toUpperCase()}:\n`;
    
    // Add each field in the section
    Object.entries(sectionData as Record<string, any>).forEach(([key, value]) => {
      if (!value) return;
      
      text += `- ${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
    });
    
    text += '\n';
  });
  
  text += `Criado em ${new Date().toLocaleDateString()}`;
  text += `\n\nEste documento representa minhas preferências para o parto e nascimento do meu bebê.`;
  text += `\n\nAssinaturas:\n\n`;
  text += `___________________________        ___________________________\n`;
  text += `${personalInfo.name || 'Gestante'}                 ${personalInfo.healthProvider || 'Médico/Obstetra'}\n`;
  text += `                                   CRM: ${personalInfo.healthProviderRegistry || '_________'}\n\n`;
  
  // Add enfermeira obstetriz and doula signatures
  text += `___________________________        ___________________________\n`;
  if (personalInfo.midwife) {
    text += `${personalInfo.midwife || 'Enfermeira Obstetriz'}            ${personalInfo.doula || 'Doula'}\n`;
    text += `COREN: ${personalInfo.midwifeRegistry || '_________'}       Certificação: ${personalInfo.doulaRegistry || '_________'}`;
  } else {
    text += `Enfermeira Obstétrica              ${personalInfo.doula || 'Doula'}\n`;
    text += `COREN: _________                 Certificação: ${personalInfo.doulaRegistry || '_________'}`;
  }
  
  return text;
};

/**
 * Helper function to get user-friendly section names
 */
export const getSectionDisplayName = (sectionId: string): string => {
  const sectionNameMap: Record<string, string> = {
    personalInfo: 'Informações Pessoais',
    laborPreferences: 'Preferências para o Trabalho de Parto',
    atmosfera: 'Ambiente e Acompanhamento',
    trabalhoDeParto: 'Trabalho de Parto',
    painManagement: 'Alívio da Dor',
    nascimento: 'Parto',
    newborn: 'Cuidados com o Recém-Nascido',
    cesarea: 'Cesárea (Se Necessária)',
    posParto: 'Pós-Parto',
    situacoesEspeciais: 'Situações Especiais'
  };
  
  return sectionNameMap[sectionId] || sectionId;
};
