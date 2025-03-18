
import { toast as sonnerToast, ToastT } from "sonner";

// Wrapper function for sonner toast to handle type issues
export const toast = (
  message: string, 
  options?: Omit<ToastT, "id"> & { description?: string }
) => {
  return sonnerToast(message, options);
};
