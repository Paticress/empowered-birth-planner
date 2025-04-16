import { birthPlanSections } from './birthPlanSections';

/**
 * Generates a default empty birth plan structure based on sections
 */
export const generateEmptyBirthPlan = (): Record<string, any> => {
  const emptyPlan: Record<string, any> = {};
  
  birthPlanSections.forEach((section) => {
    emptyPlan[section.id] = {};
    section.fields.forEach((field) => {
      emptyPlan[section.id][field.key] = '';
    });
  });
  
  return emptyPlan;
};

/**
 * Processes checkbox answers into a formatted string
 */
const formatCheckboxAnswers = (checkboxData: Record<string, boolean>) => {
  if (!checkboxData) return '';
  
  const selectedOptions = Object.entries(checkboxData)
    .filter(([_, value]) => value)
    .map(([key]) => key);
  
  return selectedOptions.join(', ');
};

/**
 * Updates personal information section of the birth plan
 */
const updatePersonalInfo = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.name) birthPlan.personalInfo.name = answers.name;
  if (answers.dueDate) birthPlan.personalInfo.dueDate = answers.dueDate;
  if (answers.healthProvider) birthPlan.personalInfo.healthProvider = answers.healthProvider;
  if (answers.birthLocation) birthPlan.personalInfo.birthLocation = answers.birthLocation;
  if (answers.hospital) birthPlan.personalInfo.hospital = answers.hospital;
  
  // Pediatra
  if (answers.pediatrician === 'Sim') {
    if (answers.pediatricianName) birthPlan.personalInfo.pediatrician = answers.pediatricianName;
    if (answers.pediatricianRegistry) birthPlan.personalInfo.pediatricianRegistry = answers.pediatricianRegistry;
  }
  
  // Enfermeira Obstetriz
  if (answers.midwife === 'Sim') {
    if (answers.midwifeName) birthPlan.personalInfo.midwife = answers.midwifeName;
    if (answers.midwifeRegistry) birthPlan.personalInfo.midwifeRegistry = answers.midwifeRegistry;
  }
  
  // Doula
  if (answers.doula === 'Sim') {
    if (answers.doulaName) birthPlan.personalInfo.doula = answers.doulaName;
  }
  
  if (answers.companions) birthPlan.personalInfo.companions = answers.companions;
};

/**
 * Updates atmosphere section of the birth plan
 */
const updateAtmosphere = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.lighting) {
    birthPlan.atmosfera.lighting = formatCheckboxAnswers(answers.lighting);
  }
  if (answers.sound) {
    birthPlan.atmosfera.sound = formatCheckboxAnswers(answers.sound);
  }
  if (answers.clothing) {
    birthPlan.atmosfera.clothing = answers.clothing;
  }
  if (answers.photos) {
    birthPlan.atmosfera.photos = formatCheckboxAnswers(answers.photos);
  }
};

/**
 * Updates labor section of the birth plan
 */
const updateLaborPreferences = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.mobility) {
    birthPlan.trabalhoDeParto.mobility = formatCheckboxAnswers(answers.mobility);
  }
  if (answers.positions) {
    birthPlan.trabalhoDeParto.positions = formatCheckboxAnswers(answers.positions);
  }
  if (answers.hydration) {
    birthPlan.trabalhoDeParto.hydration = formatCheckboxAnswers(answers.hydration);
  }
  if (answers.monitoring) {
    birthPlan.trabalhoDeParto.monitoring = answers.monitoring;
  }
  if (answers.painRelief) {
    birthPlan.trabalhoDeParto.interventions = formatCheckboxAnswers(answers.painRelief);
  }
  if (answers.interventions) {
    const currentValue = birthPlan.trabalhoDeParto.interventions;
    const interventions = formatCheckboxAnswers(answers.interventions);
    birthPlan.trabalhoDeParto.interventions = currentValue ? 
      `${currentValue}\n${interventions}` : interventions;
  }
};

/**
 * Updates birth section of the birth plan
 */
const updateBirthPreferences = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.birthPositions) {
    birthPlan.nascimento.birthPositions = formatCheckboxAnswers(answers.birthPositions);
  }
  if (answers.episiotomy) {
    birthPlan.nascimento.episiotomy = answers.episiotomy;
  }
  if (answers.cordCutting) {
    birthPlan.nascimento.cordCutting = formatCheckboxAnswers(answers.cordCutting);
  }
  if (answers.skinToSkin) {
    birthPlan.nascimento.skinToSkin = answers.skinToSkin;
  }
  if (answers.placenta) {
    birthPlan.nascimento.placenta = answers.placenta;
  }
};

