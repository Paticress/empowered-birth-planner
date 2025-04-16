
export function useWelcomeMessage() {
  const getWelcomeMessage = () => {
    const currentHour = new Date().getHours();
    
    if (currentHour < 12) {
      return "Bom dia";
    } else if (currentHour < 18) {
      return "Boa tarde";
    } else {
      return "Boa noite";
    }
  };
  
  // Get the user's first name if available
  const firstName = localStorage.getItem('user_first_name') || 'Bem-vindo';
  
  return { getWelcomeMessage, firstName };
}
