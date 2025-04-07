/**
 * Clean up the URL after authentication to remove sensitive tokens
 */
export function cleanUrlAfterAuth() {
  console.log("Cleaning up URL after authentication");
  
  // If we're on the login page, we can safely remove all hash and search params
  // But keep the pathname so we stay on the login page
  window.history.replaceState(
    {}, 
    document.title, 
    window.location.pathname
  );
}
