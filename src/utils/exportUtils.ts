
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from '@/hooks/use-toast';

// Export checklist as PDF
export const exportAsPDF = async (elementId: string, filename = 'plano-de-parto-checklist.pdf') => {
  try {
    toast({
      title: "Preparando PDF...",
      description: "Seu checklist está sendo convertido para PDF.",
    });
    
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    // Create a copy of the element with print styles applied
    const clone = element.cloneNode(true) as HTMLElement;
    clone.classList.add('pdf-export');
    clone.style.padding = '20px';
    clone.style.background = 'white';
    clone.style.width = '800px';
    
    // Temporarily append to the document
    document.body.appendChild(clone);
    
    // Add logo and title at the top
    const header = document.createElement('div');
    header.innerHTML = `
      <h1 style="font-size: 24px; color: #333; margin-bottom: 10px; text-align: center;">
        Checklist do Plano de Parto
      </h1>
      <div style="height: 20px;"></div>
    `;
    clone.insertBefore(header, clone.firstChild);
    
    // Create hide class for buttons and other non-printable elements
    const hideElements = clone.querySelectorAll('.print\\:hidden');
    hideElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });
    
    document.body.removeChild(clone);
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    // Add multiple pages if the content is longer than one page
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    // Save the PDF
    pdf.save(filename);
    
    toast({
      title: "PDF gerado com sucesso!",
      description: "Seu checklist foi salvo como PDF.",
    });
  } catch (error) {
    console.error('Error exporting as PDF:', error);
    toast({
      title: "Erro ao gerar PDF",
      description: "Houve um problema ao gerar o PDF. Tente novamente.",
      variant: "destructive",
    });
  }
};

// Export checklist as plain text
export const exportAsText = (elementId: string, filename = 'plano-de-parto-checklist.txt') => {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }
    
    // Get all the checklist sections
    const sections = element.querySelectorAll('h3');
    let textContent = "CHECKLIST DO PLANO DE PARTO\n\n";
    
    sections.forEach(section => {
      // Get section title
      textContent += `${section.textContent?.toUpperCase()}\n`;
      textContent += "--------------------------------------\n";
      
      // Get checklist items in this section
      const container = section.closest('.bg-white');
      if (container) {
        const items = container.querySelectorAll('li');
        
        items.forEach(item => {
          const checkbox = item.querySelector('input[type="checkbox"]') as HTMLInputElement;
          const label = item.querySelector('label');
          const notes = item.querySelector('.text-muted-foreground');
          
          const checkStatus = checkbox?.checked ? "[X]" : "[ ]";
          textContent += `${checkStatus} ${label?.textContent?.trim()}\n`;
          
          if (notes && notes.textContent) {
            textContent += `   Nota: ${notes.textContent.replace('Nota: ', '')}\n`;
          }
        });
      }
      
      textContent += "\n";
    });
    
    // Create and download text file
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Texto exportado com sucesso!",
      description: "Seu checklist foi salvo como arquivo de texto.",
    });
  } catch (error) {
    console.error('Error exporting as text:', error);
    toast({
      title: "Erro ao exportar texto",
      description: "Houve um problema ao exportar o texto. Tente novamente.",
      variant: "destructive",
    });
  }
};
