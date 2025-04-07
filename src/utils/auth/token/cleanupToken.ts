
/**
 * Cleans up the URL after authentication by removing tokens and parameters
 */
export function cleanUrlAfterAuth() {
  try {
    console.log("Cleaning URL after auth processing");
    
    // Replace the current URL with a clean version, maintaining only the path
    const path = window.location.pathname;
    const cleanPath = path.includes('/auth/callback') ? '/acesso-plano' : path;
    
    window.history.replaceState(
      null,
      document.title,
      cleanPath
    );
    
    console.log("URL cleaned successfully:", window.location.href);
  } catch (error) {
    console.error("Error cleaning URL:", error);
  }
}
