
/**
 * Renders the footer for the birth plan
 * @param container The container element to render into
 */
export const renderFooter = (container: HTMLElement): void => {
  // Add footer with date
  const footer = document.createElement('div');
  footer.className = 'mt-8 text-center';
  footer.textContent = `Criado em ${new Date().toLocaleDateString()}`;
  container.appendChild(footer);
};
