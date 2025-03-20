
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight, Save, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { birthPlanSections } from './utils/birthPlanSections';
import { questionnaireSections } from './questionnaire';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
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
  const [selectedQuestionOptions, setSelectedQuestionOptions] = useState<Record<string, any>>({});
  const [activeFieldKey, setActiveFieldKey] = useState<string>('');
  
  // Debug logs para entender o conteúdo e estrutura das respostas do questionário
  useEffect(() => {
    console.log("Respostas do questionário carregadas:", questionnaireAnswers);
  }, [questionnaireAnswers]);
  
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
    toast({
      title: "Alterações salvas",
      description: "Seu plano de parto foi atualizado com sucesso."
    });
  };
  
  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeSectionIndex]);
  
  const activeSection = birthPlanSections[activeSectionIndex];

  // Função para mapear seções do questionário para seções do plano de parto - corrigido
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

  // Função para formatar opções selecionadas
  const formatSelectedOptions = (questionId: string, data: any): string => {
    if (typeof data === 'string') {
      return data;
    }
    
    if (Array.isArray(data)) {
      return data.join(', ');
    }
    
    if (typeof data === 'object') {
      // Caso específico para checkbox onde o valor é um objeto de opções
      return Object.entries(data)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(', ');
    }
    
    return String(data);
  };

  // Adicionar opções selecionadas do questionário ao plano para um campo específico
  const handleAddQuestionnaireOptionsForField = (fieldKey: string) => {
    console.log(`Adicionando opções para o campo ${fieldKey}`);
    console.log(`Opções selecionadas:`, selectedQuestionOptions);
    
    const updatedPlan = { ...localBirthPlan };
    
    Object.entries(selectedQuestionOptions).forEach(([questionId, isSelected]) => {
      if (!isSelected) return;
      
      // Encontrar a pergunta e a seção original
      const questionData = findQuestionById(questionId);
      if (!questionData) {
        console.log(`Pergunta não encontrada: ${questionId}`);
        return;
      }
      
      const { question, sectionId } = questionData;
      const mappedSectionId = mapQuestionnaireToSectionId(sectionId);
      
      console.log(`Pergunta encontrada: ${questionId} na seção ${sectionId}, mapeada para ${mappedSectionId}`);
      
      // Obter o valor da resposta do questionário
      const answer = questionnaireAnswers[questionId];
      if (answer === undefined) {
        console.log(`Resposta não encontrada para ${questionId}`);
        return;
      }
      
      console.log(`Resposta para ${questionId}:`, answer);
      
      // Formato da resposta
      const formattedAnswer = formatSelectedOptions(questionId, answer);
      console.log(`Resposta formatada: ${formattedAnswer}`);
      
      // Adicionar ou atualizar o valor no plano
      const currentValue = updatedPlan[mappedSectionId][fieldKey];
      if (currentValue) {
        // Se já existe um valor, acrescente a nova opção
        updatedPlan[mappedSectionId][fieldKey] = `${currentValue}\n${formattedAnswer}`;
      } else {
        // Se não existe, defina o novo valor
        updatedPlan[mappedSectionId][fieldKey] = formattedAnswer;
      }
    });
    
    console.log("Plano atualizado:", updatedPlan);
    setLocalBirthPlan(updatedPlan);
    setSelectedQuestionOptions({});
    
    toast({
      title: "Opções adicionadas",
      description: "As opções selecionadas foram adicionadas ao seu plano de parto."
    });
  };

  // Ajuda a encontrar a pergunta pelo ID
  const findQuestionById = (questionId: string) => {
    for (const section of questionnaireSections) {
      const question = section.questions.find(q => q.id === questionId);
      if (question) {
        return { question, sectionId: section.id };
      }
    }
    console.log(`Pergunta não encontrada para ID: ${questionId}`);
    return null;
  };

  // Encontrar questões relevantes para um campo específico - melhorado
  const getRelevantQuestionsForField = (fieldKey: string, sectionId: string) => {
    console.log(`Buscando questões relevantes para o campo ${fieldKey} na seção ${sectionId}`);
    
    // Mapeamento aprimorado de campos para perguntas relevantes por seção
    const fieldToQuestionMap: Record<string, Record<string, string[]>> = {
      // Seção: personalInfo
      'personalInfo': {
        'name': ['name'],
        'dueDate': ['dueDate'],
        'healthProvider': ['healthProvider'],
        'hospital': ['hospital'],
        'doula': ['doula', 'doulaName'],
        'companions': ['companions'],
      },
      
      // Seção: atmosfera
      'atmosfera': {
        'lighting': ['lighting'],
        'sound': ['sound', 'music'],
        'clothing': ['clothing'],
        'photos': ['photos', 'filming'],
      },
      
      // Seção: trabalhoDeParto
      'trabalhoDeParto': {
        'mobility': ['mobility', 'movementFreedom'],
        'positions': ['laborPositions'],
        'hydration': ['hydration', 'eating'],
        'monitoring': ['monitoring', 'continuousMonitoring'],
        'interventions': ['painRelief', 'interventions', 'informedConsent', 'induction'],
      },
      
      // Seção: nascimento
      'nascimento': {
        'birthPositions': ['birthPositions', 'squatPosition', 'waterBirth'],
        'episiotomy': ['episiotomy', 'perinealProtection'],
        'cordCutting': ['cordCutting', 'delayedCordClamping'],
        'skinToSkin': ['skinToSkin', 'immediateContact'],
        'placenta': ['placenta', 'placentaDestiny'],
      },
      
      // Seção: cesarea
      'cesarea': {
        'cesareanPreferences': ['cesareanPreferences', 'cesareanReason', 'previousCesarean'],
        'anesthesia': ['anesthesia', 'anesthesiaType'],
        'cesareanCompanion': ['cesareanCompanion', 'partnerPresence'],
        'curtain': ['curtain', 'seeingBirth'],
        'cesareanSkinToSkin': ['cesareanSkinToSkin', 'immediateContactCesarean'],
      },
      
      // Seção: posParto
      'posParto': {
        'firstHour': ['firstHour', 'goldenHour'],
        'breastfeeding': ['breastfeeding', 'breastfeedingSupport', 'formulaUse'],
        'newbornCare': ['newbornCare', 'bathing', 'rooming'],
        'vaccination': ['vaccination', 'delayedVaccination'],
        'motherCare': ['motherCare', 'postpartumRest'],
      },
      
      // Seção: situacoesEspeciais
      'situacoesEspeciais': {
        'complications': ['complications', 'cascadeInterventions', 'highRiskManagement'],
        'nicu': ['nicu', 'neonatalCare'],
        'emergencyScenarios': ['unexpectedScenarios', 'emergencyPlan'],
        'specialWishes': ['specialWishes', 'culturalPreferences'],
      }
    };
    
    // Obtém os IDs de perguntas relevantes para esta seção e campo específicos
    const relevantQuestionIds = fieldToQuestionMap[sectionId]?.[fieldKey] || [];
    
    if (relevantQuestionIds.length === 0) {
      console.log(`Nenhuma pergunta mapeada para o campo ${fieldKey} na seção ${sectionId}`);
    } else {
      console.log(`IDs de perguntas relevantes para ${fieldKey}:`, relevantQuestionIds);
    }
    
    const relevantQuestions: Array<{question: any, sectionId: string}> = [];
    
    // Varre todas as seções do questionário para encontrar as perguntas relevantes
    for (const section of questionnaireSections) {
      for (const question of section.questions) {
        if (relevantQuestionIds.includes(question.id) && questionnaireAnswers[question.id] !== undefined) {
          console.log(`Encontrou pergunta relevante: ${question.id} - ${question.text}`);
          relevantQuestions.push({
            question,
            sectionId: section.id
          });
        }
      }
    }
    
    console.log(`Total de perguntas relevantes encontradas: ${relevantQuestions.length}`);
    return relevantQuestions;
  };
  
  // Lista de campos para os quais não queremos mostrar o botão de adicionar do questionário
  // Estes são campos de entrada de texto livre do questionário inicial que não precisam do botão adicionar
  const excludedFields = ['name', 'dueDate', 'healthProvider', 'hospital', 'companions'];
  
  // Verifica se o botão de adicionar do questionário deve ser mostrado para um campo específico
  const shouldShowAddButton = (fieldKey: string, sectionId: string) => {
    // Não mostrar para campos excluídos (texto livre inicial)
    if (excludedFields.includes(fieldKey)) {
      return false;
    }
    
    // Verificar se existem perguntas relevantes para este campo
    const relevantQuestions = getRelevantQuestionsForField(fieldKey, sectionId);
    return relevantQuestions.length > 0;
  };
  
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
          const relevantQuestions = getRelevantQuestionsForField(field.key, activeSection.id);
          const showAddButton = shouldShowAddButton(field.key, activeSection.id);
          
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1 border-maternal-300 text-maternal-600 text-xs"
                        onClick={() => {
                          console.log(`Abrindo diálogo para o campo ${field.key}`);
                          setActiveFieldKey(field.key);
                          setSelectedQuestionOptions({});
                        }}
                      >
                        <Plus className="h-3 w-3" /> Adicionar do Questionário
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Adicionar Respostas do Questionário</DialogTitle>
                        <DialogDescription>
                          Selecione as opções do questionário para adicionar ao campo "{field.label}".
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="max-h-[60vh] overflow-y-auto py-4">
                        {relevantQuestions.length > 0 ? (
                          relevantQuestions.map(({ question }) => {
                            const answer = questionnaireAnswers[question.id];
                            let displayValue = '';
                            
                            // Formatar o valor de exibição com base no tipo de resposta
                            if (typeof answer === 'object' && !Array.isArray(answer)) {
                              // Resposta de checkbox
                              const selectedOptions = Object.entries(answer)
                                .filter(([_, selected]) => selected)
                                .map(([option]) => option);
                                
                              displayValue = selectedOptions.join(', ');
                            } else if (Array.isArray(answer)) {
                              displayValue = answer.join(', ');
                            } else {
                              displayValue = String(answer || '');
                            }
                            
                            return (
                              <div key={question.id} className="flex items-start space-x-2 py-2 border-b border-gray-100">
                                <Checkbox 
                                  id={`add-${question.id}`}
                                  checked={!!selectedQuestionOptions[question.id]}
                                  onCheckedChange={(checked) => {
                                    console.log(`Opção ${question.id} selecionada: ${checked}`);
                                    setSelectedQuestionOptions(prev => ({
                                      ...prev,
                                      [question.id]: checked
                                    }));
                                  }}
                                />
                                <div className="grid gap-1.5 leading-none">
                                  <Label htmlFor={`add-${question.id}`} className="font-medium">
                                    {question.text}
                                  </Label>
                                  {displayValue && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      {displayValue}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-center text-gray-500 py-4">
                            Não foram encontradas respostas relevantes no questionário para este campo.
                          </p>
                        )}
                      </div>
                      
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancelar</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button 
                            onClick={() => {
                              console.log(`Adicionando opções selecionadas para ${activeFieldKey}`);
                              handleAddQuestionnaireOptionsForField(activeFieldKey);
                            }}
                            disabled={Object.values(selectedQuestionOptions).filter(Boolean).length === 0}
                          >
                            Adicionar Selecionados
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              
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
