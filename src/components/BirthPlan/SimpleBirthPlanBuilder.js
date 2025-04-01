
// Simple birth plan builder for compatibility mode
console.log("SimpleBirthPlanBuilder loaded");

/**
 * Simple birth plan builder that provides a basic UI when the full component fails to load
 */
function SimpleBirthPlanBuilder() {
  // Check if we have React available
  var React = window.React;
  if (!React) {
    console.error("SimpleBirthPlanBuilder - React not available");
    return null;
  }
  
  return React.createElement('div', { className: "min-h-screen bg-white p-6" },
    React.createElement('h1', { className: "text-3xl font-bold mb-4" }, "Construtor de Plano de Parto"),
    React.createElement('p', { className: "mb-6" }, "Seu assistente para criar um plano de parto personalizado"),
    
    React.createElement('div', { className: "bg-blue-50 p-4 rounded-md mb-6" },
      React.createElement('h2', { className: "text-xl font-semibold mb-2" }, "Bem-vinda ao Construtor de Plano de Parto"),
      React.createElement('p', null, "Esta ferramenta ajudará você a criar um plano de parto que reflete suas preferências e necessidades.")
    ),
    
    React.createElement('div', { className: "flex flex-col space-y-4" },
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Informações Pessoais"),
        React.createElement('p', null, "Nome, data prevista do parto, local do parto e outras informações essenciais.")
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Preferências do Parto"),
        React.createElement('p', null, "Ambiente do parto, movimentação durante o trabalho de parto, alívio da dor e outros aspectos importantes.")
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Durante o Nascimento"),
        React.createElement('p', null, "Posições para o parto, corte do cordão umbilical, contato pele a pele e outros momentos do nascimento.")
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Pós-Parto"),
        React.createElement('p', null, "Amamentação, cuidados com o recém-nascido e recuperação materna.")
      ),
      
      React.createElement('div', { className: "mt-6" }, 
        React.createElement('p', { className: "text-sm text-gray-600" }, 
          "Se o conteúdo não estiver carregando completamente, tente recarregar a página.",
          React.createElement('button', {
            className: "ml-2 text-blue-600 underline",
            onClick: function() { window.location.reload(); }
          }, "Recarregar")
        )
      )
    )
  );
}

// Export for non-module contexts
if (typeof window !== 'undefined') {
  window.__simpleBirthPlanBuilder = SimpleBirthPlanBuilder;
}

// Try to support module.exports for compatibility
try {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      SimpleBirthPlanBuilder: SimpleBirthPlanBuilder
    };
  }
} catch (e) {
  console.warn("Module exports not supported in this context");
}
