// Compatibility script for older browsers
(function() {
  console.log('Loading compatibility script');
  document.getElementById('root').innerHTML = '<div style="text-align:center;padding:20px"><h1>Carregando...</h1></div>';
  var script = document.createElement('script');
  script.src = '/main.js';
  script.type = 'text/javascript';
  document.body.appendChild(script);
})();
