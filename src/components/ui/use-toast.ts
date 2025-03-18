
import { toast as sonnerToast, ToastT } from "sonner";

// Wrapper function for sonner toast to handle both string and object formats
export const toast = (
  props: string | { title?: string; description?: string; [key: string]: any }, 
  options?: Omit<ToastT, "id">
) => {
  // If props is a string, use it as the message
  if (typeof props === 'string') {
    return sonnerToast(props, options);
  }
  
  // If props is an object with title/description, format it appropriately
  const { title, description, ...restProps } = props;
  return sonnerToast(title || '', {
    description,
    ...restProps,
    ...options
  });
};
