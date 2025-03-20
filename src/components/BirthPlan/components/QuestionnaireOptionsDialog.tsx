
import { useState } from 'react';
import { 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { questionnaireSections } from '../questionnaire';

interface QuestionnaireOptionsDialogProps {
  fieldKey: string;
  fieldLabel: string;
  sectionId: string;
  questionnaireAnswers: Record<string, any>;
  onAddOptions: (updatedValue: string) => void;
}

export function QuestionnaireOptionsDialog({
  fieldKey,
  fieldLabel,
  questionnaireAnswers,
  onAddOptions
}: QuestionnaireOptionsDialogProps) {
  const [selectedQuestionOptions, setSelectedQuestionOptions] = useState<Record<string, any>>({});
  
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
  
  // Encontrar questões relevantes para um campo específico
  const getRelevantQuestionsForField = (fieldKey: string) => {
    // Mapeamento de chaves de campo para IDs de perguntas relevantes
    const fieldToQuestionMap: Record<string, string[]> = {
      // personalInfo
      'name': ['name'],
      'dueDate': ['dueDate'],
      'healthProvider': ['healthProvider'],
      'hospital': ['hospital'],
      'doula': ['doula', 'doulaName'],
      'companions': ['companions'],
      
      // atmosfera
      'lighting': ['lighting'],
      'sound': ['sound'],
      'clothing': ['clothing'],
      'photos': ['photos'],
      
      // trabalhoDeParto
      'mobility': ['mobility'],
      'positions': ['positions'],
      'hydration': ['hydration'],
      'monitoring': ['monitoring'],
      'interventions': ['painRelief', 'interventions', 'informedConsent'],
      
      // nascimento
      'birthPositions': ['birthPositions'],
      'episiotomy': ['episiotomy'],
      'cordCutting': ['cordCutting'],
      'skinToSkin': ['skinToSkin'],
      'placenta': ['placenta'],
      
      // cesarea
      'cesareanPreferences': ['cesareanPreferences'],
      'anesthesia': ['anesthesia'],
      'cesareanCompanion': ['cesareanCompanion'],
      'curtain': ['curtain'],
      'cesareanSkinToSkin': ['cesareanSkinToSkin'],
      
      // posParto
      'firstHour': ['firstHour'],
      'breastfeeding': ['breastfeeding'],
      'newbornCare': ['newbornCare'],
      'vaccination': ['vaccination'],
      'motherCare': ['motherCare'],
      
      // situacoesEspeciais
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

  // Adicionar opções selecionadas do questionário ao plano para um campo específico
  const handleAddQuestionnaireOptionsForField = (fieldKey: string) => {
    let updatedValue = '';
    
    Object.entries(selectedQuestionOptions).forEach(([questionId, isSelected]) => {
      if (!isSelected) return;
      
      // Encontrar a pergunta e a seção original
      const questionData = findQuestionById(questionId);
      if (!questionData) return;
      
      // Obter o valor da resposta do questionário
      const answer = questionnaireAnswers[questionId];
      if (!answer && answer !== false) return;
      
      // Formato da resposta
      const formattedAnswer = formatSelectedOptions(questionId, answer);
      
      // Adicionar à string de valor
      if (updatedValue) {
        updatedValue += '\n';
      }
      updatedValue += formattedAnswer;
    });
    
    if (updatedValue) {
      onAddOptions(updatedValue);
      setSelectedQuestionOptions({});
      
      toast({
        title: "Opções adicionadas",
        description: "As opções selecionadas foram adicionadas ao seu plano de parto."
      });
    }
  };
  
  const relevantQuestions = getRelevantQuestionsForField(fieldKey);
  
  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>Adicionar Respostas do Questionário</DialogTitle>
        <DialogDescription>
          Selecione as opções do questionário para adicionar ao campo "{fieldLabel}".
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
          <Button onClick={() => handleAddQuestionnaireOptionsForField(fieldKey)}>Adicionar Selecionados</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}
