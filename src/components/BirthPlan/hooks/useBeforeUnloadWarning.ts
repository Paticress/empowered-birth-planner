
import { useEffect } from 'react';

interface UseBeforeUnloadWarningProps {
  isDirty: boolean;
  message?: string;
}

export function useBeforeUnloadWarning({ 
  isDirty, 
  message = "Você tem alterações não salvas. Tem certeza que deseja sair?" 
}: UseBeforeUnloadWarningProps) {
  // Save before navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        console.log("Preventing navigation due to unsaved changes");
        e.returnValue = message;
        return message;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty, message]);
}
