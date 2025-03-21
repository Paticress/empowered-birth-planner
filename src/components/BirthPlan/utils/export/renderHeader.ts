
/**
 * Renders the title and introduction for the birth plan export
 * @param container The container element to render into
 */
export const renderHeader = (container: HTMLElement): void => {
  // Add title and introduction
  const titleContainer = document.createElement('div');
  titleContainer.className = 'flex justify-between items-center mb-4';
  
  const title = document.createElement('h1');
  title.className = 'text-2xl font-bold';
  title.textContent = 'PLANO DE PARTO';
  titleContainer.appendChild(title);
  
  const logo = document.createElement('img');
  logo.src = '/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png';
  logo.alt = 'Energia Materna';
  logo.className = 'h-12';
  titleContainer.appendChild(logo);
  container.appendChild(titleContainer);
  
  // Add the disclaimer
  const disclaimer = document.createElement('p');
  disclaimer.className = 'text-sm text-gray-700 mt-2 mb-6';
  disclaimer.textContent = 'Este documento reflete minhas preferências para o parto e nascimento do meu bebê. Ele foi elaborado após ' +
    'cuidadosa pesquisa e reflexão, em colaboração com meu parceiro e equipe de saúde. Compreendo que ' +
    'situações imprevistas podem surgir durante o trabalho de parto, e que a saúde e bem-estar do ' +
    'bebê e meu são prioridade. Peço gentilmente que, na ausência de emergências médicas, minhas ' +
    'escolhas sejam respeitadas, e que quaisquer intervenções necessárias sejam discutidas comigo ' +
    'antes de serem realizadas.';
  container.appendChild(disclaimer);
};