/**
 * Updates cesarean section of the birth plan
 */
const updateCesareanPreferences = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.cesareanPreferences) {
    birthPlan.cesarea.cesareanPreferences = formatCheckboxAnswers(answers.cesareanPreferences);
  }
  if (answers.anesthesia) {
    birthPlan.cesarea.anesthesia = answers.anesthesia;
  }
  if (answers.cesareanCompanion) {
    birthPlan.cesarea.cesareanCompanion = answers.cesareanCompanion;
  }
  if (answers.curtain) {
    birthPlan.cesarea.curtain = answers.curtain;
  }
  if (answers.cesareanSkinToSkin) {
    birthPlan.cesarea.cesareanSkinToSkin = answers.cesareanSkinToSkin;
  }
};

/**
 * Updates postpartum section of the birth plan
 */
const updatePostpartumPreferences = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.firstHour) {
    birthPlan.posParto.firstHour = formatCheckboxAnswers(answers.firstHour);
  }
  if (answers.breastfeeding) {
    birthPlan.posParto.breastfeeding = formatCheckboxAnswers(answers.breastfeeding);
  }
  if (answers.newbornCare) {
    birthPlan.posParto.newbornCare = formatCheckboxAnswers(answers.newbornCare);
  }
  if (answers.vaccination) {
    birthPlan.posParto.vaccination = answers.vaccination;
  }
  if (answers.motherCare) {
    birthPlan.posParto.motherCare = formatCheckboxAnswers(answers.motherCare);
  }
};

/**
 * Updates special situations section of the birth plan
 */
const updateSpecialSituations = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
  if (answers.complications) {
    birthPlan.situacoesEspeciais.complications = formatCheckboxAnswers(answers.complications);
  }
  
  if (answers.nicu) {
    birthPlan.situacoesEspeciais.nicu = formatCheckboxAnswers(answers.nicu);
  }
  
  if (answers.emergencyPreferences) {
    console.log("Processando emergencyPreferences:", answers.emergencyPreferences);
    const formattedOptions = formatCheckboxAnswers(answers.emergencyPreferences);
    console.log("emergencyPreferences formatadas:", formattedOptions);
    birthPlan.situacoesEspeciais.emergencyScenarios = formattedOptions;
  }
  
  if (answers.highRiskComplications) {
    console.log("Processando highRiskComplications:", answers.highRiskComplications);
    const formattedOptions = formatCheckboxAnswers(answers.highRiskComplications);
    console.log("highRiskComplications formatadas:", formattedOptions);
    birthPlan.situacoesEspeciais.highRiskComplications = formattedOptions;
  }
  
  if (answers.lowRiskOccurrences) {
    console.log("Processando lowRiskOccurrences:", answers.lowRiskOccurrences);
    const formattedOptions = formatCheckboxAnswers(answers.lowRiskOccurrences);
    console.log("lowRiskOccurrences formatadas:", formattedOptions);
    birthPlan.situacoesEspeciais.lowRiskOccurrences = formattedOptions;
  }
  
  if (answers.cascadeInterventions) {
    birthPlan.situacoesEspeciais.cascadeInterventions = formatCheckboxAnswers(answers.cascadeInterventions);
  }
  
  if (answers.specialWishes) {
    birthPlan.situacoesEspeciais.specialWishes = answers.specialWishes;
  }
  
  if (answers.unexpectedScenarios) {
    birthPlan.situacoesEspeciais.unexpectedScenarios = answers.unexpectedScenarios;
  }
};

/**
 * Generates an initial birth plan from questionnaire answers
 */
export const generateBirthPlanFromAnswers = (answers: Record<string, any>): Record<string, any> => {
  console.log("Gerando plano de parto a partir das respostas:", answers);
  const birthPlan = generateEmptyBirthPlan();
  
  // Update each section with relevant answers
  updatePersonalInfo(birthPlan, answers);
  updateAtmosphere(birthPlan, answers);
  updateLaborPreferences(birthPlan, answers);
  updateBirthPreferences(birthPlan, answers);
  updateCesareanPreferences(birthPlan, answers);
  updatePostpartumPreferences(birthPlan, answers);
  updateSpecialSituations(birthPlan, answers);
  
  console.log("Plano de parto gerado:", birthPlan);
  return birthPlan;
};
