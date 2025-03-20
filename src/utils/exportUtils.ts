import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, ImageRun, Table, TableRow, TableCell } from 'docx';
import { birthPlanSections } from '../components/BirthPlan/utils/birthPlanSections';

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
      clone.style.position = 'relative';
      clone.style.width = '100%';
      clone.style.maxWidth = '210mm'; // A4 width
      clone.style.padding = '20px';
      clone.style.margin = '0 auto';
      clone.style.background = '#fff';
      clone.style.border = 'none';
      
      // Create a temporary container with A4 proportions
      const container = document.createElement('div');
      container.style.width = '210mm'; // A4 width
      container.style.minHeight = '297mm'; // A4 height
      container.style.margin = '0 auto';
      container.style.padding = '0';
      container.style.backgroundColor = '#fff';
      container.style.position = 'absolute';
      container.style.left = '-9999px';
      container.style.top = '0';
      document.body.appendChild(container);
      
      // Create header with title and disclaimer
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
      
      // Insert header at the beginning of container
      container.appendChild(header);
      
      // Add the main content
      container.appendChild(clone);
      
      // Create footer
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
      
      // Add the footer to the container
      container.appendChild(footer);
      
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
      
      // Create PDF with A4 size
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });
      
      // A4 dimensions with margins
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15; // 1.5cm margin
      
      // Calculate content dimensions
      const contentWidth = pageWidth - (margin * 2);
      const contentHeight = (canvas.height * contentWidth) / canvas.width;
      
      // Add the content as an image on the first page
      pdf.addImage(
        imgData, 
        'PNG', 
        margin, // left margin
        margin, // top margin
        contentWidth, 
        contentHeight
      );
      
      // Add page numbers
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(100);
        pdf.text(`Página ${i}`, pageWidth - 25, pageHeight - 10);
      }
      
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

/**
 * Exports birth plan data as a Word document
 * @param birthPlan The birth plan data object
 * @param filename The name of the Word document to download
 */
export const exportAsWord = async (birthPlan: Record<string, any>, filename: string): Promise<void> => {
  try {
    // Create a new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Title with logo would go here in a table
            new Paragraph({
              text: "PLANO DE PARTO",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: {
                after: 200,
              },
            }),
            
            // Disclaimer
            new Paragraph({
              children: [
                new TextRun({
                  text: "Este documento reflete minhas preferências para o parto e nascimento do meu bebê. Ele foi elaborado após " +
                    "cuidadosa pesquisa e reflexão, em colaboração com meu parceiro e equipe de saúde. Compreendo que " +
                    "situações imprevistas podem surgir durante o trabalho de parto, e que a saúde e bem-estar do " +
                    "bebê e meu são prioridade. Peço gentilmente que, na ausência de emergências médicas, minhas " +
                    "escolhas sejam respeitadas, e que quaisquer intervenções necessárias sejam discutidas comigo " +
                    "antes de serem realizadas.",
                  size: 20,
                  color: "666666",
                }),
              ],
              spacing: {
                after: 400,
              },
            }),
            
            // Personal Information Section
            ...generatePersonalInfoSection(birthPlan.personalInfo || {}),
            
            // Generate all other sections
            ...generateBirthPlanSections(birthPlan),
            
            // Signature Section
            ...generateSignatureSection(birthPlan.personalInfo || {}),
            
            // Footer
            new Paragraph({
              children: [
                new TextRun({
                  text: `© ${new Date().getFullYear()} Energia Materna - www.energiamaterna.com.br`,
                  size: 16,
                  color: "666666",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: {
                before: 400,
              },
            }),
          ],
        },
      ],
    });
    
    // Generate the document as a blob
    const buffer = await Packer.toBlob(doc);
    
    // Create a download link and trigger download
    const url = URL.createObjectURL(buffer);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    
    return Promise.resolve();
  } catch (error) {
    console.error('Error generating Word document:', error);
    return Promise.reject(error);
  }
};

/**
 * Helper function to generate the Personal Information section for Word export
 */
