
/**
 * Utility functions for authentication debugging
 */

/**
 * Get detailed information about the current URL for debugging authentication issues
 */
export function getAuthDebugInfo(): Record<string, any> {
  return {
    // URL information
    fullUrl: window.location.href,
    origin: window.location.origin,
    hostname: window.location.hostname,
    pathname: window.location.pathname,
    search: window.location.search || '(none)',
    hash: window.location.hash || '(none)',
    
    // Token detection
    hasTokenInHash: window.location.hash.includes('access_token='),
    hasTokenInSearch: window.location.search.includes('access_token=') || 
                     window.location.search.includes('code='),
    hasTokenInPath: window.location.pathname.includes('access_token='),
    hasTokenInFullUrl: window.location.href.includes('access_token='),
    
    // Error detection
    hasError: window.location.href.includes('error=') || 
             window.location.href.includes('error_code=') || 
             window.location.href.includes('error_description='),
    
    // Environment information
    isProduction: process.env.NODE_ENV === 'production',
    isHttps: window.location.protocol === 'https:',
    userAgent: navigator.userAgent,
    
    // Timestamp
    timestamp: new Date().toISOString()
  };
}

/**
 * Log detailed authentication debug information
 */
export function logAuthDebugInfo(label: string = 'Auth Debug'): void {
  const debugInfo = getAuthDebugInfo();
  console.log(`[${debugInfo.timestamp}] ${label}:`, debugInfo);
  return debugInfo;
}

/**
 * Extract token information from URL for debugging
 */
export function extractTokenDebugInfo(): Record<string, any> | null {
  try {
    const { hash, search, pathname, href } = window.location;
    
    // Look for token in hash
    if (hash && hash.includes('access_token=')) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');
      const expiresIn = hashParams.get('expires_in');
      
      if (accessToken) {
        return {
          source: 'hash',
          accessTokenLength: accessToken.length,
          accessTokenPrefix: accessToken.substring(0, 10) + '...',
          hasRefreshToken: !!refreshToken,
          refreshTokenLength: refreshToken ? refreshToken.length : 0,
          expiresIn: expiresIn,
          timestamp: new Date().toISOString()
        };
      }
    }
    
    // Look for token in path or URL
    const urlsToCheck = [pathname, href];
    for (const url of urlsToCheck) {
      if (url.includes('access_token=')) {
        const tokenIndex = url.indexOf('access_token=');
        const tokenPart = url.substring(tokenIndex);
        // Extract at least the token type
        const tokenMatch = tokenPart.match(/access_token=([^&]+)/);
        if (tokenMatch && tokenMatch[1]) {
          return {
            source: url === pathname ? 'path' : 'fullUrl',
            accessTokenLength: tokenMatch[1].length,
            accessTokenPrefix: tokenMatch[1].substring(0, 10) + '...',
            rawTokenPart: tokenPart.substring(0, 50) + '...',
            timestamp: new Date().toISOString()
          };
        }
      }
    }
    
    // Look for search params
    if (search && (search.includes('access_token=') || search.includes('code='))) {
      const searchParams = new URLSearchParams(search);
      const accessToken = searchParams.get('access_token');
      const code = searchParams.get('code');
      
      if (accessToken) {
        return {
          source: 'search',
          accessTokenLength: accessToken.length,
          accessTokenPrefix: accessToken.substring(0, 10) + '...',
          timestamp: new Date().toISOString()
        };
      } else if (code) {
        return {
          source: 'search',
          codeLength: code.length,
          codePrefix: code.substring(0, 10) + '...',
          timestamp: new Date().toISOString()
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting token debug info:', error);
    return {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    };
  }
}
