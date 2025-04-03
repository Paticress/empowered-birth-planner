
import { useState, useEffect } from "react";

interface AuthUrlInfo {
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

/**
 * Hook to detect and analyze authentication parameters in the URL
 */
export function useAuthUrlDetection(): AuthUrlInfo {
  const [urlInfo, setUrlInfo] = useState<AuthUrlInfo>({
    fullUrl: "",
    hash: "",
    search: "",
    path: "",
    hasAuthInHash: false,
    hasAuthInSearch: false,
    hasAuthInPath: false,
    hasAuthInUrl: false,
    hasError: false
  });

  useEffect(() => {
    // Check all possible locations for auth tokens
    const fullUrl = window.location.href;
    const hash = window.location.hash;
    const search = window.location.search;
    const path = window.location.pathname;
    
    // Enhanced logging for better debugging
    console.log("AuthUrlDetection: Page loaded, URL check:", { 
      path: path,
      fullUrl: fullUrl.includes('access_token=') ? 'contains-token' : 'normal',
      hash: hash ? hash.substring(0, Math.min(20, hash.length)) + '...' : 'none',
      search: search ? search.substring(0, Math.min(20, search.length)) + '...' : 'none'
    });
    
    // Detect auth parameters in all possible locations
    const hasAuthInHash = hash && hash.includes('access_token=');
    const hasAuthInSearch = search && search.includes('access_token=');
    const hasAuthInPath = path.includes('access_token=') || fullUrl.includes('/acesso-plano#access_token=');
    const hasAuthInUrl = fullUrl.includes('access_token=');
    const hasError = (hash && hash.includes('error=')) || 
                    (search && search.includes('error=')) || 
                    (path.includes('error='));

    setUrlInfo({
      fullUrl,
      hash,
      search,
      path,
      hasAuthInHash,
      hasAuthInSearch,
      hasAuthInPath,
      hasAuthInUrl: hasAuthInUrl && !hasAuthInHash && !hasAuthInSearch && !hasAuthInPath,
      hasError
    });
  }, []);

  return urlInfo;
}
