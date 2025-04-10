
import { useEffect } from 'react';

interface UseAutoSaveProps {
  isDirty: boolean;
  handleSave: (showToast: boolean) => void;
  delay?: number;
}

export function useAutoSave({ isDirty, handleSave, delay = 30000 }: UseAutoSaveProps) {
  // Auto-save functionality
  useEffect(() => {
    if (isDirty) {
      console.log("Auto-save timer started due to changes");
      const autoSaveTimer = setTimeout(() => {
        console.log("Auto-saving birth plan");
        handleSave(false); // Pass false to avoid showing toast on auto-save
      }, delay); // Auto-save after delay of inactivity
      
      return () => clearTimeout(autoSaveTimer);
    }
  }, [isDirty, handleSave, delay]);
}
