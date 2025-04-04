
import { User } from "@supabase/supabase-js";

export interface AuthProcessOptions {
  setIsProcessingAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface TokenProcessingParams {
  hasAuthInHash: boolean;
  hasAuthInPath: boolean;
  hasAuthInSearch: boolean;
  fullUrl: string;
  search: string;
  hash: string;
}

// Define AuthUrlInfo explicitly instead of using ReturnType
export interface AuthUrlInfo {
  fullUrl: string;
  hash: string;
  search: string;
  path: string;
  hasAuthInHash: boolean;
  hasAuthInSearch: boolean;
  hasAuthInPath: boolean;
  hasAuthInUrl: boolean;
  hasError: boolean;
}
