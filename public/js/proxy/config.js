
// Configuration for CORS proxy
(function() {
  // Problematic domains that need proxying
  const problematicDomains = [
    'unpkg.com',
    'cdn.jsdelivr.net',
    'esm.sh',
    'cdnjs.cloudflare.com',
    'cdn.gpteng.co',
    'gpteng.co',
    'react-router-dom'
  ];
  
  // Trusted domains that should not be proxied
  const trustedDomains = [
    'energiamaterna.com.br',
    'planodeparto.energiamaterna.com.br',
    'localhost'
  ];
  
  // List of CORS proxy URLs to try in sequence
  const corsProxies = [
    'https://corsproxy.io/?',
    'https://cors-anywhere.herokuapp.com/',
    'https://cors.bridged.cc/'
  ];
  
  // Export configuration
  window.__proxyConfig = {
    problematicDomains,
    trustedDomains,
    corsProxies,
    currentProxyIndex: 0
  };
  
  console.log("[Proxy Config] CORS proxy configuration loaded");
})();
