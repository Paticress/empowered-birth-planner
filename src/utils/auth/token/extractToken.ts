
/**
 * Extracts token from complex URL formats
 */
export function extractTokenFromUrl(fullUrl: string): string | null {
  console.log("TokenUtils: Extracting token from complex URL format");
  
  const tokenIndex = fullUrl.indexOf('access_token=');
  if (tokenIndex !== -1) {
    return fullUrl.substring(tokenIndex);
  }
  
  return null;
}

/**
 * Handles error cases in authentication
 */
export function handleAuthError(hash: string, search: string): string | null {
  try {
    if (hash.includes('error=')) {
      return decodeURIComponent(hash.split('error=')[1].split('&')[0]);
    } else if (search.includes('error=')) {
      return decodeURIComponent(search.split('error=')[1].split('&')[0]);
    }
    
    // Check for specific OTP expired error
    if (hash.includes('error_code=otp_expired') || 
        search.includes('error_code=otp_expired') ||
        hash.includes('error_description=Email+link+is+invalid+or+has+expired') ||
        search.includes('error_description=Email+link+is+invalid+or+has+expired')) {
      return "O link de acesso expirou ou é inválido";
    }
  } catch (e) {
    console.error("TokenUtils: Error parsing error message:", e);
  }
  
  return null;
}
