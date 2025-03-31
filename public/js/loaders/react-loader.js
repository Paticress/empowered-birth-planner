
// React and React DOM loading module
(function() {
  console.log("React loader initialized");
  
  // Function to load React
  function loadReact(callback) {
    if (window.__SCRIPT_LOAD_STATE.react) {
      callback();
      return;
    }
    
    // Check if React is already defined
    if (typeof React !== 'undefined') {
      console.log("React already loaded");
      window.__SCRIPT_LOAD_STATE.react = true;
      callback();
      return;
    }
    
    window.__scriptLoader.loadScript(
      "https://unpkg.com/react@18/umd/react.production.min.js",
      function() {
        console.log("React loaded");
        window.__SCRIPT_LOAD_STATE.react = true;
        callback();
      },
      { crossorigin: "anonymous" }
    );
  }
  
  // Function to load ReactDOM
  function loadReactDOM(callback) {
    if (window.__SCRIPT_LOAD_STATE.reactDom) {
      callback();
      return;
    }
    
    // Check if ReactDOM is already defined
    if (typeof ReactDOM !== 'undefined') {
      console.log("ReactDOM already loaded");
      window.__SCRIPT_LOAD_STATE.reactDom = true;
      callback();
      return;
    }
    
    window.__scriptLoader.loadScript(
      "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
      function() {
        console.log("ReactDOM loaded");
        window.__SCRIPT_LOAD_STATE.reactDom = true;
        callback();
      },
      { crossorigin: "anonymous" }
    );
  }
  
  // Expose React loaders to the global scope
  window.__reactLoader = {
    loadReact: loadReact,
    loadReactDOM: loadReactDOM
  };
})();
