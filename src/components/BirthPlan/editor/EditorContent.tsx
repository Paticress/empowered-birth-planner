import { useEffect } from 'react';
import { EditorField } from './EditorField';
import { birthPlanSections } from '../utils/birthPlanSections';
import { 
  getSingleLineFields, 
  shouldShowAddButton, 
  getRelevantQuestionsForField,
  formatFieldValueFromQuestionnaire
} from './utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAlwaysShowAddButtonFields } from './utils/fieldConfig';

interface EditorContentProps {
  activeSectionIndex: number;
  localBirthPlan: Record<string, any>;
  handleFieldChange: (sectionId: string, fieldKey: string, value: any) => void;
  resetOptionsForField: (fieldKey: string) => void;
  activeFieldKey: string;
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: (value: Record<string, Record<string, boolean>>) => void;
  questionnaireAnswers: Record<string, any>;
  handleAddSelectedOptions: () => void;
}

export function EditorContent({
  activeSectionIndex,
  localBirthPlan,
  handleFieldChange,
  resetOptionsForField,
  activeFieldKey,
  dialogOpen,
  setDialogOpen,
  selectedOptions,
  setSelectedOptions,
  questionnaireAnswers,
  handleAddSelectedOptions
}: EditorContentProps) {
  const activeSection = birthPlanSections[activeSectionIndex];
  const singleLineFields = getSingleLineFields();
  const isMobile = useIsMobile();
  const specialFields = getAlwaysShowAddButtonFields();

  // Debug logging for special situations section
  if (activeSection.id === 'situacoesEspeciais') {
    console.log("Rendering special situations section");
    console.log("Current questionnaire answers:", questionnaireAnswers);
    console.log("Current birth plan for this section:", localBirthPlan[activeSection.id]);
  }

  // Ensure special fields are populated with questionnaire answers on initial load
  useEffect(() => {
    // Initialize section if it doesn't exist
    if (!localBirthPlan[activeSection.id]) {
      return;
    }
    
    // Check for special situations section specifically
    if (activeSection.id === 'situacoesEspeciais') {
      console.log("Initializing special situations fields");
      
      // Look at each special field and initialize if empty
      activeSection.fields.forEach(field => {
        if (specialFields.includes(field.key)) {
          console.log(`Checking special field ${field.key}`);
          
          // Only initialize if the field is empty
          const currentValue = localBirthPlan[activeSection.id]?.[field.key] || '';
          if (currentValue === '') {
            // Get relevant questions for this field
            const relevantQuestions = getRelevantQuestionsForField(field.key, questionnaireAnswers);
            console.log(`Found ${relevantQuestions.length} relevant questions for ${field.key}`);
            
            // Format questionnaire answers for this field
            const formattedValue = formatFieldValueFromQuestionnaire(field.key, questionnaireAnswers);
            
            // If we have a value, update the field
            if (formattedValue) {
              console.log(`Setting value for ${field.key}:`, formattedValue);
              handleFieldChange(activeSection.id, field.key, formattedValue);
            }
          }
        }
      });
    }
  }, [activeSection.id, localBirthPlan]);

  // Clean field values that might contain prefixes or content from other fields
  useEffect(() => {
    const currentSection = localBirthPlan[activeSection.id];
    if (!currentSection) return;

    // Check if any field contains mixed content that needs to be separated
    let needsCleanup = false;
    const cleanedSection = { ...currentSection };

    // For each field in this section
    activeSection.fields.forEach(field => {
      const fieldValue = cleanedSection[field.key];
      if (typeof fieldValue === 'string' && fieldValue !== '') {
        // Get the relevant questions for this specific field
        const relevantQuestions = getRelevantQuestionsForField(field.key, questionnaireAnswers);
        const relevantQuestionTexts = relevantQuestions.map(q => q.question.text);
        
        // Split field value by double newline
        const lines = fieldValue.split('\n\n');
        
        // If we have multiple lines, check if they belong to this field
        if (lines.length > 1) {
          needsCleanup = true;
          console.log(`Cleaning up field ${field.key} with ${lines.length} lines`);
          
          // We'll keep only lines that don't belong to other fields
          const cleanedLines = lines.filter(line => {
            // Check if this line contains other field's content by checking question texts
            for (const questionText of relevantQuestionTexts) {
              if (line.includes(questionText)) {
                return true; // Keep this line since it's related to this field
              }
            }
            
            // Keep lines that don't have a clear association with another field
            // This is a fallback - we'll keep lines that don't have obvious markers of other fields
            return !line.includes('Preferências para') && !line.includes(': ');
          });
          
          // Update the field with only relevant content
          if (cleanedLines.length > 0) {
            cleanedSection[field.key] = cleanedLines.join('\n\n');
          } else {
            // If no lines are left, use the original content but make sure it doesn't have prefixes
            const cleanedContent = lines.map(line => {
              // Remove prefixes like "Preferências para X: "
              if (line.includes(':')) {
                const parts = line.split(':');
                if (parts[0].includes('Preferências') || parts[0].trim().length > 15) {
                  return parts.slice(1).join(':').trim();
                }
              }
              return line;
            }).join('\n\n');
            
            cleanedSection[field.key] = cleanedContent;
          }
        }
      }
    });

    // Update the local birth plan if we cleaned anything
    if (needsCleanup) {
      handleFieldChange(activeSection.id, '__sectionUpdate', cleanedSection);
    }
  }, [activeSection.id, activeSectionIndex]);

  return (
    <div className={`bg-white border-l-4 border-maternal-${activeSection.color || '400'} rounded-lg p-4 md:p-6 mb-4 md:mb-6 shadow-md`}>
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-maternal-700 mb-3 md:mb-4`}>
        {activeSection.title}
      </h2>
      
      {activeSection.fields.map((field) => {
        const sectionData = localBirthPlan[activeSection.id] || {};
        const useSingleLineInput = singleLineFields.includes(field.key);
        
        // Calculate whether to show the add button
        const showAddFromQuestionnaire = shouldShowAddButton(field.key, questionnaireAnswers);
          
        return (
          <EditorField 
            key={field.key}
            field={field}
            activeSection={activeSection}
            sectionData={sectionData}
            handleFieldChange={handleFieldChange}
            shouldShowAddButton={() => showAddFromQuestionnaire}
            useSingleLineInput={useSingleLineInput}
            resetOptionsForField={resetOptionsForField}
            activeFieldKey={activeFieldKey}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            getRelevantQuestionsForField={(fieldKey) => getRelevantQuestionsForField(fieldKey, questionnaireAnswers)}
            handleAddSelectedOptions={handleAddSelectedOptions}
            questionnaireAnswers={questionnaireAnswers}
          />
        );
      })}
    </div>
  );
}
