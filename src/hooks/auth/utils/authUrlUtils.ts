
import { AuthUrlInfo } from "@/types/auth";

/**
 * Checks if URL contains any auth parameters
 */
export function hasAuthParameters(urlInfo: AuthUrlInfo): boolean {
  const { hasAuthInHash, hasAuthInSearch, hasAuthInPath, hasAuthInUrl } = urlInfo;
  
  return hasAuthInHash || hasAuthInSearch || hasAuthInPath || hasAuthInUrl;
}

/**
 * Extracts access token from complex URL formats
 */
export function extractAccessToken(urlInfo: AuthUrlInfo): string | null {
  const { hash, search, path, fullUrl } = urlInfo;
  
  // Try to extract from hash first (most common and reliable)
  if (hash && hash.includes('access_token=')) {
    const tokenMatch = hash.match(/access_token=([^&]+)/);
    return tokenMatch ? tokenMatch[1] : null;
  }
  
  // Try search parameters
  if (search && search.includes('access_token=')) {
    const params = new URLSearchParams(search);
    return params.get('access_token');
  }
  
  // Try path
  if (path.includes('access_token=')) {
    const tokenMatch = path.match(/access_token=([^&]+)/);
    return tokenMatch ? tokenMatch[1] : null;
  }
  
  // Last resort - try full URL
  if (fullUrl.includes('access_token=')) {
    const tokenMatch = fullUrl.match(/access_token=([^&]+)/);
    return tokenMatch ? tokenMatch[1] : null;
  }
  
  return null;
}

/**
 * Gets just the base domain of a URL
 */
export function getBaseDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch (e) {
    return '';
  }
}
