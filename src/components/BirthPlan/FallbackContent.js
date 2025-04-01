
// Fallback content for the BirthPlan module when it fails to load
console.log("FallbackContent for BirthPlan module loaded");

/**
 * Creates a simple fallback UI for the BirthPlan
 * @param {HTMLElement} container - The container to render the fallback content
 */
function createFallbackContent(container) {
  if (!container) return;
  
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
          <p>Carregando formulário...</p>
        </div>
        
        <div class="bg-white p-4 border rounded-md">
          <h3 class="font-semibold mb-2">Preferências do Parto</h3>
          <p>Carregando opções...</p>
        </div>
        
        <button class="bg-blue-600 text-white px-4 py-2 rounded mt-4" onclick="window.location.reload()">
          Tentar Novamente
        </button>
      </div>
    </div>
  `;
}

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
