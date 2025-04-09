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
  getRelevantQuestionsForField: (fieldKey: string) => Array<{question: any, sectionId: string}>;
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
  handleAddSelectedOptions,
  getRelevantQuestionsForField
}: EditorContentProps) {
  const activeSection = birthPlanSections[activeSectionIndex];
  const singleLineFields = getSingleLineFields();
  const isMobile = useIsMobile();
  const specialFields = getAlwaysShowAddButtonFields();

  // Debug logging for special situations section
  if (activeSection.id === 'situacoesEspeciais') {
    console.log("Rendering special situations section");
    console.log("Current questionnaire answer keys:", Object.keys(questionnaireAnswers));
    console.log("Current birth plan for this section:", localBirthPlan[activeSection.id]);
    
    // Check specific problematic field answers
    const debugQuestionIds = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'];
    debugQuestionIds.forEach(questionId => {
      console.log(`Question ${questionId} answer:`, questionnaireAnswers[questionId]);
      if (questionnaireAnswers[questionId] && typeof questionnaireAnswers[questionId] === 'object') {
        console.log(`Selected options:`, Object.entries(questionnaireAnswers[questionId])
          .filter(([_, selected]) => selected)
          .map(([option]) => option));
      }
    });
    
    // Check if any of our special fields have content
    const specialFieldKeys = ['emergencyScenarios', 'highRiskComplications', 'lowRiskOccurrences'];
    specialFieldKeys.forEach(fieldKey => {
      const value = localBirthPlan[activeSection.id]?.[fieldKey] || '';
      console.log(`Field ${fieldKey} current value: "${value}"`);
    });
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
            const relevantQuestions = getRelevantQuestionsForField(field.key);
            console.log(`Found ${relevantQuestions.length} relevant questions for ${field.key}`);
            
            // Print the question IDs for debugging
            if (relevantQuestions.length > 0) {
              console.log("Question IDs:", relevantQuestions.map(q => q.question?.id));
            }
            
            // Format questionnaire answers for this field
            const formattedValue = formatFieldValueFromQuestionnaire(field.key, questionnaireAnswers);
            
            // If we have a value, update the field
            if (formattedValue) {
              console.log(`Setting value for ${field.key}:`, formattedValue);
              handleFieldChange(activeSection.id, field.key, formattedValue);
            } else {
              console.log(`No formatted value for ${field.key}`);
            }
          }
        }
      });
    }
  }, [activeSection.id, questionnaireAnswers]);

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
        // Split field value by double newline
        const lines = fieldValue.split('\n\n');
        
        // If we have multiple lines, ensure each line belongs to this field
        if (lines.length > 1) {
          // We'll keep all lines since the content is now cleaned in the handleAddSelectedOptions function
          // This is just an extra safeguard
          cleanedSection[field.key] = lines.join('\n\n');
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
            getRelevantQuestionsForField={getRelevantQuestionsForField}
            handleAddSelectedOptions={handleAddSelectedOptions}
            questionnaireAnswers={questionnaireAnswers}
          />
        );
      })}
    </div>
  );
}
