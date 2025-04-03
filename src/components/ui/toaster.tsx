
// This component is now a compatibility layer for applications that might still
// import this older version of the Toaster component

import { Toaster as SonnerToaster } from "@/components/ui/sonner";

export function Toaster() {
  return <SonnerToaster />;
}
