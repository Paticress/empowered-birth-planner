
/**
 * Updates personal information section of the birth plan
 */
export const updatePersonalInfo = (birthPlan: Record<string, any>, answers: Record<string, any>): void => {
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