const generatePersonalInfoSection = (personalInfo: Record<string, any>) => {
  const children: Paragraph[] = [
    new Paragraph({
      text: "Informações Pessoais",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 200,
        after: 200,
      },
    }),
  ];
  
  const personalFields = [
    { key: 'name', label: 'Nome' },
    { key: 'dueDate', label: 'Data prevista' },
    { key: 'birthLocation', label: 'Local planejado para o parto' },
    { key: 'hospital', label: 'Hospital/Maternidade' },
    { key: 'hospitalAddress', label: 'Endereço' },
    { key: 'hospitalPhone', label: 'Telefone' },
    { key: 'healthProvider', label: 'Médico/Obstetra' },
    { key: 'healthProviderContact', label: 'Telefone do Médico/Obstetra' },
    { key: 'healthProviderRegistry', label: 'CRM' },
    { key: 'pediatrician', label: 'Pediatra' },
    { key: 'pediatricianContact', label: 'Telefone do Pediatra' },
    { key: 'pediatricianRegistry', label: 'CRM do Pediatra' },
    { key: 'doula', label: 'Doula' },
    { key: 'doulaContact', label: 'Telefone da Doula' },
    { key: 'doulaRegistry', label: 'Certificação da Doula' },
  ];
  
  personalFields.forEach(field => {
    if (personalInfo[field.key]) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${field.label}: `,
              bold: true,
            }),
            new TextRun(personalInfo[field.key]),
          ],
          spacing: {
            after: 100,
          },
        })
      );
    }
  });
  
  return children;
};

/**
 * Helper function to generate all birth plan sections for Word export
 */
const generateBirthPlanSections = (birthPlan: Record<string, any>) => {
  const children: Paragraph[] = [];
  
  // Map section IDs to display names in Portuguese
  const sectionNameMap: Record<string, string> = {
    personalInfo: 'Informações Pessoais',
    atmosfera: 'Atmosfera e Ambiente',
    trabalhoDeParto: 'Trabalho de Parto',
    nascimento: 'Nascimento',
    cesarea: 'Em Caso de Cesárea',
    posParto: 'Pós-Parto',
    situacoesEspeciais: 'Situações Especiais',
    // Legacy names - keeping for backward compatibility
    atmosphere: 'Atmosfera e Ambiente',
    laborPreferences: 'Trabalho de Parto',
    painManagement: 'Alívio da Dor',
    delivery: 'Parto',
    newborn: 'Cuidados com o Recém-Nascido',
    cesarean: 'Cesárea (Se Necessária)',
    postpartum: 'Pós-Parto',
    specialSituations: 'Situações Especiais'
  };
  
  // Process each section
  Object.entries(birthPlan).forEach(([sectionKey, sectionData]) => {
    if (sectionKey === 'personalInfo' || !sectionData || typeof sectionData !== 'object') {
      return;
    }
    
    // Add section title in Portuguese
    children.push(
      new Paragraph({
        text: sectionNameMap[sectionKey] || sectionKey,
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 300,
          after: 200,
        },
      })
    );
    
    // Debug log to see which fields we're processing
    console.log(`Processing section ${sectionKey} with data:`, sectionData);
    
    // Add each field in the section
    Object.entries(sectionData as Record<string, any>).forEach(([key, value]) => {
      if (!value) return;
      
      // Find the display label for this field from birthPlanSections
      const section = birthPlanSections.find(s => s.id === sectionKey);
      const fieldDef = section?.fields.find(f => f.key === key);
      const fieldLabel = fieldDef?.label || key;
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: fieldLabel,
              bold: true,
            }),
          ],
          spacing: {
            after: 100,
          },
        })
      );
      
      // Format the content
      const content = Array.isArray(value) ? value.join(", ") : value;
      
      children.push(
        new Paragraph({
          text: content,
          spacing: {
            after: 200,
          },
        })
      );
    });
  });
  
  return children;
};

/**
 * Helper function to generate signature section for Word export
 */
const generateSignatureSection = (personalInfo: Record<string, any>) => {
  return [
    new Paragraph({
      text: "Assinaturas",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        before: 400,
        after: 200,
      },
      border: {
        bottom: {
          color: "000000",
          space: 1,
          style: BorderStyle.SINGLE,
          size: 1,
        },
      },
    }),
    
    // Table for signatures
    new Table({
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "",
                  spacing: {
                    after: 200,
                  },
                  border: {
                    bottom: {
                      color: "000000",
                      space: 1,
                      style: BorderStyle.SINGLE,
                      size: 1,
                    },
                  },
                }),
                new Paragraph({
                  text: personalInfo.name || "",
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  text: "Gestante",
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    after: 200,
                  },
                }),
              ],
              width: {
                size: 50,
                type: "pct",
              },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "",
                  spacing: {
                    after: 200,
                  },
                  border: {
                    bottom: {
                      color: "000000",
                      space: 1,
                      style: BorderStyle.SINGLE,
                      size: 1,
                    },
                  },
                }),
                new Paragraph({
                  text: personalInfo.healthProvider || "_________________",
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  text: "Médico/Obstetra",
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  text: `CRM: ${personalInfo.healthProviderRegistry || "_________________"}`,
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    after: 200,
                  },
                }),
              ],
              width: {
                size: 50,
                type: "pct",
              },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  text: "",
                  spacing: {
                    after: 200,
                  },
                  border: {
                    bottom: {
                      color: "000000",
                      space: 1,
                      style: BorderStyle.SINGLE,
                      size: 1,
                    },
                  },
                }),
                new Paragraph({
                  text: personalInfo.pediatrician || "_________________",
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  text: "Pediatra Neonatal",
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  text: `CRM: ${personalInfo.pediatricianRegistry || "_________________"}`,
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    after: 200,
                  },
                }),
              ],
              width: {
                size: 50,
                type: "pct",
              },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  text: "",
                  spacing: {
                    after: 200,
                  },
                  border: {
                    bottom: {
                      color: "000000",
                      space: 1,
                      style: BorderStyle.SINGLE,
                      size: 1,
                    },
                  },
                }),
                new Paragraph({
                  text: personalInfo.doula || "_________________",
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  text: "Doula",
                  alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                  text: `Registro: ${personalInfo.doulaRegistry || "_________________"}`,
                  alignment: AlignmentType.CENTER,
                  spacing: {
                    after: 200,
                  },
                }),
              ],
              width: {
                size: 50,
                type: "pct",
              },
            }),
          ],
        }),
      ],
      width: {
        size: 100,
        type: "pct",
      },
    }),
  ];
};
