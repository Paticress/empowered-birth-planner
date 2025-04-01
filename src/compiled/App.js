
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
  
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#1e293b'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#475569',
      marginBottom: '1.5rem'
    },
    section: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.75rem',
      color: '#334155'
    },
    formGroup: {
      marginBottom: '1rem'
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500'
    },
    input: {
      width: '100%',
      padding: '0.5rem',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      cursor: 'pointer'
    }
  };
  
  return React.createElement('div', { style: styles.container },
    React.createElement('div', { style: styles.header },
      React.createElement('h1', { style: styles.title }, "Construtor de Plano de Parto"),
      React.createElement('p', { style: styles.subtitle }, "Seu assistente para criar um plano de parto personalizado")
    ),
    
    React.createElement('div', { style: styles.section },
      React.createElement('h2', { style: styles.sectionTitle }, "Bem-vinda ao Construtor de Plano de Parto"),
      React.createElement('p', null, "Esta ferramenta ajudará você a criar um plano de parto que reflete suas preferências e necessidades.")
    ),
    
    React.createElement('div', { style: styles.section },
      React.createElement('h2', { style: styles.sectionTitle }, "Informações Pessoais"),
      React.createElement('div', { style: { backgroundColor: 'white', padding: '1rem', borderRadius: '0.5rem' } },
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, "Seu nome:"),
          React.createElement('input', { 
            type: "text", 
            style: styles.input,
            placeholder: "Digite seu nome completo" 
          })
        ),
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, "Data prevista para o parto:"),
          React.createElement('input', { 
            type: "date", 
            style: styles.input 
          })
        ),
        React.createElement('div', { style: styles.formGroup },
          React.createElement('label', { style: styles.label }, "Local do parto:"),
          React.createElement('input', { 
            type: "text", 
            style: styles.input,
            placeholder: "Hospital, casa de parto, etc." 
          })
        )
      )
    ),
    
    React.createElement('div', { style: { textAlign: 'center', marginTop: '2rem' } }, 
      React.createElement('button', {
        style: styles.button,
        onClick: function() { 
          alert('Esta é uma versão simplificada do plano de parto. Recarregue a página para tentar novamente com a versão completa.'); 
        }
      }, "Continuar")
    ),
    
    React.createElement('div', { style: { textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' } }, 
      "Se o conteúdo não estiver carregando completamente, tente recarregar a página. ",
      React.createElement('button', {
        style: { color: '#3b82f6', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' },
        onClick: function() { window.location.reload(); }
      }, "Recarregar")
    )
  );
}

// Simple guide content component
function SimpleGuide() {
  console.log("SimpleGuide component rendering");
  
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      color: '#1e293b'
    },
    subtitle: {
      fontSize: '1.125rem',
      color: '#475569',
      marginBottom: '1.5rem'
    },
    section: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '0.5rem',
      padding: '1.5rem',
      marginBottom: '1.5rem'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '0.75rem',
      color: '#334155'
    },
    card: {
      backgroundColor: 'white',
      border: '1px solid #e2e8f0',
      borderRadius: '0.375rem',
      padding: '1rem',
      marginBottom: '1rem'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      color: '#334155'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-block'
    }
  };
  
  return React.createElement('div', { style: styles.container },
    React.createElement('div', { style: styles.header },
      React.createElement('h1', { style: styles.title }, "Guia do Parto Respeitoso"),
      React.createElement('p', { style: styles.subtitle }, "Seu guia completo para um plano de parto eficaz")
    ),
    
    React.createElement('div', { style: styles.section },
      React.createElement('h2', { style: styles.sectionTitle }, "Bem-vinda ao Guia do Parto Respeitoso"),
      React.createElement('p', null, "Este guia ajudará você a compreender melhor o processo de criação de um plano de parto eficaz.")
    ),
    
    React.createElement('div', { style: styles.section },
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "O que é um plano de parto?"),
        React.createElement('p', null, "Um plano de parto é um documento que comunica suas preferências e expectativas para o trabalho de parto e nascimento do seu bebê.")
      ),
      
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "Por que criar um plano de parto?"),
        React.createElement('p', null, "Um plano de parto ajuda a comunicar suas preferências à equipe de saúde, aumentando as chances de ter uma experiência de parto positiva.")
      ),
      
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "Como criar seu plano de parto"),
        React.createElement('p', null, "Use nosso construtor de plano de parto para criar um documento personalizado baseado em suas preferências e necessidades."),
        React.createElement('div', { style: { marginTop: '1rem' } },
          React.createElement('a', {
            href: "#/criar-plano",
            style: styles.button
          }, "Ir para o Construtor de Plano de Parto")
        )
      ),
      
      React.createElement('div', { style: { textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: '#64748b' } }, 
        "Se o conteúdo não estiver carregando completamente, tente recarregar a página. ",
        React.createElement('button', {
          style: { color: '#3b82f6', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' },
          onClick: function() { window.location.reload(); }
        }, "Recarregar")
      )
    )
  );
}

// NotFound component
function NotFound() {
  console.log("NotFound component rendering");
  return React.createElement('div', { 
    style: { 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    } 
  },
    React.createElement('div', { style: { textAlign: 'center', padding: '2rem' } },
      React.createElement('h1', { style: { fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1e293b' } }, "Página não encontrada"),
      React.createElement('p', { style: { marginBottom: '1.5rem', color: '#475569' } }, "A página que você está procurando não existe ou foi movida."),
      React.createElement('a', { 
        href: "#/guia-online", 
        style: {
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          padding: '0.5rem 1rem',
          borderRadius: '0.375rem',
          fontWeight: '500',
          textDecoration: 'none',
          display: 'inline-block'
        }
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

// Add window listener to log route changes and trigger content rendering
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
      // Try to inject fallback content
      if (window.__birthPlanFallback && window.__birthPlanFallback.createFallbackContent) {
        window.__birthPlanFallback.createFallbackContent(rootElement);
      }
    }
  }
});

// Create a function to force render content in iframes
function ensureContentInIframe() {
  console.log("Checking if content needs to be rendered in iframe");
  
  var rootElement = document.getElementById('root');
  var isInIframe = window !== window.parent;
  
  if (isInIframe && rootElement) {
    console.log("Running in iframe, ensuring content is visible");
    
    // Force render app content after a short delay
    setTimeout(function() {
      if (rootElement.childNodes.length === 0 || rootElement.innerHTML.trim() === '') {
        console.log("Iframe content empty, forcing render");
        
        if (window.App && window.React && window.ReactDOM) {
          try {
            if (window.ReactDOM.createRoot) {
              window.ReactDOM.createRoot(rootElement).render(window.React.createElement(window.App));
            } else {
              window.ReactDOM.render(window.React.createElement(window.App), rootElement);
            }
            console.log("App rendered in iframe");
          } catch (error) {
            console.error("Error rendering app in iframe:", error);
            // Try to use fallback content
            if (window.__birthPlanFallback && window.__birthPlanFallback.createFallbackContent) {
              window.__birthPlanFallback.createFallbackContent(rootElement);
            }
          }
        } else {
          console.log("React not available for iframe render, using fallback");
          if (window.__birthPlanFallback && window.__birthPlanFallback.createFallbackContent) {
            window.__birthPlanFallback.createFallbackContent(rootElement);
          }
        }
      } else {
        console.log("Iframe already has content:", rootElement.innerHTML);
      }
    }, 500);
  }
}

// Run iframe check after a delay
setTimeout(ensureContentInIframe, 1000);

console.log("Compiled App.js - App component created successfully");
