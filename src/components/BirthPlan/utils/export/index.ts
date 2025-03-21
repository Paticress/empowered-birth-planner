
import { renderHeader } from './renderHeader';
import { renderBirthPlanContent } from './renderContent';
import { renderSignatures } from './renderSignatures';
import { renderFooter } from './renderFooter';
import { getSectionDisplayName } from '../birthPlanUtils';

/**
 * Renders birth plan content into the DOM for export
 * @param birthPlanData The birth plan data to render
 * @param containerId The ID of the container to render into
 */
export const renderBirthPlanForExport = (
  birthPlanData: Record<string, any>, 
  containerId: string = 'birth-plan-content'
): void => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Clear previous content
  container.innerHTML = '';
  
  // Render each section of the document
  renderHeader(container);
  renderBirthPlanContent(birthPlanData, container);
  renderSignatures(birthPlanData.personalInfo || {}, container);
  renderFooter(container);
  
  // Make the container visible for export
  container.style.display = 'block';
};

// Export everything for use in other modules
export {
  renderHeader,
  renderBirthPlanContent,
  renderSignatures,
  renderFooter,
  getSectionDisplayName
};
