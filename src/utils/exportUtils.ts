
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
      // Create a temporary clone with styling for PDF
      const clone = element.cloneNode(true) as HTMLElement;
      clone.style.width = '800px';
      clone.style.padding = '20px';
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.top = '0';
      clone.style.background = '#fff';
      
      // Make hidden elements visible in the clone
      clone.classList.remove('hidden');
      Array.from(clone.querySelectorAll('.hidden')).forEach(el => {
        (el as HTMLElement).classList.remove('hidden');
      });
      
      document.body.appendChild(clone);
      
      const canvas = await html2canvas(clone, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Allow images from other domains
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      // Clean up the temporary clone
      document.body.removeChild(clone);
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add multiple pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
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
