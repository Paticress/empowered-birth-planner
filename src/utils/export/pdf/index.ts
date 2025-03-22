
import { renderElementToCanvas, createA4Document } from './core';
import { 
  showHiddenElement, 
  restoreElementDisplay, 
  createTemporaryContainer,
  cleanupTemporaryContainer,
  createOptimizedClone,
  enhanceElementsForPDF
} from './domUtils';
import { addContentToPDF } from './multiPage';

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
      const originalState = showHiddenElement(element);
      
      // First add a print class to the body to apply print styles
      document.body.classList.add('print-preview-mode');
      
      // Create a clone of the element with print styles
      const clone = createOptimizedClone(element);
      
      // Create a temporary container with A4 proportions
      const container = createTemporaryContainer();
      
      // Add the main content (without adding extra header/footer since they're already in the print version)
      container.appendChild(clone);
      
      // Enhance elements for PDF rendering
      enhanceElementsForPDF(container);
      
      // Render the content to canvas
      const canvas = await renderElementToCanvas(container);
      
      // Restore the original display property
      restoreElementDisplay(element, originalState);
      
      // Clean up the temporary elements and remove print class
      cleanupTemporaryContainer(container);
      document.body.classList.remove('print-preview-mode');
      
      // Create PDF with A4 size
      const imgData = canvas.toDataURL('image/png');
      const pdf = createA4Document();
      
      // Add content to PDF (handles multi-page layout)
      addContentToPDF(pdf, imgData, canvas);
      
      // Save the PDF
      pdf.save(filename);
      resolve();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};
