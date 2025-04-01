
// Enhanced GPT Engineer fallback script
(function() {
  console.log("GPT Engineer fallback script initializing");
  
  // Create fallback right away, will be replaced if real one loads
  window.gptengineer = window.gptengineer || {
    initialized: true,
    version: 'fallback-1.0',
    
    init: function() {
      console.log("GPT Engineer fallback init called");
      return true;
    },
    
    createSelect: function(element, options) {
      console.log("GPT Engineer fallback createSelect called", element, options);
      // If we're in a fallback situation, just create a basic select element
      if (element && typeof document !== 'undefined') {
        try {
          // Create a simple select element as fallback
          const selectEl = document.createElement('select');
          selectEl.className = 'fallback-select';
          
          // Add a default option
          const defaultOption = document.createElement('option');
          defaultOption.value = '';
          defaultOption.text = 'Selecione uma opção';
          defaultOption.disabled = true;
          defaultOption.selected = true;
          selectEl.appendChild(defaultOption);
          
          // Add options if provided
          if (options && Array.isArray(options)) {
            options.forEach(function(opt) {
              const optionEl = document.createElement('option');
              optionEl.value = opt.value || opt.text;
              optionEl.text = opt.text || opt.value;
              selectEl.appendChild(optionEl);
            });
          }
          
          // Replace the target element with our select
          if (typeof element === 'string') {
            const targetEl = document.querySelector(element);
            if (targetEl) {
              targetEl.innerHTML = '';
              targetEl.appendChild(selectEl);
            }
          } else if (element instanceof Element) {
            element.innerHTML = '';
            element.appendChild(selectEl);
          }
          
          return selectEl;
        } catch (e) {
          console.error("Error creating fallback select:", e);
        }
      }
      return null;
    },
    
    isAvailable: function() {
      return false;
    },
    
    onError: function(e) {
      console.error("GPT Engineer fallback error handler:", e);
    }
  };
  
  // Wait a moment to check if the main script loaded properly
  setTimeout(function() {
    // If gptengineer object is properly initialized but without createSelect, it may be partially loaded
    if (!window.gptengineer || typeof window.gptengineer.createSelect !== 'function') {
      console.log("GPT Engineer main script failed to load properly, using fallback");
      
      // Make sure our fallback is fully assigned
      window.gptengineer = window.gptengineer || {};
      
      // Add properties only if they don't exist
      if (!window.gptengineer.createSelect) {
        window.gptengineer.createSelect = function(element, options) {
          console.log("GPT Engineer fallback createSelect called", element, options);
          return null;
        };
      }
      
      if (!window.gptengineer.isAvailable) {
        window.gptengineer.isAvailable = function() {
          return false;
        };
      }
      
      if (!window.gptengineer.onError) {
        window.gptengineer.onError = function(e) {
          console.error("GPT Engineer fallback error handler:", e);
        };
      }
      
      // Let the application know that the fallback is ready
      if (window.__scriptLoader && window.__scriptLoader.state) {
        window.__scriptLoader.state.gptEngineer = true;
      }
      
      // Dispatch an event in case anyone is listening for it
      try {
        window.dispatchEvent(new CustomEvent('gpteng-ready', { detail: { fallback: true } }));
      } catch (e) {
        console.error("Failed to dispatch gpteng-ready event:", e);
      }

      // Try to load main app code since we're ready
      if (window.__appLoader) {
        window.__appLoader();
      }
    } else {
      console.log("GPT Engineer main script loaded properly, fallback not needed");
    }
  }, 1000); // Wait 1 second to check if the main script loaded
})();
