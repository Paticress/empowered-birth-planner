
/**
 * Returns a list of fields that should use single line inputs
 */
export const getSingleLineFields = () => {
  return [
    'name', 'dueDate', 'healthProvider', 'healthProviderContact', 'healthProviderRegistry', 
    'birthLocation', 'hospital', 'hospitalAddress', 'hospitalPhone', 
    'midwife', 'midwifeContact', 'midwifeRegistry',
    'doula', 'doulaContact', 'doulaRegistry',
    'pediatrician', 'pediatricianContact', 'pediatricianRegistry'
  ];
};

/**
 * Returns a list of fields that should not display the "Add from Questionnaire" button
 */
export const getExcludedFields = () => {
  return ['name', 'dueDate', 'healthProvider', 'hospital', 'companions'];
};

/**
 * List of fields that should always show the "Add from Questionnaire" button
 * regardless of whether there are answers available
 */
export const getAlwaysShowAddButtonFields = () => {
  return [
    'highRiskComplications',
    'lowRiskOccurrences',
    'emergencyScenarios',
    'complications',
    'interventionsRoutine',
    'cascadeInterventions',
    'painRelief'
  ];
};
