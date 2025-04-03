
import { AuthUrlInfo } from "@/types/auth";

/**
 * Check if URL contains authentication parameters
 */
export function hasAuthParameters(urlInfo: AuthUrlInfo): boolean {
  const { hasAuthInHash, hasAuthInSearch, hasAuthInPath, hasAuthInUrl } = urlInfo;
  return hasAuthInHash || hasAuthInSearch || hasAuthInPath || hasAuthInUrl;
}
