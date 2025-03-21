
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Exports an HTML element as a PDF file
 * @param elementId The ID of the HTML element to export
 * @param filename The name of the PDF file to download
 */
export const exportAsPDF = async (elementId: string, filename: string): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error(`Element with ID ${elementId} not found`);
      reject(new Error(`Element with ID ${elementId} not found`));
      return;
    }
    
    try {
      // Temporarily show the element if it's hidden
      const originalDisplay = element.style.display;
      const isHidden = originalDisplay === 'none' || element.classList.contains('hidden');
      
      if (isHidden) {
        element.style.display = 'block';
        element.classList.remove('hidden');
      }
      
      // First add a print class to the body to apply print styles
      document.body.classList.add('print-preview-mode');
      
      // Create a clone of the element with print styles
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.position = 'relative';
      clone.style.width = '100%';
      clone.style.maxWidth = '210mm'; // A4 width
      clone.style.padding = '20px';
      clone.style.margin = '0 auto';
      clone.style.background = '#fff';
      clone.style.border = 'none';
      
      // Create a temporary container with A4 proportions
      const container = document.createElement('div');
      container.style.width = '210mm'; // A4 width
      container.style.margin = '0 auto';
      container.style.padding = '0';
      container.style.backgroundColor = '#fff';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);
      
      // Create header with title and disclaimer
      const header = document.createElement('div');
      header.className = 'pdf-header';
      header.style.marginBottom = '20px';
      
      // Title and logo container
      const titleContainer = document.createElement('div');
      titleContainer.style.display = 'flex';
      titleContainer.style.justifyContent = 'space-between';
      titleContainer.style.alignItems = 'center';
      titleContainer.style.marginBottom = '10px';
      
      // Add title
      const title = document.createElement('h1');
      title.textContent = 'PLANO DE PARTO';
      title.style.fontSize = '24px';
      title.style.fontWeight = 'bold';
      title.style.margin = '0';
      titleContainer.appendChild(title);
      
      // Add logo
      const logo = document.createElement('img');
      logo.src = '/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png';
      logo.alt = 'Energia Materna';
      logo.style.height = '48px';
      titleContainer.appendChild(logo);
      
      header.appendChild(titleContainer);
      
      // Add disclaimer text
      const disclaimer = document.createElement('p');
      disclaimer.style.fontSize = '12px';
      disclaimer.style.color = '#666';
      disclaimer.style.marginTop = '8px';
      disclaimer.style.marginBottom = '16px';
      disclaimer.textContent = 'Este documento reflete minhas preferências para o parto e nascimento do meu bebê. Ele foi elaborado após ' +
        'cuidadosa pesquisa e reflexão, em colaboração com meu parceiro e equipe de saúde. Compreendo que ' +
        'situações imprevistas podem surgir durante o trabalho de parto, e que a saúde e bem-estar do ' +
        'bebê e meu são prioridade. Peço gentilmente que, na ausência de emergências médicas, minhas ' +
        'escolhas sejam respeitadas, e que quaisquer intervenções necessárias sejam discutidas comigo ' +
        'antes de serem realizadas.';
      header.appendChild(disclaimer);
      
      // Insert header at the beginning of container
      container.appendChild(header);
      
      // Add the main content
      container.appendChild(clone);
      
      // Create footer
      const footer = document.createElement('div');
      footer.className = 'pdf-footer';
      footer.style.marginTop = '20px';
      footer.style.borderTop = '1px solid #eee';
      footer.style.paddingTop = '10px';
      footer.style.display = 'flex';
      footer.style.justifyContent = 'space-between';
      footer.style.alignItems = 'center';
      
      const footerLogo = document.createElement('img');
      footerLogo.src = '/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png';
      footerLogo.alt = 'Energia Materna';
      footerLogo.style.height = '30px';
      
      const footerText = document.createElement('p');
      footerText.style.fontSize = '10px';
      footerText.style.color = '#666';
      footerText.style.margin = '0';
      footerText.textContent = `© ${new Date().getFullYear()} Energia Materna - www.energiamaterna.com.br`;
      
      footer.appendChild(footerLogo);
      footer.appendChild(footerText);
      
      // Add the footer to the container
      container.appendChild(footer);
      
      // Hide elements not needed in PDF
      Array.from(container.querySelectorAll('.print\\:hidden')).forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Show elements that should be visible in PDF
      Array.from(container.querySelectorAll('.hidden.print\\:block')).forEach(el => {
        (el as HTMLElement).style.display = 'block';
      });
      
      // Make sure SVG icons are visible
      Array.from(container.querySelectorAll('svg')).forEach(el => {
        (el as SVGElement).style.display = 'inline-block';
        (el as SVGElement).style.visibility = 'visible';
      });
      
      // Apply print styles to content
      Array.from(container.querySelectorAll('.bg-maternal-50')).forEach(el => {
        (el as HTMLElement).style.backgroundColor = '#f8f7ff';
        (el as HTMLElement).style.padding = '10px';
        (el as HTMLElement).style.borderRadius = '5px';
      });

      // Calculate a good scale factor for A4 paper (preserving aspect ratio)
      const contentWidth = container.scrollWidth;
      const pdfWidth = 210; // A4 width in mm
      const pdfContentWidth = pdfWidth - 30; // Content width with margins
      const scaleFactor = pdfContentWidth / contentWidth;
      
      // Render the content to canvas with appropriate scaling
      const canvas = await html2canvas(container, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Allow images from other domains
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      // Restore the original display property
      if (isHidden) {
        element.style.display = originalDisplay;
        if (element.classList.contains('hidden')) {
          element.classList.add('hidden');
        }
      }
      
      // Clean up the temporary elements and remove print class
      document.body.removeChild(container);
      document.body.classList.remove('print-preview-mode');
      
      // Create PDF with A4 size
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // A4 dimensions
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15; // 1.5cm margin
      
      // Calculate content dimensions preserving aspect ratio
      const contentHeight = (canvas.height * (pageWidth - 2 * margin)) / canvas.width;
      
      // If content doesn't fit in a single page, split it across multiple pages
      if (contentHeight > (pageHeight - 2 * margin)) {
        // Calculate how many pages we need
        const pageCount = Math.ceil(contentHeight / (pageHeight - 2 * margin));
        const heightPerPage = canvas.height / pageCount;
        
        // For each page, add a portion of the image
        for (let i = 0; i < pageCount; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          const sourceY = i * heightPerPage;
          
          pdf.addImage(
            imgData,
            'PNG',
            margin, // left margin
            margin, // top margin
            pageWidth - 2 * margin, // content width with margins
            (canvas.height / canvas.width) * (pageWidth - 2 * margin) / pageCount, // height preserving aspect ratio
            '',
            'FAST',
            0
          );
          
          // Instead of using a negative Y offset which causes distortion,
          // we slice the canvas for each page
          pdf.setCurrentTransformationMatrix(1, 0, 0, 1, 0, 0);
          pdf.addImage(
            imgData,
            'PNG',
            margin, // left margin
            margin, // top margin
            pageWidth - 2 * margin, // content width
            (pageHeight - 2 * margin), // content height per page
            '',
            'FAST',
            { 
              sourceX: 0,
              sourceY: sourceY,
              sourceWidth: canvas.width,
              sourceHeight: heightPerPage
            }
          );
          
          // Add page number
          pdf.setFontSize(10);
          pdf.setTextColor(100);
          pdf.text(`Página ${i + 1} de ${pageCount}`, pageWidth - 40, pageHeight - 10);
        }
      } else {
        // Content fits in a single page
        pdf.addImage(
          imgData,
          'PNG',
          margin, // left margin
          margin, // top margin
          pageWidth - 2 * margin, // content width
          contentHeight // content height preserving aspect ratio
        );
        
        // Add page number
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text('Página 1 de 1', pageWidth - 40, pageHeight - 10);
      }
      
      // Save the PDF
      pdf.save(filename);
      resolve();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};
