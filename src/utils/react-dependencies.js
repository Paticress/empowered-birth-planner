
// React dependencies loader
import { loadScript, isScriptLoaded } from './script-loader.js';

console.log('React dependencies loader initialized');

// Load React if needed
function loadReact(callback) {
  console.log("Checking React availability");
  if (!isScriptLoaded('React')) {
    console.log("React not found, loading from CDN");
    loadScript('https://unpkg.com/react@18/umd/react.production.min.js', callback, { 
      crossorigin: "anonymous",
      integrity: "sha384-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // Replace with actual integrity hash if available
    });
  } else {
    console.log("React already loaded");
    callback();
  }
}

// Load ReactDOM if needed
function loadReactDOM(callback) {
  console.log("Checking ReactDOM availability");
  if (!isScriptLoaded('ReactDOM')) {
    console.log("ReactDOM not found, loading from CDN");
    loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js', callback, { 
      crossorigin: "anonymous",
      integrity: "sha384-xxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // Replace with actual integrity hash if available
    });
  } else {
    console.log("ReactDOM already loaded");
    callback();
  }
}

// Load React Router if needed
function loadReactRouter(callback) {
  console.log("Checking ReactRouterDOM availability");
  if (!isScriptLoaded('ReactRouterDOM')) {
    console.log("ReactRouterDOM not found, loading from CDN");
    loadScript('https://unpkg.com/react-router-dom@6/umd/react-router-dom.production.min.js', callback, { 
      crossorigin: "anonymous"
    });
  } else {
    console.log("ReactRouterDOM already loaded");
    callback();
  }
}

// Load all React dependencies
function loadAllReactDependencies(callback) {
  loadReact(function() {
    loadReactDOM(function() {
      loadReactRouter(callback);
    });
  });
}

export { loadReact, loadReactDOM, loadReactRouter, loadAllReactDependencies };
