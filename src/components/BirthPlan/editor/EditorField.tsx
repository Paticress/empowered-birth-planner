
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { OptionsDialog } from './OptionsDialog';
import { useIsMobile } from '@/hooks/use-mobile';
import { getAlwaysShowAddButtonFields } from './utils/fieldConfig';
import { formatFieldValueFromQuestionnaire } from './utils/optionFormatting';

interface EditorFieldProps {
  field: { key: string; label: string };
  activeSection: { id: string; title: string; color?: string; fields: Array<{ key: string; label: string }> };
  sectionData: Record<string, any>;
  handleFieldChange: (sectionId: string, fieldKey: string, value: any) => void;
  shouldShowAddButton: (fieldKey: string) => boolean;
  useSingleLineInput: boolean;
  resetOptionsForField: (fieldKey: string) => void;
  activeFieldKey: string;
  dialogOpen: boolean;
  setDialogOpen: (value: boolean) => void;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  getRelevantQuestionsForField: (fieldKey: string) => Array<{question: any, sectionId: string}>;
  handleAddSelectedOptions: () => void;
  questionnaireAnswers: Record<string, any>;
  textareaValues: Record<string, string>;
  setTextareaValues: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export function EditorField({
  field,
  activeSection,
  sectionData,
  handleFieldChange,
  shouldShowAddButton,
  useSingleLineInput,
  resetOptionsForField,
  activeFieldKey,
  dialogOpen,
  setDialogOpen,
  selectedOptions,
  setSelectedOptions,
  getRelevantQuestionsForField,
  handleAddSelectedOptions,
  questionnaireAnswers,
  textareaValues,
  setTextareaValues
}: EditorFieldProps) {
  // Get current field value
  const fieldValue = sectionData[field.key] || '';
  const [hasInitialized, setHasInitialized] = useState(false);
  const showAddButton = shouldShowAddButton(field.key);
  const isMobile = useIsMobile();
  
  // Check if this is a contact or registry field for any professional
  const isContactField = field.key.toLowerCase().includes('contact');
  const isRegistryField = field.key.toLowerCase().includes('registry');
  
  // List of special fields
  const specialFields = getAlwaysShowAddButtonFields();
  
  // Force single line input for contact and registry fields
  const useInputField = useSingleLineInput || isContactField || isRegistryField;
  
  // Special debug for problematic fields
  if (['emergencyScenarios', 'highRiskComplications', 'lowRiskOccurrences'].includes(field.key)) {
    console.log(`Rendering special field: ${field.key}`);
    console.log(`Current value: "${fieldValue}"`);
    console.log(`Has initialized: ${hasInitialized}`);
    
    // Check if this field has any answers in the questionnaire
    const relevantQuestions = getRelevantQuestionsForField(field.key);
    console.log(`Found ${relevantQuestions.length} relevant questions`);
    
    relevantQuestions.forEach(q => {
      const questionId = q.question?.id;
      if (questionId) {
        console.log(`Question ${questionId} has answer:`, !!questionnaireAnswers[questionId]);
        if (questionnaireAnswers[questionId]) {
          console.log(`Answer:`, questionnaireAnswers[questionId]);
        }
      }
    });
  }
  
  // Initialize the field with questionnaire answers if it's a special field and empty
  useEffect(() => {
    if (specialFields.includes(field.key) && !hasInitialized) {
      console.log(`Initializing special field ${field.key} from questionnaire (value: "${fieldValue}")`);
      
      // Only populate if the field is empty
      if (!fieldValue) {
        const formattedValue = formatFieldValueFromQuestionnaire(field.key, questionnaireAnswers);
        if (formattedValue) {
          console.log(`Setting initial value for ${field.key}:`, formattedValue);
          handleFieldChange(activeSection.id, field.key, formattedValue);
        } else {
          console.log(`No formatted value for ${field.key}`);
        }
      }
      
      setHasInitialized(true);
    }
  }, [field.key, activeSection.id, questionnaireAnswers, fieldValue, hasInitialized, specialFields, handleFieldChange]);
  
  // Handle opening the options dialog for this field
  const handleOpenOptionsDialog = () => {
    console.log(`Opening dialog for field: ${field.key}`);
    
    // Call resetOptionsForField to initialize options for this field
    // This will properly initialize options from current field value and questionnaire
    resetOptionsForField(field.key);
  };
  
  return (
    <div className="mb-4 md:mb-6 border border-maternal-100 rounded-lg p-3 md:p-4 bg-maternal-50/30">
      <div className={`flex flex-col ${!isMobile ? 'sm:flex-row sm:justify-between sm:items-center' : ''} mb-2`}>
        <label 
          htmlFor={`${activeSection.id}-${field.key}`} 
          className="block font-medium text-maternal-800 text-sm md:text-base mb-2 sm:mb-0"
        >
          {field.label}
        </label>
        
        {showAddButton && (
          <Dialog 
            open={dialogOpen && activeFieldKey === field.key} 
            onOpenChange={(open) => {
              if (!open) {
                setDialogOpen(false);
              }
            }}
          >
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 border-maternal-300 text-maternal-600 text-xs w-full sm:w-auto justify-center sm:justify-start mt-1 sm:mt-0"
                onClick={handleOpenOptionsDialog}
              >
                <Plus className="h-3 w-3" /> Adicionar do Questionário
              </Button>
            </DialogTrigger>
            <OptionsDialog 
              dialogOpen={dialogOpen}
              setDialogOpen={setDialogOpen}
              activeFieldKey={activeFieldKey}
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              getRelevantQuestionsForField={getRelevantQuestionsForField}
              handleAddSelectedOptions={handleAddSelectedOptions}
              questionnaireAnswers={questionnaireAnswers}
              textareaValues={textareaValues}
              setTextareaValues={setTextareaValues}
            />
          </Dialog>
        )}
      </div>
      
      {useInputField ? (
        <Input
          id={`${activeSection.id}-${field.key}`}
          value={fieldValue}
          onChange={(e) => handleFieldChange(
            activeSection.id, 
            field.key, 
            e.target.value
          )}
          className="w-full border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
          placeholder={`Insira ${field.label.toLowerCase()}`}
        />
      ) : (
        <Textarea
          id={`${activeSection.id}-${field.key}`}
          value={fieldValue}
          onChange={(e) => handleFieldChange(
            activeSection.id, 
            field.key, 
            e.target.value
          )}
          rows={isMobile ? 4 : 6}
          className="w-full border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
          placeholder={`Insira suas preferências para ${field.label.toLowerCase()}`}
        />
      )}
    </div>
  );
}
