
/* Service Worker Configuration */
// Content-Type: application/javascript

// Configuration settings for the Service Worker
const config = {
  debug: false,  // Set to true to enable detailed logging
  version: '1.0.0',
  cacheName: 'energia-materna-cache-v1',
  precacheItems: [
    '/',
    '/index.html',
    '/favicon.ico'  // Added favicon to precache list
  ]
};

// Function to enable/disable debug mode
function setDebugMode(enable) {
  config.debug = enable;
}

// Debug logging helper
function logDebug(message) {
  if (config.debug) {
    console.log(`[SW Debug] ${message}`);
  }
}

// Error logging helper
function logError(message, error) {
  console.error(`[SW Error] ${message}`, error);
}
