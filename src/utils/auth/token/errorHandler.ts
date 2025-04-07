
/**
 * Analyzes URL hash and search parameters to extract authentication error information
 * @param hash URL hash string (including #)
 * @param search URL search string (including ?)
 * @returns Formatted error message or null if no error is found
 */
export function handleAuthError(hash: string, search: string): string | null {
  console.log("ErrorHandler: Analyzing auth error from URL parameters");
  
  // Check for error in hash
  if (hash && hash.includes('error=')) {
    const hashErrorMatch = hash.match(/error=([^&]+)/);
    if (hashErrorMatch && hashErrorMatch[1]) {
      const errorMessage = decodeURIComponent(hashErrorMatch[1]);
      console.log("ErrorHandler: Error found in hash:", errorMessage);
      return errorMessage;
    }
  }
  
  // Check for error in search params
  if (search && search.includes('error=')) {
    const searchErrorMatch = search.match(/error=([^&]+)/);
    if (searchErrorMatch && searchErrorMatch[1]) {
      const errorMessage = decodeURIComponent(searchErrorMatch[1]);
      console.log("ErrorHandler: Error found in search params:", errorMessage);
      return errorMessage;
    }
  }
  
  // Check for OTP expired error specifically (common with magic links)
  if (
    (hash && (hash.includes('error_code=otp_expired') || hash.includes('error_description=Email+link+is+invalid+or+has+expired'))) ||
    (search && (search.includes('error_code=otp_expired') || search.includes('error_description=Email+link+is+invalid+or+has+expired')))
  ) {
    console.log("ErrorHandler: OTP expired error detected");
    return "O link de acesso expirou ou é inválido";
  }
  
  console.log("ErrorHandler: No specific error found in URL parameters");
  return null;
}
