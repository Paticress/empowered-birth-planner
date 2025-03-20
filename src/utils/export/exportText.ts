
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
