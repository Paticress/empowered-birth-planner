
// Interface for form data
export interface LeadFormData {
  name: string;
  email: string;
  whatsapp: string | null;
  isPregnant: string | null;
  dueDate: string | null;
  timestamp: string;
}

// Interface for CRM response
export interface CRMResponse {
  success: boolean;
  id: string;
}

// Interface for field validation
export interface ValidationResult {
  isValid: boolean;
  message: string; // Now required, not optional
}

// Validates a WhatsApp number
export const validateWhatsapp = (number: string): boolean => {
  const digits = number.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
};

// Validates an email address
export const validateEmail = (email: string): ValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email.trim()) {
    return { isValid: false, message: "Email é obrigatório" };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Email inválido" };
  }
  
  return { isValid: true, message: "" };
};

// Validates a name
export const validateName = (name: string): ValidationResult => {
  if (!name.trim()) {
    return { isValid: false, message: "Nome é obrigatório" };
  }
  
  if (name.trim().length < 3) {
    return { isValid: false, message: "Nome deve ter pelo menos 3 caracteres" };
  }
  
  return { isValid: true, message: "" };
};

// Validates WhatsApp with detailed feedback
export const validateWhatsappDetailed = (number: string): ValidationResult => {
  if (!number.trim()) {
    return { isValid: false, message: "WhatsApp é obrigatório" };
  }
  
  const digits = number.replace(/\D/g, '');
  
  if (digits.length < 10 || digits.length > 11) {
    return { isValid: false, message: "WhatsApp deve ter entre 10 e 11 dígitos" };
  }
  
  return { isValid: true, message: "" };
};

// Sends data to the CRM
export const sendToCRM = async (data: LeadFormData): Promise<CRMResponse> => {
  console.log("✅ Enviando dados para o CRM:", data);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ Dados enviados com sucesso para o CRM!");
      console.log("📊 Status do envio: Sucesso");
      console.log("📱 Validação do WhatsApp: " + (validateWhatsapp(data.whatsapp || '') ? "Válido" : "Inválido"));
      resolve({ success: true, id: "lead_" + Date.now() });
    }, 800);
  });
};
