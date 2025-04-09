
/**
 * Returns the list of fields that should always use single line input
 */
export const getSingleLineFields = (): string[] => {
  return [
    'name',
    'dueDate',
    'healthProvider',
    'healthProviderContact',
    'healthProviderRegistry',
    'birthLocation',
    'hospital',
    'hospitalAddress',
    'hospitalPhone',
    'pediatrician',
    'pediatricianContact',
    'pediatricianRegistry',
    'midwife',
    'midwifeContact',
    'midwifeRegistry',
    'doula',
    'doulaContact',
    'doulaRegistry',
  ];
};

/**
 * Returns the list of fields that should always show the "Add from Questionnaire" button
 */
export const getAlwaysShowAddButtonFields = (): string[] => {
  return [
    'emergencyScenarios', 
    'highRiskComplications', 
    'lowRiskOccurrences', 
    'cascadeInterventions',
    'painRelief',
    'interventionsRoutine',
    'consentimentoInformado',
    'specialWishes',
    'unexpectedScenarios'
  ];
};
