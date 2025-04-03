
import { ReturnType } from "@/utils/types";
import { useAuthUrlDetection } from "@/hooks/auth/useAuthUrlDetection";

export interface AuthProcessOptions {
  setIsProcessingAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TokenProcessingParams {
  hasAuthInHash: boolean;
  hasAuthInPath: boolean;
  hasAuthInSearch: boolean;
  fullUrl: string;
  search: string;
}

export type AuthUrlInfo = ReturnType<typeof useAuthUrlDetection>;
