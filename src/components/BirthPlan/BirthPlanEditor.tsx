import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Save, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { birthPlanSections } from './utils/birthPlanSections';
import { questionnaireSections } from './questionnaire';
import { parseOptionsFromText } from './utils/birthPlanUtils';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface BirthPlanEditorProps {
  birthPlan: Record<string, any>;
  onUpdate: (updatedPlan: Record<string, any>) => void;
  onNext: () => void;
  onBack?: () => void;
  questionnaireAnswers?: Record<string, any>;
}

export function BirthPlanEditor({ 
  birthPlan, 
  onUpdate, 
  onNext,
  onBack,
  questionnaireAnswers = {}
}: BirthPlanEditorProps) {
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [localBirthPlan, setLocalBirthPlan] = useState({ ...birthPlan });
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Record<string, boolean>>>({});
  const [activeFieldKey, setActiveFieldKey] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleFieldChange = (sectionId: string, fieldKey: string, value: any) => {
    setLocalBirthPlan(prevPlan => ({
      ...prevPlan,
      [sectionId]: {
        ...prevPlan[sectionId],
        [fieldKey]: value,
      },
    }));
  };
  
  const handleSave = () => {
    onUpdate(localBirthPlan);
    toast("Seu plano de parto foi atualizado com sucesso.");
  };
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSectionIndex]);
  
  const activeSection = birthPlanSections[activeSectionIndex];

  const mapQuestionnaireToSectionId = (questionnaireId: string): string => {
    const mapping: Record<string, string> = {
      'personal': 'personalInfo',
      'atmosphere': 'atmosfera',
      'laborPreferences': 'trabalhoDeParto',
      'birth': 'nascimento',
      'cesarean': 'cesarea',
      'postpartum': 'posParto',
      'specialSituations': 'situacoesEspeciais'
    };
    return mapping[questionnaireId] || questionnaireId;
  };

  const getRelevantQuestionsForField = (fieldKey: string) => {
    const fieldToQuestionMap: Record<string, string[]> = {
      'name': ['name'],
      'dueDate': ['dueDate'],
      'healthProvider': ['healthProvider'],
      'birthLocation': ['birthLocation'],
      'hospital': ['hospital'],
      'midwife': ['midwife', 'midwifeName', 'midwifeRegistry'],
      'doula': ['doula', 'doulaName'],
      'companions': ['companions'],
      
      'lighting': ['lighting'],
      'sound': ['sound'],
      'clothing': ['clothing'],
      'photos': ['photos'],
      
      'mobility': ['mobility'],
      'positions': ['positions'],
      'hydration': ['hydration'],
      'monitoring': ['monitoring'],
      'interventions': ['painRelief', 'interventions', 'informedConsent'],
      
      'birthPositions': ['birthPositions'],
      'episiotomy': ['episiotomy'],
      'cordCutting': ['cordCutting'],
      'skinToSkin': ['skinToSkin'],
      'placenta': ['placenta'],
      
      'cesareanPreferences': ['cesareanPreferences'],
      'anesthesia': ['anesthesia'],
      'cesareanCompanion': ['cesareanCompanion'],
      'curtain': ['curtain'],
      'cesareanSkinToSkin': ['cesareanSkinToSkin'],
      
      'firstHour': ['firstHour'],
      'breastfeeding': ['breastfeeding'],
      'newbornCare': ['newbornCare'],
      'vaccination': ['vaccination'],
      'motherCare': ['motherCare'],
      
      'complications': ['complications', 'cascadeInterventions'],
      'nicu': ['nicu'],
      'emergencyScenarios': ['unexpectedScenarios'],
      'specialWishes': ['specialWishes']
    };
    
    const relevantQuestionIds = fieldToQuestionMap[fieldKey] || [];
    
    const relevantQuestions: Array<{question: any, sectionId: string}> = [];
    
    for (const section of questionnaireSections) {
      for (const question of section.questions) {
        if (relevantQuestionIds.includes(question.id) && questionnaireAnswers[question.id] !== undefined) {
          relevantQuestions.push({
            question,
            sectionId: section.id
          });
        }
      }
    }
    
    return relevantQuestions;
  };
  
  const excludedFields = ['name', 'dueDate', 'healthProvider', 'hospital', 'companions'];
  
  const shouldShowAddButton = (fieldKey: string) => {
    if (excludedFields.includes(fieldKey)) {
      return false;
    }
    
    const relevantQuestions = getRelevantQuestionsForField(fieldKey);
    return relevantQuestions.length > 0;
  };
  
  const findQuestionById = (questionId: string) => {
    for (const section of questionnaireSections) {
      const question = section.questions.find(q => q.id === questionId);
      if (question) {
        return { question, sectionId: section.id };
      }
    }
    return null;
  };
  
  const getQuestionnaireValueForField = (fieldKey: string): string[] => {
    const relevantQuestions = getRelevantQuestionsForField(fieldKey);
    let selectedValues: string[] = [];
    
    relevantQuestions.forEach(({ question }) => {
      const questionId = question.id;
      const answer = questionnaireAnswers[questionId];
      
      if (answer) {
        if (typeof answer === 'object' && !Array.isArray(answer)) {
          Object.entries(answer).forEach(([option, selected]) => {
            if (selected) {
              selectedValues.push(option);
            }
          });
        } else if (typeof answer === 'string') {
          selectedValues.push(answer);
        }
      }
    });
    
    return selectedValues;
  };
  
  const parseCurrentFieldOptions = (fieldKey: string, sectionId: string): string[] => {
    const currentValue = localBirthPlan[sectionId][fieldKey] || '';
    return parseOptionsFromText(currentValue);
  };
  
  const initializeOptionsFromCurrentField = (fieldKey: string, sectionId: string) => {
    const currentFieldOptions = parseCurrentFieldOptions(fieldKey, sectionId);
    const relevantQuestions = getRelevantQuestionsForField(fieldKey);
    
    const initialSelectedOptions: Record<string, Record<string, boolean>> = {};
    
    relevantQuestions.forEach(({ question }) => {
      const questionId = question.id;
      initialSelectedOptions[questionId] = {};
      
      if (question.options) {
        question.options.forEach((option: string) => {
          let isSelected = currentFieldOptions.includes(option);
          
          const answer = questionnaireAnswers[questionId];
          if (typeof answer === 'object' && !Array.isArray(answer) && answer[option]) {
            isSelected = true;
          }
          
          initialSelectedOptions[questionId][option] = isSelected;
        });
      }
    });
    
    return initialSelectedOptions;
  };
  
  const handleAddSelectedOptions = () => {
    const updatedPlan = { ...localBirthPlan };
    
    const allSelectedOptions: string[] = [];
    
    Object.entries(selectedOptions).forEach(([questionId, options]) => {
      if (Object.values(options).some(value => value)) {
        const selectedForQuestion = Object.entries(options)
          .filter(([_, isSelected]) => isSelected)
          .map(([option]) => option);
        
        allSelectedOptions.push(...selectedForQuestion);
      }
    });
    
    if (allSelectedOptions.length > 0) {
      const formattedOptions = allSelectedOptions.join(', ');
      
      const mappedSectionId = mapQuestionnaireToSectionId(
        Object.keys(selectedOptions).map(id => findQuestionById(id)?.sectionId || '')[0]
      );
      
      updatedPlan[mappedSectionId][activeFieldKey] = formattedOptions;
      setLocalBirthPlan(updatedPlan);
      
      toast("As opções selecionadas foram adicionadas ao seu plano de parto.");
    } else {
      toast("Nenhuma opção foi selecionada.");
    }
    
    setSelectedOptions({});
    setDialogOpen(false);
  };
  
  const resetOptionsForField = (fieldKey: string) => {
    setActiveFieldKey(fieldKey);
    
    const initialSelectedOptions = initializeOptionsFromCurrentField(
      fieldKey, 
      activeSection.id
    );
    
    setSelectedOptions(initialSelectedOptions);
    setDialogOpen(true);
  };
  
  const renderSelectableOptions = (question: any, questionId: string) => {
    if (!question.options || question.options.length === 0) {
      return null;
    }
    
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
                  setSelectedOptions(prev => ({
                    ...prev,
                    [questionId]: {
                      ...prev[questionId],
                      [option]: !!checked
                    }
                  }));
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
  };
  
  const singleLineFields = [
    'name', 'dueDate', 'healthProvider', 'healthProviderContact', 'healthProviderRegistry', 
    'birthLocation', 'hospital', 'hospitalAddress', 'hospitalPhone', 
    'midwife', 'midwifeContact', 'midwifeRegistry',
    'doula', 'doulaContact', 'doulaRegistry'
  ];
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-800 mb-6">Edite seu Plano de Parto</h1>
      
      <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
        {birthPlanSections.map((section, index) => (
          <Button
            key={section.id}
            variant={activeSectionIndex === index ? "default" : "outline"}
            className={activeSectionIndex === index 
              ? `bg-maternal-${section.color || '400'}` 
              : `hover:bg-maternal-${section.color || '100'} hover:text-maternal-800`}
            onClick={() => setActiveSectionIndex(index)}
          >
            {section.title}
          </Button>
        ))}
      </div>
      
      <div className={`bg-white border-l-4 border-maternal-${activeSection.color || '400'} rounded-lg p-6 mb-6 shadow-md`}>
        <h2 className="text-2xl font-semibold text-maternal-700 mb-4">{activeSection.title}</h2>
        
        {activeSection.fields.map((field) => {
          const sectionData = localBirthPlan[activeSection.id] || {};
          const fieldValue = sectionData[field.key] || '';
          const showAddButton = shouldShowAddButton(field.key);
          const useSingleLineInput = singleLineFields.includes(field.key);
          
          return (
            <div key={field.key} className="mb-6 border border-maternal-100 rounded-lg p-4 bg-maternal-50/30">
              <div className="flex justify-between items-center mb-2">
                <label 
                  htmlFor={`${activeSection.id}-${field.key}`} 
                  className="block font-medium text-maternal-800"
                >
                  {field.label}
                </label>
                
                {showAddButton && (
                  <Dialog open={dialogOpen && activeFieldKey === field.key} onOpenChange={(open) => {
                    if (open && activeFieldKey !== field.key) {
                      resetOptionsForField(field.key);
                    } else if (!open) {
                      setDialogOpen(false);
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1 border-maternal-300 text-maternal-600 text-xs"
                        onClick={() => resetOptionsForField(field.key)}
                      >
                        <Plus className="h-3 w-3" /> Adicionar do Questionário
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Adicionar Respostas do Questionário</DialogTitle>
                      </DialogHeader>
                      
                      <div className="max-h-[60vh] overflow-y-auto py-4">
                        {getRelevantQuestionsForField(field.key).length > 0 ? (
                          getRelevantQuestionsForField(field.key).map(({ question }) => {
                            const questionId = question.id;
                            
                            return (
                              <div key={questionId} className="py-3 border-b border-gray-100">
                                <div className="font-medium text-maternal-900">
                                  {question.text}
                                </div>
                                
                                {renderSelectableOptions(question, questionId)}
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center py-4 text-gray-500">
                            Não há respostas disponíveis do questionário para este campo.
                          </p>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={handleAddSelectedOptions}>
                          Adicionar Selecionados
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
              {useSingleLineInput ? (
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
                  value={Array.isArray(fieldValue) ? fieldValue.join('\n') : fieldValue}
                  onChange={(e) => handleFieldChange(
                    activeSection.id, 
                    field.key, 
                    e.target.value
                  )}
                  rows={6}
                  className="w-full border-maternal-200 focus:border-maternal-400 focus:ring-maternal-400"
                  placeholder={`Insira suas preferências para ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div className="bg-maternal-50 p-4 rounded-lg mb-6 border border-maternal-200">
        <p className="text-sm text-maternal-700">
          <strong>Dica:</strong> Seja específico sobre suas preferências, mas também flexível. 
          Lembre-se de que situações imprevistas podem ocorrer durante o parto.
        </p>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="outline"
          onClick={() => setActiveSectionIndex(Math.max(0, activeSectionIndex - 1))}
          disabled={activeSectionIndex === 0}
          className="flex items-center border-maternal-300 text-maternal-700 hover:bg-maternal-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
        </Button>
        
        <Button 
          variant="outline"
          onClick={handleSave}
          className="flex items-center border-maternal-300 text-maternal-700 hover:bg-maternal-50"
        >
          <Save className="mr-2 h-4 w-4" /> Salvar Alterações
        </Button>
        
        {activeSectionIndex === birthPlanSections.length - 1 ? (
          <Button 
            onClick={() => {
              handleSave();
              onNext();
            }}
            className="bg-maternal-400 hover:bg-maternal-500 flex items-center"
          >
            Visualizar Plano Completo <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={() => setActiveSectionIndex(Math.min(birthPlanSections.length - 1, activeSectionIndex + 1))}
            className="bg-maternal-400 hover:bg-maternal-500 flex items-center"
          >
            Próxima Seção <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
