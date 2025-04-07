
import { useCallback } from 'react';
import { AuthUrlInfo } from '@/types/auth';

/**
 * Utility hook for detecting authentication parameters in URLs
 */
export function useAuthUrlDetection() {
  /**
   * Analyzes the current URL for authentication tokens
   */
  const getAuthUrlInfo = useCallback((): AuthUrlInfo => {
    // Get full URL parts for analysis
    const fullUrl = window.location.href;
    const hash = window.location.hash;
    const search = window.location.search;
    const path = window.location.pathname;
    
    // Detect auth parameters in different parts of the URL
    const hasAuthInHash = !!hash && (
      hash.includes('access_token=') || 
      hash.includes('refresh_token=')
    );
    
    const hasAuthInSearch = !!search && (
      search.includes('access_token=') || 
      search.includes('code=') ||
      search.includes('access_entry=magiclink')
    );
    
    const hasAuthInPath = (
      path.includes('/auth/callback') || 
      path.includes('access_token=') ||
      fullUrl.includes('/auth/callback#access_token=') || 
      fullUrl.includes('/auth/callback?') || 
      fullUrl.includes('/auth/callback/access_token=')
    );
    
    const hasAuthInUrl = hasAuthInHash || hasAuthInSearch || hasAuthInPath;
    const hasError = fullUrl.includes('error=') || fullUrl.includes('error_description=');
    
    return {
      fullUrl,
      hash,
      search,
      path,
      hasAuthInHash,
      hasAuthInSearch,
      hasAuthInPath,
      hasAuthInUrl,
      hasError
    };
  }, []);

  return {
    getAuthUrlInfo
  };
}
