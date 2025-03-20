
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
      // First add a print class to the body to apply print styles
      document.body.classList.add('print-preview-mode');
      
      // Create a temporary container with proper margins
      const container = document.createElement('div');
      container.style.width = '210mm'; // A4 width
      container.style.padding = '20mm'; // Add margins
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      container.style.background = '#fff';
      document.body.appendChild(container);
      
      // Create a temporary clone with styling for PDF
      const clone = element.cloneNode(true) as HTMLElement;
      
      // Add print title manually
      const printTitle = document.querySelector('.print\\:block');
      if (printTitle) {
        const printTitleClone = printTitle.cloneNode(true) as HTMLElement;
        printTitleClone.classList.remove('hidden');
        printTitleClone.style.display = 'block';
        clone.prepend(printTitleClone);
      }
      
      // Hide elements with print:hidden class
      Array.from(clone.querySelectorAll('.print\\:hidden, .info-alert, .preview-footer, .links-rapidos')).forEach(el => {
        (el as HTMLElement).style.display = 'none';
      });
      
      // Show elements with print:block class
      Array.from(clone.querySelectorAll('.hidden.print\\:block')).forEach(el => {
        (el as HTMLElement).style.display = 'block';
      });
      
      // Make sure SVG icons are visible
      Array.from(clone.querySelectorAll('svg')).forEach(el => {
        (el as SVGElement).style.display = 'inline-block';
        (el as SVGElement).style.visibility = 'visible';
      });
      
      // Apply print styles to content
      Array.from(clone.querySelectorAll('.bg-maternal-50')).forEach(el => {
        (el as HTMLElement).style.backgroundColor = 'transparent';
        (el as HTMLElement).style.padding = '0';
        (el as HTMLElement).style.borderRadius = '0';
      });
      
      container.appendChild(clone);
      
      const canvas = await html2canvas(container, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Allow images from other domains
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      // Clean up the temporary elements and remove print class
      document.body.removeChild(container);
      document.body.classList.remove('print-preview-mode');
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // A4 dimensions with margins
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15; // 1.5cm margin
      
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = pageHeight - (margin * 2);
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = margin; // Start with top margin
      
      // Add first page with content
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      heightLeft -= (pageHeight - (margin * 2));
      
      // Add multiple pages if content is longer than one page
      while (heightLeft > 0) {
        position = margin - (pageHeight - (margin * 2) - heightLeft);
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= (pageHeight - (margin * 2));
      }
      
      pdf.save(filename);
      resolve();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};

/**
 * Exports an HTML element as a plain text file
 * @param elementId The ID of the HTML element to export
 * @param filename The name of the text file to download
 */
export const exportAsText = (elementId: string, filename: string): void => {
  const element = document.getElementById(elementId);
  
  if (!element) {
    console.error(`Element with ID ${elementId} not found`);
    return;
  }
  
  try {
    // Extract plain text from HTML content
    const extractTextFromNode = (node: Node): string => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }
      
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        
        // Skip hidden elements
        if (el.style.display === 'none' || el.getAttribute('aria-hidden') === 'true' || el.classList.contains('hidden')) {
          return '';
        }
        
        // Handle list items specially
        if (el.tagName === 'LI') {
          return `• ${Array.from(el.childNodes).map(extractTextFromNode).join('')}\n`;
        }
        
        // Add newlines after block elements
        const isBlock = ['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL'].includes(el.tagName);
        
        const text = Array.from(el.childNodes).map(extractTextFromNode).join('');
        return isBlock ? `${text}\n\n` : text;
      }
      
      return '';
    };
    
    let text = extractTextFromNode(element);
    
    // Clean up excessive newlines
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    // Create and trigger download
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating text file:', error);
  }
};
