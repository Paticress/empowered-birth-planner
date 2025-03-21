
/**
 * Shows a hidden element for rendering/export purposes
 * @param element The element to show
 * @returns Information to restore the element's original state
 */
export const showHiddenElement = (element: HTMLElement): { 
  originalDisplay: string; 
  isHidden: boolean;
} => {
  const originalDisplay = element.style.display;
  const isHidden = originalDisplay === 'none' || element.classList.contains('hidden');
  
  if (isHidden) {
    element.style.display = 'block';
    element.classList.remove('hidden');
  }
  
  return { originalDisplay, isHidden };
};

/**
 * Restores an element to its original display state
 * @param element The element to restore
 * @param originalState The original state information
 */
export const restoreElementDisplay = (
  element: HTMLElement, 
  { originalDisplay, isHidden }: { originalDisplay: string; isHidden: boolean }
): void => {
  if (isHidden) {
    element.style.display = originalDisplay;
    if (element.classList.contains('hidden')) {
      element.classList.add('hidden');
    }
  }
};

/**
 * Creates a temporary container for rendering content
 * @returns The created container element
 */
export const createTemporaryContainer = (): HTMLDivElement => {
  const container = document.createElement('div');
  container.style.width = '210mm'; // A4 width
  container.style.margin = '0 auto';
  container.style.padding = '0';
  container.style.backgroundColor = '#fff';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  document.body.appendChild(container);
  
  return container;
};

/**
 * Cleans up the temporary container after use
 * @param container The container to remove
 */
export const cleanupTemporaryContainer = (container: HTMLDivElement): void => {
  document.body.removeChild(container);
  document.body.classList.remove('print-preview-mode');
};

/**
 * Creates an element clone optimized for PDF export
 * @param element The element to clone
 * @returns The cloned element
 */
export const createOptimizedClone = (element: HTMLElement): HTMLElement => {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = 'relative';
  clone.style.width = '100%';
  clone.style.maxWidth = '210mm'; // A4 width
  clone.style.padding = '20px';
  clone.style.margin = '0 auto';
  clone.style.background = '#fff';
  clone.style.border = 'none';
  return clone;
};

/**
 * Enhances elements for PDF rendering (styles, visibility)
 * @param container The container with elements to enhance
 */
export const enhanceElementsForPDF = (container: HTMLElement): void => {
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
};
