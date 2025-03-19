
/**
 * Formats a WhatsApp number with Brazilian formatting
 */
export const formatWhatsAppNumber = (number: string): string => {
  if (!number) return '';
  
  // Remove non-numeric characters
  const numbers = number.replace(/\D/g, '');
  
  // Apply mask based on length
  if (numbers.length <= 2) {
    return `(${numbers}`;
  } else if (numbers.length <= 6) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  } else if (numbers.length <= 10) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  } else {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  }
};

/**
 * Validates a WhatsApp number
 */
export const validateWhatsapp = (number: string): boolean => {
  const digits = number.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
};
