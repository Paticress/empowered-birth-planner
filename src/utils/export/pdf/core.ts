
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Renders an HTML element to canvas for PDF generation
 * @param container The HTML element to render
 * @returns The canvas with rendered content
 */
export const renderElementToCanvas = async (container: HTMLElement): Promise<HTMLCanvasElement> => {
  return html2canvas(container, {
    scale: 2, // Higher scale for better quality
    useCORS: true, // Allow images from other domains
    logging: false,
    backgroundColor: '#ffffff',
  });
};

/**
 * Creates a PDF document with A4 dimensions
 * @returns A new jsPDF instance configured for A4 paper
 */
export const createA4Document = (): jsPDF => {
  return new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });
};

/**
 * Adds a page number to the current page in the PDF
 * @param pdf The PDF document
 * @param pageNum The current page number
 * @param totalPages The total number of pages
 */
export const addPageNumber = (pdf: jsPDF, pageNum: number, totalPages: number): void => {
  const pageWidth = 210; // A4 width
  const pageHeight = 297; // A4 height
  
  pdf.setFontSize(10);
  pdf.setTextColor(100);
  pdf.text(`Página ${pageNum} de ${totalPages}`, pageWidth - 40, pageHeight - 10);
};

/**
 * A4 paper dimensions and margins (in mm)
 */
export const A4_DIMENSIONS = {
  width: 210,
  height: 297,
  margin: 15
};
