
/**
 * Cleans up URL after auth processing by removing token and error parameters
 */
export function cleanUrlAfterAuth(): void {
  console.log("TokenUtils: Cleaning URL after auth processing");
  
  try {
    // Remove all auth params from URL without triggering a reload
    window.history.replaceState(
      null,
      document.title,
      window.location.pathname
    );
    
    console.log("TokenUtils: URL cleaned successfully");
  } catch (error) {
    console.error("TokenUtils: Error cleaning URL:", error);
  }
}
