
/**
 * Cleans up URL after authentication by removing hash and search parameters
 */
export function cleanUrlAfterAuth(): void {
  console.log("TokenUtils: Cleaning URL after auth processing");
  
  try {
    // Remove hash and search parameters from URL without reloading the page
    const { pathname } = window.location;
    
    // Use history API to change URL without reloading
    window.history.replaceState(
      null,
      document.title,
      pathname
    );
    
    console.log("TokenUtils: URL cleaned successfully");
  } catch (error) {
    console.error("TokenUtils: Error cleaning URL:", error);
  }
}
