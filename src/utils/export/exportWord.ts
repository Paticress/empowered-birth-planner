import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell } from 'docx';
import { BirthPlanSection, BirthPlanField } from '@/components/BirthPlan/utils/birthPlanSections';
import { birthPlanSections } from '@/components/BirthPlan/utils/birthPlanSections';

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
