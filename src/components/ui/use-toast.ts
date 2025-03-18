
import { toast as sonnerToast, ToastOptions } from "sonner";

// Wrapper function for sonner toast to handle type issues
export const toast = (
  message: string, 
  options?: ToastOptions
) => {
  return sonnerToast(message, options);
};
