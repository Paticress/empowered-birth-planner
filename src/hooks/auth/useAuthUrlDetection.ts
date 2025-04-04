
import { useState, useEffect } from "react";
import { AuthUrlInfo } from "@/types/auth";

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
      hash: hash ? (hash.includes('access_token') ? 'contains-token' : hash.substring(0, Math.min(20, hash.length)) + '...') : 'none',
      search: search ? (search.includes('access_token') ? 'contains-token' : search.substring(0, Math.min(20, search.length)) + '...') : 'none'
    });
    
    // More comprehensive token detection
    const hasAuthInHash = hash && hash.includes('access_token=');
    const hasAuthInSearch = search && (search.includes('access_token=') || search.includes('access_entry=magiclink'));
    
    // Enhanced path detection - check both direct path and full URL for acesso-plano#access_token pattern
    const hasAuthInPath = path.includes('access_token=') || 
                        (path.includes('acesso-plano') && fullUrl.includes('access_token=') && !hasAuthInHash);
    
    // Token in URL but not in any of the specific locations
    const hasAuthInUrl = fullUrl.includes('access_token=') && 
                        !hasAuthInHash && 
                        !hasAuthInSearch && 
                        !hasAuthInPath;
    
    // Check for errors in any location
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
      hasAuthInUrl,
      hasError
    });
    
    // Log summary of detection
    if (hasAuthInHash || hasAuthInSearch || hasAuthInPath || hasAuthInUrl) {
      console.log("AuthUrlDetection: Auth parameters detected:", {
        inHash: hasAuthInHash,
        inSearch: hasAuthInSearch,
        inPath: hasAuthInPath,
        inUrl: hasAuthInUrl,
        hasError: hasError
      });
    }
  }, []);

  return urlInfo;
}
