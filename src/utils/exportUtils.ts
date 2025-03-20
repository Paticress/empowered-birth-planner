
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
      clone.style.width = '100%';
      clone.style.padding = '20px';
      clone.style.margin = '0';
      clone.style.background = '#fff';
      clone.style.border = 'none';
      
      // Create a temporary container with proper structure
      const container = document.createElement('div');
      container.style.width = '210mm'; // A4 width
      container.style.margin = '0';
      container.style.padding = '0';
      container.style.backgroundColor = '#fff';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);
      
      // Add the main content
      container.appendChild(clone);
      
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
        (el as HTMLElement).style.backgroundColor = 'transparent';
        (el as HTMLElement).style.padding = '0';
        (el as HTMLElement).style.borderRadius = '0';
      });
      
      // Render the content to canvas
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
      
      // Create PDF with appropriate margins
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // A4 dimensions with adequate margins
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 20; // 2cm margin
      
      // Calculate content dimensions
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      // Add the content as a single image on the first page
      pdf.addImage(
        imgData, 
        'PNG', 
        margin, // left margin
        margin, // top margin
        contentWidth, 
        contentHeight
      );
      
      // Save the PDF
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
export const exportAsText = (elementId: string, filename: string): Promise<void> => {
  return new Promise((resolve, reject) => {
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
      
      // Restore the original display property
      if (isHidden) {
        element.style.display = originalDisplay;
        if (element.classList.contains('hidden')) {
          element.classList.add('hidden');
        }
      }
      
      // Create and trigger download
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      
      resolve();
    } catch (error) {
      console.error('Error generating text file:', error);
      reject(error);
    }
  });
};
