
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
