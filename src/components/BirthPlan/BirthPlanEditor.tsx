
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

  // Função para mapear seções do questionário para seções do plano de parto
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
      return Object.entries(data)
        .filter(([_, value]) => value)
        .map(([key]) => key)
        .join(', ');
    }
    
    return String(data);
  };

  // Adicionar opções selecionadas do questionário ao plano
  const handleAddQuestionnaireOptions = () => {
    const updatedPlan = { ...localBirthPlan };
    
    Object.entries(selectedQuestionOptions).forEach(([questionId, isSelected]) => {
      if (!isSelected) return;
      
      // Encontrar a pergunta e a seção original
      const questionData = findQuestionById(questionId);
      if (!questionData) return;
      
      const { question, sectionId } = questionData;
      const mappedSectionId = mapQuestionnaireToSectionId(sectionId);
      
      // Obter o valor da resposta do questionário
      const answer = questionnaireAnswers[questionId];
      if (!answer && answer !== false) return;
      
      // Determinar em qual campo do plano isso deve ir
      let fieldKey = '';
      switch (questionId) {
        case 'lighting':
        case 'sound':
        case 'photos':
          fieldKey = questionId;
          break;
        case 'clothing':
          fieldKey = 'clothing';
          break;
        case 'mobility':
        case 'positions':
        case 'hydration':
        case 'monitoring':
          fieldKey = questionId;
          break;
        case 'painRelief':
        case 'interventions':
          fieldKey = 'interventions';
          break;
        case 'birthPositions':
        case 'episiotomy':
        case 'cordCutting':
        case 'skinToSkin':
        case 'placenta':
          fieldKey = questionId;
          break;
        case 'cesareanPreferences':
        case 'anesthesia':
        case 'cesareanCompanion':
        case 'curtain':
        case 'cesareanSkinToSkin':
          fieldKey = questionId;
          break;
        case 'firstHour':
        case 'breastfeeding':
        case 'newbornCare':
        case 'vaccination':
        case 'motherCare':
          fieldKey = questionId;
          break;
        case 'complications':
        case 'nicu':
        case 'specialWishes':
          fieldKey = questionId;
          break;
        default:
          // Para campos de texto simples, use o ID da pergunta como chave
          fieldKey = questionId;
      }
      
      if (!fieldKey) return;
      
      // Se o mapeamento não for encontrado, use um padrão baseado na pergunta
      if (!updatedPlan[mappedSectionId]) {
        updatedPlan[mappedSectionId] = {};
      }
      
      // Formato da resposta
      const formattedAnswer = formatSelectedOptions(questionId, answer);
      
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
    return null;
  };

  // Encontrar questões relevantes para a seção atual
  const getRelevantQuestionsForSection = () => {
    const sectionId = activeSection.id;
    const mappedQuestionnaireIds: string[] = [];
    
    // Mapeamento inverso para encontrar seções de questionário relacionadas
    Object.entries({
      'personalInfo': ['personal'],
      'atmosfera': ['atmosphere'],
      'trabalhoDeParto': ['laborPreferences'],
      'nascimento': ['birth'],
      'cesarea': ['cesarean'],
      'posParto': ['postpartum'],
      'situacoesEspeciais': ['specialSituations']
    }).forEach(([planSectionId, questionnaireSectionIds]) => {
      if (planSectionId === sectionId) {
        mappedQuestionnaireIds.push(...questionnaireSectionIds);
      }
    });
    
    // Obter todas as perguntas relevantes
    const relevantQuestions: Array<{question: any, sectionId: string}> = [];
    mappedQuestionnaireIds.forEach(qSectionId => {
      const section = questionnaireSections.find(s => s.id === qSectionId);
      if (section) {
        section.questions.forEach(question => {
          // Adicione apenas perguntas respondidas
          if (questionnaireAnswers[question.id] !== undefined) {
            relevantQuestions.push({
              question,
              sectionId: section.id
            });
          }
        });
      }
    });
    
    return relevantQuestions;
  };
  
  const relevantQuestions = getRelevantQuestionsForSection();
  
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-maternal-700">{activeSection.title}</h2>
          
          {relevantQuestions.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-maternal-300 text-maternal-700">
                  <Plus className="h-4 w-4" /> Adicionar do Questionário
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Adicionar Itens do Questionário</DialogTitle>
                  <DialogDescription>
                    Selecione as respostas do questionário que deseja adicionar ao seu plano de parto.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="max-h-[60vh] overflow-y-auto py-4">
                  {relevantQuestions.map(({ question }) => {
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
                  })}
                </div>
                
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button onClick={handleAddQuestionnaireOptions}>Adicionar Selecionados</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        
        {activeSection.fields.map((field) => {
          const sectionData = localBirthPlan[activeSection.id] || {};
          const fieldValue = sectionData[field.key] || '';
          
          return (
            <div key={field.key} className="mb-6">
              <label 
                htmlFor={`${activeSection.id}-${field.key}`} 
                className="block font-medium text-maternal-800 mb-2"
              >
                {field.label}
              </label>
              
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
