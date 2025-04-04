
/**
 * Cleans auth parameters from URL
 */
export function cleanUrlAfterAuth(): void {
  window.history.replaceState(null, document.title, window.location.pathname);
}
