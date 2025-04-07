
/**
 * Check for URL-based refresh detection
 * This helps with debugging refresh issues
 */
export const isRefresh = (): boolean => {
  try {
    // Try to detect if this is a page refresh using performance API
    if (window.performance) {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const navType = (navEntries[0] as PerformanceNavigationTiming).type;
        console.log("Navigation type from Performance API:", navType);
        return navType === 'reload';
      }
    }
    return false;
  } catch (e) {
    console.error("Error detecting refresh:", e);
    return false;
  }
};

/**
 * Log important navigation information
 */
export const logNavigationInfo = (): void => {
  console.log("Application starting");
  console.log("Current URL:", window.location.href);
  console.log("Is refresh:", isRefresh());
  console.log("Path:", window.location.pathname);
};

/**
 * Log performance metrics after page load
 */
export const logPerformanceMetrics = (): void => {
  if (window.performance && 'getEntriesByType' in window.performance) {
    const navigationEntries = performance.getEntriesByType('navigation');
    if (navigationEntries && navigationEntries.length) {
      console.log('Page loaded in:', 
        (navigationEntries[0] as PerformanceNavigationTiming).loadEventEnd, 'ms');
    }
  }
};
