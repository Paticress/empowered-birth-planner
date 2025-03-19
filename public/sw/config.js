
// Service Worker configuration constants
const CONFIG = {
  CACHE_NAME: 'plano-parto-cache-v1',
  STATIC_ASSETS: [
    './',
    './index.html',
    './assets/index.js',
    './assets/index.css',
    './favicon.ico',
    './manifest.json'
  ],
  MAX_CACHE_ITEMS: 75,
  NETWORK_TIMEOUT: 2000,
  CROSS_ORIGIN_TIMEOUT: 3000
};

export default CONFIG;
