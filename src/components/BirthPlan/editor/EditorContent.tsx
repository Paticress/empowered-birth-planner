
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

  // Log the questionnaire answers for debugging
  console.log("Questionnaire answers for section:", activeSection.id, questionnaireAnswers);
  console.log("Local birth plan for section:", activeSection.id, localBirthPlan[activeSection.id]);

  // Ensure special fields are populated with questionnaire answers on initial load
  useEffect(() => {
    if (!localBirthPlan[activeSection.id]) {
      return;
    }

    // Check each field in the current section
    activeSection.fields.forEach(field => {
      // Only process special fields that don't already have content
      if (specialFields.includes(field.key) && 
          (!localBirthPlan[activeSection.id]?.[field.key] || 
           localBirthPlan[activeSection.id][field.key] === '')) {
        
        // Get formatted value from questionnaire answers
        const formattedValue = formatFieldValueFromQuestionnaire(field.key, questionnaireAnswers);
        
        // If we have a formatted value, update the field
        if (formattedValue) {
          handleFieldChange(activeSection.id, field.key, formattedValue);
        }
      }
    });
  }, [activeSection.id, localBirthPlan, questionnaireAnswers]);

  return (
    <div className={`bg-white border-l-4 border-maternal-${activeSection.color || '400'} rounded-lg p-4 md:p-6 mb-4 md:mb-6 shadow-md`}>
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-maternal-700 mb-3 md:mb-4`}>
        {activeSection.title}
      </h2>
      
      {activeSection.fields.map((field) => {
        const sectionData = localBirthPlan[activeSection.id] || {};
        const useSingleLineInput = singleLineFields.includes(field.key);
        
        // Calculate whether to show the add button - should be shown for all fields now
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
