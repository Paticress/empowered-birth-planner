
import { useEffect, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface SelectableOptionsProps {
  question: any;
  questionId: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: (value: Record<string, Record<string, boolean>>) => void;
  isSpecialField?: boolean;
  questionnaireAnswers?: Record<string, any>;
}

export function SelectableOptions({ 
  question, 
  questionId, 
  selectedOptions, 
  setSelectedOptions,
  isSpecialField = false,
  questionnaireAnswers = {}
}: SelectableOptionsProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  
  if (!question.options || question.options.length === 0) {
    console.warn(`No options found for question ${questionId}`);
    return null;
  }
  
  // Debug para questões especiais
  if (['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId)) {
    console.log(`SelectableOptions para questão especial: ${questionId}`);
    console.log(`Tem resposta:`, !!questionnaireAnswers[questionId]);
    console.log(`Opções:`, question.options);
  }
  
  // BUGFIX: Remover a inicialização automática baseada apenas no questionário
  // Agora a inicialização é feita no hook useEditorState e passada como prop
  
  const handleCheckedChange = (option: string, checked: boolean) => {
    // Criar uma cópia do estado atual
    const newSelectedOptions = { ...selectedOptions };
    
    // Inicializar a entrada da questão se não existir
    if (!newSelectedOptions[questionId]) {
      newSelectedOptions[questionId] = {};
    }
    
    // Para radio buttons (seleção única), desmarcar todas as outras opções primeiro
    if ((question.type === 'radio' || question.type === 'select') && !isSpecialField) {
      Object.keys(newSelectedOptions[questionId] || {}).forEach(opt => {
        newSelectedOptions[questionId][opt] = false;
      });
    }
    
    // Definir a opção selecionada
    newSelectedOptions[questionId][option] = checked;
    
    setSelectedOptions(newSelectedOptions);
  };
  
  // Lidar com seleção de radio (seleção única)
  const handleRadioSelection = (option: string) => {
    const newSelectedOptions = { ...selectedOptions };
    
    // Inicializar a entrada da questão se não existir
    if (!newSelectedOptions[questionId]) {
      newSelectedOptions[questionId] = {};
    }
    
    // Desmarcar todas as opções
    Object.keys(newSelectedOptions[questionId] || {}).forEach(opt => {
      newSelectedOptions[questionId][opt] = false;
    });
    
    // Selecionar apenas a opção escolhida
    newSelectedOptions[questionId][option] = true;
    
    setSelectedOptions(newSelectedOptions);
  };
  
  // Tratamento especial para campos especiais
  if (isSpecialField && (question.type === 'radio' || question.type === 'select')) {
    return (
      <div className="space-y-2 ml-8 mt-2">
        {question.options.map((option: string) => {
          const isSelected = selectedOptions[questionId]?.[option] || false;
          return (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`option-${questionId}-${option}`}
                checked={isSelected}
                onCheckedChange={(checked) => {
                  handleCheckedChange(option, !!checked);
                }}
              />
              <Label 
                htmlFor={`option-${questionId}-${option}`}
                className={`text-sm ${isSelected ? 'font-medium' : 'text-gray-600'}`}
              >
                {option}
              </Label>
            </div>
          );
        })}
      </div>
    );
  }
  
  // Se for uma questão do tipo radio ou select, devemos permitir apenas uma opção selecionada
  if (question.type === 'radio' || question.type === 'select') {
    // Encontrar a opção selecionada (se houver) ou deixar vazia
    const selectedOption = Object.entries(selectedOptions[questionId] || {})
      .find(([_, isSelected]) => isSelected)?.[0] || '';
      
    return (
      <div className="space-y-2 ml-8 mt-2">
        <RadioGroup 
          value={selectedOption}
          onValueChange={handleRadioSelection}
          className="space-y-2"
        >
          {question.options.map((option: string) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${questionId}-${option}`} />
              <Label 
                htmlFor={`option-${questionId}-${option}`}
                className={`text-sm ${selectedOption === option ? 'font-medium' : 'text-gray-600'}`}
              >
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    );
  }
  
  // Padrão para checkbox (seleção múltipla)
  return (
    <div className="space-y-2 ml-8 mt-2">
      {question.options.map((option: string) => {
        const isSelected = selectedOptions[questionId]?.[option] || false;
        return (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`option-${questionId}-${option}`}
              checked={isSelected}
              onCheckedChange={(checked) => {
                handleCheckedChange(option, !!checked);
              }}
            />
            <Label 
              htmlFor={`option-${questionId}-${option}`}
              className={`text-sm ${isSelected ? 'font-medium' : 'text-gray-600'}`}
            >
              {option}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
