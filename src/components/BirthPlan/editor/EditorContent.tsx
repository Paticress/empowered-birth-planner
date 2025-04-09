
import { EditorField } from './EditorField';
import { birthPlanSections } from '../utils/birthPlanSections';
import { 
  getSingleLineFields, 
  shouldShowAddButton, 
  getRelevantQuestionsForField,
  getSpecialFields
} from './utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useEffect } from 'react';

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
  const specialFields = getSpecialFields();

  // Log the questionnaire answers for debugging
  console.log("Questionnaire answers for section:", activeSection.id, questionnaireAnswers);
  console.log("Local birth plan for section:", activeSection.id, localBirthPlan[activeSection.id]);
  
  // Special handling for textarea fields on first render
  useEffect(() => {
    if (activeSection.id === 'situacoesEspeciais' && questionnaireAnswers) {
      // Check for textarea fields that should be auto-filled
      const textareaFields = ['unexpectedScenarios', 'specialWishes'];
      
      textareaFields.forEach(fieldKey => {
        if (questionnaireAnswers[fieldKey] && 
            (!localBirthPlan[activeSection.id] || !localBirthPlan[activeSection.id][fieldKey])) {
          // Auto-fill this textarea field
          console.log(`Auto-filling textarea field ${fieldKey} with:`, questionnaireAnswers[fieldKey]);
          handleFieldChange(activeSection.id, fieldKey, questionnaireAnswers[fieldKey]);
        }
      });
    }
  }, [activeSectionIndex, questionnaireAnswers]);

  return (
    <div className={`bg-white border-l-4 border-maternal-${activeSection.color || '400'} rounded-lg p-4 md:p-6 mb-4 md:mb-6 shadow-md`}>
      <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-maternal-700 mb-3 md:mb-4`}>
        {activeSection.title}
      </h2>
      
      {activeSection.fields.map((field) => {
        const sectionData = localBirthPlan[activeSection.id] || {};
        const useSingleLineInput = singleLineFields.includes(field.key);
        
        // Override shouldShowAddButton for special fields
        const showAddFromQuestionnaire = specialFields.includes(field.key) ||
          shouldShowAddButton(field.key, questionnaireAnswers);
          
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
          />
        );
      })}
    </div>
  );
}
