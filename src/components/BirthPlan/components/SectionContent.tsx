
import { FieldEditor } from './FieldEditor';
import { useFieldUtils } from '../hooks/useFieldUtils';

interface SectionContentProps {
  activeSection: {
    id: string;
    title: string;
    color?: string;
    fields: Array<{
      key: string;
      label: string;
    }>;
  };
  birthPlan: Record<string, any>;
  onFieldChange: (sectionId: string, fieldKey: string, value: any) => void;
  questionnaireAnswers: Record<string, any>;
}

export function SectionContent({
  activeSection,
  birthPlan,
  onFieldChange,
  questionnaireAnswers
}: SectionContentProps) {
  const { shouldShowAddButton } = useFieldUtils();

  return (
    <div className={`bg-white border-l-4 border-maternal-${activeSection.color || '400'} rounded-lg p-6 mb-6 shadow-md`}>
      <h2 className="text-2xl font-semibold text-maternal-700 mb-4">{activeSection.title}</h2>
      
      {activeSection.fields.map((field) => {
        const sectionData = birthPlan[activeSection.id] || {};
        const fieldValue = sectionData[field.key] || '';
        const showAddButton = shouldShowAddButton(field.key, questionnaireAnswers);
        
        return (
          <FieldEditor
            key={field.key}
            sectionId={activeSection.id}
            field={field}
            value={fieldValue}
            onChange={onFieldChange}
            questionnaireAnswers={questionnaireAnswers}
            showAddButton={showAddButton}
          />
        );
      })}
    </div>
  );
}
