
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toast } = useToast()
  
  // Since we're using sonner now, we don't need to use the toasts array
  // Just return an empty provider
  return (
    <ToastProvider>
      <ToastViewport />
    </ToastProvider>
  )
}
