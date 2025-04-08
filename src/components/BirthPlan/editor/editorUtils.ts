
import { parseOptionsFromText } from '../utils/birthPlanUtils';
import { questionnaireSections } from '../questionnaire';
import { birthPlanSections } from '../utils/birthPlanSections';

export const mapQuestionnaireToSectionId = (questionnaireId: string): string => {
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

export const getRelevantQuestionsForField = (
  fieldKey: string, 
  questionnaireAnswers: Record<string, any> = {}
) => {
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
    'painRelief': ['painRelief'], // Specifically for pain relief
    'interventionsRoutine': ['interventions'], // Changed from 'procedimentosRotina'
    'consentimentoInformado': ['informedConsent'],
    
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
    
    'complications': ['complications'],
    'cascadeInterventions': ['cascadeInterventions'],
    'nicu': ['nicu'],
    'emergencyScenarios': ['emergencyPreferences'],
    'highRiskComplications': ['highRiskComplications'],
    'lowRiskOccurrences': ['lowRiskOccurrences'],
    'specialWishes': ['specialWishes'],
    'unexpectedScenarios': ['unexpectedScenarios']
  };
  
  const relevantQuestionIds = fieldToQuestionMap[fieldKey] || [];
  
  const relevantQuestions: Array<{question: any, sectionId: string}> = [];
  
  for (const section of questionnaireSections) {
    for (const question of section.questions) {
      if (relevantQuestionIds.includes(question.id)) {
        // Verificar se há respostas para esta questão
        const hasAnswer = questionnaireAnswers[question.id] !== undefined;
        
        // Para questões com tipo checkbox, verificar se alguma opção foi selecionada
        if (question.type === 'checkbox' && typeof questionnaireAnswers[question.id] === 'object') {
          const checkboxAnswers = questionnaireAnswers[question.id];
          const hasAnySelection = Object.values(checkboxAnswers).some(value => !!value);
          
          if (hasAnySelection || !hasAnswer) {
            relevantQuestions.push({
              question,
              sectionId: section.id
            });
          }
        } else if (hasAnswer || 
                   fieldKey === 'highRiskComplications' || 
                   fieldKey === 'lowRiskOccurrences' || 
                   fieldKey === 'emergencyScenarios' || 
                   fieldKey === 'complications' ||
                   fieldKey === 'interventionsRoutine' ||
                   question.type === 'radio' || 
                   question.type === 'select') {
          // Sempre adicionar questões específicas ou de tipo radio/select mesmo sem respostas prévias
          relevantQuestions.push({
            question,
            sectionId: section.id
          });
        }
      }
    }
  }
  
  return relevantQuestions;
};

export const findQuestionById = (questionId: string) => {
  for (const section of questionnaireSections) {
    const question = section.questions.find(q => q.id === questionId);
    if (question) {
      return { question, sectionId: section.id };
    }
  }
  return null;
};

export const parseCurrentFieldOptions = (fieldKey: string, sectionId: string, birthPlan: Record<string, any>): string[] => {
  if (!birthPlan[sectionId] || !birthPlan[sectionId][fieldKey]) {
    return [];
  }
  const currentValue = birthPlan[sectionId][fieldKey] || '';
  return parseOptionsFromText(currentValue);
};

export const initializeOptionsFromCurrentField = (
  fieldKey: string, 
  sectionId: string, 
  birthPlan: Record<string, any>,
  questionnaireAnswers: Record<string, any>
) => {
  const currentFieldOptions = parseCurrentFieldOptions(fieldKey, sectionId, birthPlan);
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  
  const initialSelectedOptions: Record<string, Record<string, boolean>> = {};
  
  relevantQuestions.forEach(({ question }) => {
    const questionId = question.id;
    initialSelectedOptions[questionId] = {};
    
    if (question.options) {
      question.options.forEach((option: string) => {
        let isSelected = currentFieldOptions.includes(option);
        
        // Para questões de checkbox (onde as respostas são armazenadas como objetos)
        if (typeof questionnaireAnswers[questionId] === 'object' && 
            !Array.isArray(questionnaireAnswers[questionId]) && 
            questionnaireAnswers[questionId]?.[option]) {
          isSelected = true;
        }
        
        // Para questões de radio (onde a resposta é uma única string)
        if (typeof questionnaireAnswers[questionId] === 'string' &&
            questionnaireAnswers[questionId] === option) {
          isSelected = true;
        }
        
        initialSelectedOptions[questionId][option] = isSelected;
      });
    }
  });
  
  return initialSelectedOptions;
};

export const getExcludedFields = () => {
  return ['name', 'dueDate', 'healthProvider', 'hospital', 'companions'];
};

export const shouldShowAddButton = (fieldKey: string, questionnaireAnswers: Record<string, any> = {}) => {
  const excludedFields = getExcludedFields();
  
  if (excludedFields.includes(fieldKey)) {
    return false;
  }
  
  // Sempre mostrar o botão para estes campos específicos
  if (fieldKey === 'highRiskComplications' || 
      fieldKey === 'lowRiskOccurrences' || 
      fieldKey === 'emergencyScenarios' || 
      fieldKey === 'complications' || 
      fieldKey === 'interventionsRoutine' ||
      fieldKey === 'painRelief') {
    return true;
  }
  
  const relevantQuestions = getRelevantQuestionsForField(fieldKey, questionnaireAnswers);
  return relevantQuestions.length > 0;
};

export const getSingleLineFields = () => {
  return [
    'name', 'dueDate', 'healthProvider', 'healthProviderContact', 'healthProviderRegistry', 
    'birthLocation', 'hospital', 'hospitalAddress', 'hospitalPhone', 
    'midwife', 'midwifeContact', 'midwifeRegistry',
    'doula', 'doulaContact', 'doulaRegistry',
    'pediatrician', 'pediatricianContact', 'pediatricianRegistry'
  ];
};

export const checkSectionCompletion = (
  sectionId: string, 
  plan: Record<string, any>,
  completedSections: string[],
  setCompletedSections: React.Dispatch<React.SetStateAction<string[]>>
) => {
  const section = birthPlanSections.find(section => section.id === sectionId);
  if (!section) return;
  
  const filledFields = section.fields.filter(field => {
    const value = plan[sectionId]?.[field.key];
    return value && value.trim() !== '';
  });
  
  if (filledFields.length >= 3 && !completedSections.includes(sectionId)) {
    setCompletedSections(prev => [...prev, sectionId]);
  } else if (filledFields.length < 3 && completedSections.includes(sectionId)) {
    setCompletedSections(prev => prev.filter(id => id !== sectionId));
  }
};
