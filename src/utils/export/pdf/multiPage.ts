
import { jsPDF } from 'jspdf';
import { A4_DIMENSIONS, addPageNumber } from './core';

/**
 * Adds content to a PDF document, handling multi-page layout if needed
 * @param pdf The PDF document
 * @param imgData The image data to add to the PDF
 * @param canvas The canvas with the rendered content
 */
export const addContentToPDF = (pdf: jsPDF, imgData: string, canvas: HTMLCanvasElement): void => {
  const { width: pageWidth, height: pageHeight, margin } = A4_DIMENSIONS;
  
  // Calculate content dimensions preserving aspect ratio
  const contentHeight = (canvas.height * (pageWidth - 2 * margin)) / canvas.width;
  
  // If content doesn't fit in a single page, split it across multiple pages
  if (contentHeight > (pageHeight - 2 * margin)) {
    renderMultiPageContent(pdf, imgData, canvas);
  } else {
    renderSinglePageContent(pdf, imgData, contentHeight);
  }
};

/**
 * Renders content that fits on a single page
 * @param pdf The PDF document
 * @param imgData The image data to add to the PDF
 * @param contentHeight The height of the content
 */
const renderSinglePageContent = (pdf: jsPDF, imgData: string, contentHeight: number): void => {
  const { width: pageWidth, height: pageHeight, margin } = A4_DIMENSIONS;
  
  pdf.addImage(
    imgData,
    'PNG',
    margin, // left margin
    margin, // top margin
    pageWidth - 2 * margin, // content width
    contentHeight // content height preserving aspect ratio
  );
  
  // Add page number
  addPageNumber(pdf, 1, 1);
};

/**
 * Renders content that requires multiple pages
 * @param pdf The PDF document
 * @param imgData The image data to add to the PDF
 * @param canvas The canvas with the rendered content
 */
const renderMultiPageContent = (pdf: jsPDF, imgData: string, canvas: HTMLCanvasElement): void => {
  const { width: pageWidth, height: pageHeight, margin } = A4_DIMENSIONS;
  
  // Calculate how many pages we need
  const contentHeight = (canvas.height * (pageWidth - 2 * margin)) / canvas.width;
  const pageCount = Math.ceil(contentHeight / (pageHeight - 2 * margin));
  const heightPerPage = canvas.height / pageCount;
  
  // For each page, add a portion of the image
  for (let i = 0; i < pageCount; i++) {
    if (i > 0) {
      pdf.addPage();
    }
    
    const sourceY = i * heightPerPage;
    
    // Create a clipping mask to show only the portion of the image that belongs on this page
    pdf.saveGraphicsState();
    pdf.rect(
      margin, 
      margin, 
      pageWidth - 2 * margin, 
      pageHeight - 2 * margin
    ).clip();
    
    // Calculate scale factor
    const scaleFactor = (pageWidth - 2 * margin) / canvas.width;
    
    // Add the image at the correct position
    pdf.addImage(
      imgData,
      'PNG',
      margin, // left margin
      margin - sourceY * scaleFactor, // adjust position based on current page
      pageWidth - 2 * margin, // width
      canvas.height * scaleFactor // height (preserving aspect ratio)
    );
    
    pdf.restoreGraphicsState();
    
    // Add page number
    addPageNumber(pdf, i + 1, pageCount);
  }
};
