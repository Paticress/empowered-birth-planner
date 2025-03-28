
// Fallback entry point for older browsers
// Non-module version that doesn't use import.meta

// Imports
var React = require('react');
var ReactDOM = require('react-dom/client');
var App = require('./App').default;
require('./index.css');

console.log('Using fallback main.js entry point without modules');

function renderApp() {
  var rootElement = document.getElementById('root');
  if (rootElement) {
    var root = ReactDOM.createRoot(rootElement);
    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(App, null)
      )
    );
  } else {
    console.error('Root element not found!');
  }
}

// Execute rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderApp);
} else {
  renderApp();
}
