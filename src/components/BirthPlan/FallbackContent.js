
// Fallback content for the BirthPlan module when it fails to load
console.log("FallbackContent for BirthPlan module loaded");

/**
 * Creates a simple fallback UI for the BirthPlan
 * @param {HTMLElement} container - The container to render the fallback content
 */
function createFallbackContent(container) {
  if (!container) {
    console.warn("FallbackContent - No container provided, trying to find a suitable container");
    container = document.querySelector('main') || document.getElementById('root');
    
    if (!container) {
      console.error("FallbackContent - No suitable container found");
      return;
    }
  }
  
  console.log("FallbackContent - Rendering fallback content to", container);
  
  container.innerHTML = `
    <div class="min-h-screen bg-white p-6">
      <h1 class="text-3xl font-bold mb-4">Construtor de Plano de Parto</h1>
      <p class="mb-6">Seu assistente para criar um plano de parto personalizado</p>
      
      <div class="bg-blue-50 p-4 rounded-md mb-6">
        <h2 class="text-xl font-semibold mb-2">Bem-vinda ao Construtor de Plano de Parto</h2>
        <p>Esta ferramenta ajudará você a criar um plano de parto que reflete suas preferências e necessidades.</p>
      </div>
      
      <div class="flex flex-col space-y-4">
        <div class="bg-white p-4 border rounded-md">
          <h3 class="font-semibold mb-2">Informações Pessoais</h3>
          <p>Nome, data prevista do parto, local do parto e outras informações essenciais.</p>
        </div>
        
        <div class="bg-white p-4 border rounded-md">
          <h3 class="font-semibold mb-2">Preferências do Parto</h3>
          <p>Ambiente do parto, movimentação durante o trabalho de parto, alívio da dor e outros aspectos importantes.</p>
        </div>
        
        <div class="bg-white p-4 border rounded-md">
          <h3 class="font-semibold mb-2">Durante o Nascimento</h3>
          <p>Posições para o parto, corte do cordão umbilical, contato pele a pele e outros momentos do nascimento.</p>
        </div>
        
        <div class="bg-white p-4 border rounded-md">
          <h3 class="font-semibold mb-2">Pós-Parto</h3>
          <p>Amamentação, cuidados com o recém-nascido e recuperação materna.</p>
        </div>
        
        <button class="bg-blue-600 text-white px-4 py-2 rounded mt-4" onclick="window.location.reload()">
          Tentar Novamente
        </button>
      </div>
    </div>
  `;
  
  console.log("FallbackContent - Content rendered successfully");
}

// Auto-detect if we need to render fallback content
(function() {
  function checkAndRender() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Only run on the criar-plano route
      if (window.location.hash && window.location.hash.includes('criar-plano')) {
        console.log("FallbackContent - Detected criar-plano route, checking for content");
        
        var mainContent = document.querySelector('main') || document.getElementById('root');
        
        // If we have a container and it's empty, render fallback content
        if (mainContent && (!mainContent.hasChildNodes() || mainContent.innerHTML.trim() === '' || mainContent.innerText.trim() === '')) {
          console.log("FallbackContent - Content area is empty, rendering fallback");
          createFallbackContent(mainContent);
        }
      }
    } else {
      setTimeout(checkAndRender, 100);
    }
  }
  
  // Check after a short delay to give the normal content a chance to load
  setTimeout(checkAndRender, 1000);
})();

// Export the function for non-module environments
if (typeof window !== 'undefined') {
  window.__birthPlanFallback = {
    createFallbackContent: createFallbackContent
  };
}

// Conditional export for module environments
try {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      createFallbackContent: createFallbackContent
    };
  }
} catch (e) {
  console.warn("FallbackContent - Module exports not supported in this context");
}
