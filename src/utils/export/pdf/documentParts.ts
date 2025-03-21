
/**
 * Creates a header element for the PDF document
 * @returns The created header element
 */
export const createDocumentHeader = (): HTMLDivElement => {
  const header = document.createElement('div');
  header.className = 'pdf-header';
  header.style.marginBottom = '20px';
  
  // Title and logo container
  const titleContainer = document.createElement('div');
  titleContainer.style.display = 'flex';
  titleContainer.style.justifyContent = 'space-between';
  titleContainer.style.alignItems = 'center';
  titleContainer.style.marginBottom = '10px';
  
  // Add title
  const title = document.createElement('h1');
  title.textContent = 'PLANO DE PARTO';
  title.style.fontSize = '24px';
  title.style.fontWeight = 'bold';
  title.style.margin = '0';
  titleContainer.appendChild(title);
  
  // Add logo
  const logo = document.createElement('img');
  logo.src = '/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png';
  logo.alt = 'Energia Materna';
  logo.style.height = '48px';
  titleContainer.appendChild(logo);
  
  header.appendChild(titleContainer);
  
  // Add disclaimer text
  const disclaimer = document.createElement('p');
  disclaimer.style.fontSize = '12px';
  disclaimer.style.color = '#666';
  disclaimer.style.marginTop = '8px';
  disclaimer.style.marginBottom = '16px';
  disclaimer.textContent = 'Este documento reflete minhas preferências para o parto e nascimento do meu bebê. Ele foi elaborado após ' +
    'cuidadosa pesquisa e reflexão, em colaboração com meu parceiro e equipe de saúde. Compreendo que ' +
    'situações imprevistas podem surgir durante o trabalho de parto, e que a saúde e bem-estar do ' +
    'bebê e meu são prioridade. Peço gentilmente que, na ausência de emergências médicas, minhas ' +
    'escolhas sejam respeitadas, e que quaisquer intervenções necessárias sejam discutidas comigo ' +
    'antes de serem realizadas.';
  header.appendChild(disclaimer);
  
  return header;
};

/**
 * Creates a footer element for the PDF document
 * @returns The created footer element
 */
export const createDocumentFooter = (): HTMLDivElement => {
  const footer = document.createElement('div');
  footer.className = 'pdf-footer';
  footer.style.marginTop = '20px';
  footer.style.borderTop = '1px solid #eee';
  footer.style.paddingTop = '10px';
  footer.style.display = 'flex';
  footer.style.justifyContent = 'space-between';
  footer.style.alignItems = 'center';
  
  const footerLogo = document.createElement('img');
  footerLogo.src = '/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png';
  footerLogo.alt = 'Energia Materna';
  footerLogo.style.height = '30px';
  
  const footerText = document.createElement('p');
  footerText.style.fontSize = '10px';
  footerText.style.color = '#666';
  footerText.style.margin = '0';
  footerText.textContent = `© ${new Date().getFullYear()} Energia Materna - www.energiamaterna.com.br`;
  
  footer.appendChild(footerLogo);
  footer.appendChild(footerText);
  
  return footer;
};
