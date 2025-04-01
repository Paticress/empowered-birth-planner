
// Compiled version of App.js for browsers that don't support ES modules
console.log("Compiled App.js - Loading pre-compiled app");

// Debug function to log route information
function logRoute() {
  console.log("Current hash route:", window.location.hash || '/');
  console.log("Root element state:", document.getElementById('root') ? "exists" : "missing");
}

// Call immediately to check initial route
logRoute();

// Define a simple BirthPlanBuilder component that actually renders content
function SimpleBirthPlanBuilder() {
  console.log("SimpleBirthPlanBuilder component rendering");
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
        React.createElement('form', { className: "mt-3" },
          React.createElement('div', { className: "mb-3" },
            React.createElement('label', { className: "block text-sm font-medium mb-1" }, "Seu nome:"),
            React.createElement('input', { 
              type: "text", 
              className: "w-full px-3 py-2 border rounded-md",
              placeholder: "Digite seu nome completo" 
            })
          ),
          React.createElement('div', { className: "mb-3" },
            React.createElement('label', { className: "block text-sm font-medium mb-1" }, "Data prevista para o parto:"),
            React.createElement('input', { 
              type: "date", 
              className: "w-full px-3 py-2 border rounded-md" 
            })
          ),
          React.createElement('div', { className: "mb-3" },
            React.createElement('label', { className: "block text-sm font-medium mb-1" }, "Local do parto:"),
            React.createElement('input', { 
              type: "text", 
              className: "w-full px-3 py-2 border rounded-md",
              placeholder: "Hospital, casa de parto, etc." 
            })
          )
        )
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Preferências do Parto"),
        React.createElement('p', null, "Ambiente do parto, movimentação durante o trabalho de parto, alívio da dor e outros aspectos importantes.")
      ),
      
      React.createElement('div', { className: "mt-6 flex justify-center" },
        React.createElement('button', {
          className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
          onClick: function() { alert('Esta é uma versão simplificada do plano de parto. Recarregue a página para tentar novamente com a versão completa.'); }
        }, "Continuar")
      ),
      
      React.createElement('div', { className: "mt-6" }, 
        React.createElement('p', { className: "text-sm text-gray-600 text-center" }, 
          "Se o conteúdo não estiver carregando completamente, tente recarregar a página. ",
          React.createElement('button', {
            className: "text-blue-600 underline",
            onClick: function() { window.location.reload(); }
          }, "Recarregar")
        )
      )
    )
  );
}

// Simple guide content component
function SimpleGuide() {
  console.log("SimpleGuide component rendering");
  return React.createElement('div', { className: "min-h-screen bg-white p-6" },
    React.createElement('h1', { className: "text-3xl font-bold mb-4" }, "Guia do Parto Respeitoso"),
    React.createElement('p', { className: "mb-6" }, "Seu guia completo para um plano de parto eficaz"),
    
    React.createElement('div', { className: "bg-blue-50 p-4 rounded-md mb-6" },
      React.createElement('h2', { className: "text-xl font-semibold mb-2" }, "Bem-vinda ao Guia do Parto Respeitoso"),
      React.createElement('p', null, "Este guia ajudará você a compreender melhor o processo de criação de um plano de parto eficaz.")
    ),
    
    React.createElement('div', { className: "flex flex-col space-y-4" },
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "O que é um plano de parto?"),
        React.createElement('p', null, "Um plano de parto é um documento que comunica suas preferências e expectativas para o trabalho de parto e nascimento do seu bebê.")
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Por que criar um plano de parto?"),
        React.createElement('p', null, "Um plano de parto ajuda a comunicar suas preferências à equipe de saúde, aumentando as chances de ter uma experiência de parto positiva.")
      ),
      
      React.createElement('div', { className: "bg-white p-4 border rounded-md" },
        React.createElement('h3', { className: "font-semibold mb-2" }, "Como criar seu plano de parto"),
        React.createElement('p', null, "Use nosso construtor de plano de parto para criar um documento personalizado baseado em suas preferências e necessidades."),
        React.createElement('div', { className: "mt-4" },
          React.createElement('a', {
            href: "#/criar-plano",
            className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
          }, "Ir para o Construtor de Plano de Parto")
        )
      )
    )
  );
}

// NotFound component
function NotFound() {
  console.log("NotFound component rendering");
  return React.createElement('div', { className: "min-h-screen bg-white flex items-center justify-center" },
    React.createElement('div', { className: "text-center p-8" },
      React.createElement('h1', { className: "text-4xl font-bold mb-4" }, "Página não encontrada"),
      React.createElement('p', { className: "mb-6" }, "A página que você está procurando não existe ou foi movida."),
      React.createElement('a', { 
        href: "#/guia-online", 
        className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 inline-block"
      }, "Voltar para o Guia")
    )
  );
}

// Define the App component as a global variable
window.App = function() {
  console.log("App component rendering", "Current hash:", window.location.hash);
  
  // Get current route from hash
  var hash = window.location.hash.replace('#', '') || '/';
  
  // Render different components based on the route
  var content;
  
  if (hash === '/' || hash === '') {
    content = React.createElement(ReactRouterDOM.Navigate, { to: '/guia-online', replace: true });
  } else if (hash === '/guia-online' || hash.startsWith('/guia-online')) {
    content = React.createElement(SimpleGuide);
  } else if (hash === '/criar-plano' || hash.startsWith('/criar-plano')) {
    content = React.createElement(SimpleBirthPlanBuilder);
  } else if (hash === '/embedded-guia' || hash.startsWith('/embedded-guia')) {
    content = React.createElement('div', null, 
      React.createElement('h1', { className: "text-2xl font-bold m-4" }, "Guia do Parto Respeitoso (Versão Incorporada)"),
      React.createElement(SimpleGuide)
    );
  } else if (hash === '/embedded-plano' || hash.startsWith('/embedded-plano')) {
    content = React.createElement('div', null, 
      React.createElement('h1', { className: "text-2xl font-bold m-4" }, "Construtor de Plano de Parto (Versão Incorporada)"),
      React.createElement(SimpleBirthPlanBuilder)
    );
  } else {
    content = React.createElement(NotFound);
  }
  
  // Create a simple router
  return React.createElement(ReactRouterDOM.HashRouter, null,
    content
  );
};

// Add window listener to log route changes
window.addEventListener('hashchange', function() {
  console.log("Hash changed to:", window.location.hash);
  // Try to re-render the app
  var rootElement = document.getElementById('root');
  if (rootElement && window.App && window.React && window.ReactDOM) {
    try {
      if (window.ReactDOM.createRoot) {
        window.ReactDOM.createRoot(rootElement).render(window.React.createElement(window.App));
      } else {
        window.ReactDOM.render(window.React.createElement(window.App), rootElement);
      }
      console.log("App re-rendered after hash change");
    } catch (error) {
      console.error("Error re-rendering app after hash change:", error);
    }
  }
});

console.log("Compiled App.js - App component created successfully");
