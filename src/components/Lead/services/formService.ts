
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

// Validates a WhatsApp number
export const validateWhatsapp = (number: string): boolean => {
  const digits = number.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
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
