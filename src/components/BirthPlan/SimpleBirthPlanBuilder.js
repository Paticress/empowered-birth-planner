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
  
  // Custom styles
  var styles = {
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
    sectionText: {
      color: '#475569',
      lineHeight: '1.5'
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
    cardContent: {
      color: '#475569'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'inline-block',
      textDecoration: 'none'
    },
    buttonContainer: {
      marginTop: '2rem',
      textAlign: 'center'
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
    footer: {
      marginTop: '2rem',
      textAlign: 'center',
      color: '#64748b',
      fontSize: '0.875rem'
    }
  };
  
  return React.createElement('div', { style: styles.container },
    // Header
    React.createElement('div', { style: styles.header },
      React.createElement('h1', { style: styles.title }, "Construtor de Plano de Parto"),
      React.createElement('p', { style: styles.subtitle }, "Seu assistente para criar um plano de parto personalizado")
    ),
    
    // Welcome section
    React.createElement('div', { style: styles.section },
      React.createElement('h2', { style: styles.sectionTitle }, "Bem-vinda ao Construtor de Plano de Parto"),
      React.createElement('p', { style: styles.sectionText }, 
        "Esta ferramenta ajudará você a criar um plano de parto que reflete suas preferências e necessidades. " +
        "Você poderá personalizar cada aspecto do seu plano de parto e compartilhá-lo com sua equipe de saúde."
      )
    ),
    
    // Personal information section
    React.createElement('div', { style: styles.section },
      React.createElement('h2', { style: styles.sectionTitle }, "Informações Pessoais"),
      
      // Form
      React.createElement('div', { style: styles.card },
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
    
    // Other sections
    React.createElement('div', { style: styles.section },
      React.createElement('h2', { style: styles.sectionTitle }, "Seções do Plano de Parto"),
      
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "Preferências do Ambiente"),
        React.createElement('p', { style: styles.cardContent }, "Iluminação, música, pessoas presentes e outras preferências para o ambiente do parto.")
      ),
      
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "Trabalho de Parto"),
        React.createElement('p', { style: styles.cardContent }, "Movimentação, posições, métodos de alívio da dor e outras preferências durante o trabalho de parto.")
      ),
      
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "Nascimento"),
        React.createElement('p', { style: styles.cardContent }, "Posições para o parto, episiotomia, corte do cordão umbilical e outros aspectos do nascimento.")
      ),
      
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "Pós-Parto"),
        React.createElement('p', { style: styles.cardContent }, "Contato pele a pele, amamentação, cuidados com o recém-nascido e recuperação materna.")
      )
    ),
    
    // Button
    React.createElement('div', { style: styles.buttonContainer }, 
      React.createElement('button', {
        style: styles.button,
        onClick: function() { window.location.reload(); }
      }, "Tentar Carregar Versão Completa")
    ),
    
    // Footer
    React.createElement('div', { style: styles.footer }, 
      "Se o conteúdo não estiver carregando completamente, tente recarregar a página ou voltar mais tarde."
    )
  );
}

/**
 * Simple guide component as a fallback
 */
function SimpleGuide() {
  // Check if we have React available
  var React = window.React;
  if (!React) {
    console.error("SimpleBirthPlanBuilder - React not available for SimpleGuide");
    return null;
  }
  
  // Custom styles
  var styles = {
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
    sectionText: {
      color: '#475569',
      lineHeight: '1.5'
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
    cardContent: {
      color: '#475569'
    },
    button: {
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '0.375rem',
      fontWeight: '500',
      cursor: 'pointer',
      display: 'inline-block',
      textDecoration: 'none'
    },
    buttonContainer: {
      marginTop: '1rem'
    },
    link: {
      color: '#3b82f6',
      textDecoration: 'none',
      fontWeight: '500'
    },
    footer: {
      marginTop: '2rem',
      textAlign: 'center',
      color: '#64748b',
      fontSize: '0.875rem'
    }
  };
  
  return React.createElement('div', { style: styles.container },
    // Header
    React.createElement('div', { style: styles.header },
      React.createElement('h1', { style: styles.title }, "Guia do Parto Respeitoso"),
      React.createElement('p', { style: styles.subtitle }, "Seu guia completo para um plano de parto eficaz")
    ),
    
    // Welcome section
    React.createElement('div', { style: styles.section },
      React.createElement('h2', { style: styles.sectionTitle }, "Bem-vinda ao Guia do Parto Respeitoso"),
      React.createElement('p', { style: styles.sectionText }, 
        "Este guia ajudará você a compreender melhor o processo de criação de um plano de parto eficaz. " +
        "Aqui você encontrará informações sobre seus direitos, dicas para comunicação com a equipe médica e orientações para estruturar seu plano."
      )
    ),
    
    // Main content
    React.createElement('div', { style: styles.section },
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "O que é um plano de parto?"),
        React.createElement('p', { style: styles.cardContent }, 
          "Um plano de parto é um documento que comunica suas preferências e expectativas para o trabalho de parto e nascimento do seu bebê. " +
          "É uma forma de expressar seus desejos para a equipe que irá acompanhá-la durante esse momento tão especial."
        )
      ),
      
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "Por que criar um plano de parto?"),
        React.createElement('p', { style: styles.cardContent }, 
          "Um plano de parto ajuda a comunicar suas preferências à equipe de saúde, aumentando as chances de ter uma experiência de parto positiva. " +
          "Também é uma oportunidade para você se informar sobre as diferentes opções disponíveis e fazer escolhas conscientes."
        )
      ),
      
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "Seus direitos no parto"),
        React.createElement('p', { style: styles.cardContent }, 
          "Toda mulher tem o direito a um parto respeitoso, com informações claras, consentimento para procedimentos e presença de um acompanhante. " +
          "Conhecer seus direitos é fundamental para uma experiência de parto positiva."
        )
      ),
      
      React.createElement('div', { style: styles.card },
        React.createElement('h3', { style: styles.cardTitle }, "Como criar seu plano de parto"),
        React.createElement('p', { style: styles.cardContent }, 
          "Use nosso construtor de plano de parto para criar um documento personalizado baseado em suas preferências e necessidades. " +
          "Nossa ferramenta guiará você por todas as seções importantes para um plano de parto completo."
        ),
        React.createElement('div', { style: styles.buttonContainer },
          React.createElement('a', {
            href: "#/criar-plano",
            style: styles.button
          }, "Ir para o Construtor de Plano de Parto")
        )
      )
    ),
    
    // Button
    React.createElement('div', { style: { textAlign: 'center', marginTop: '2rem' } }, 
      React.createElement('button', {
        style: styles.button,
        onClick: function() { window.location.reload(); }
      }, "Tentar Carregar Versão Completa")
    ),
    
    // Footer
    React.createElement('div', { style: styles.footer }, 
      "Se o conteúdo não estiver carregando completamente, tente recarregar a página ou voltar mais tarde."
    )
  );
}

// Auto-render the component if we detect we're on the criar-plano route and the page is empty
(function() {
  // Wait for DOM to be ready
  function checkAndRender() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // Get the current hash route
      var currentHash = window.location.hash || '#/';
      console.log("SimpleBirthPlanBuilder - detected route:", currentHash);
      
      // Check if we're on the criar-plano or guide route
      var isCreatorRoute = currentHash.includes('criar-plano');
      var isGuideRoute = currentHash.includes('guia-online') || currentHash === '#/';
      
      if (isCreatorRoute || isGuideRoute) {
        console.log("SimpleBirthPlanBuilder - on a content route, checking if render is needed");
        
        // Check if the main content area is empty
        var mainContent = document.querySelector('main') || document.getElementById('root');
        
        if (mainContent && (!mainContent.hasChildNodes() || mainContent.innerHTML.trim() === '' || mainContent.innerText.trim() === '')) {
          console.log("SimpleBirthPlanBuilder - main content is empty, attempting to render");
          
          if (window.React && window.ReactDOM) {
            // Clear any previous content
            mainContent.innerHTML = '';
            
            var container = document.createElement('div');
            container.className = 'fallback-birth-plan-container';
            mainContent.appendChild(container);
            
            // Render the appropriate component
            var componentToRender = isCreatorRoute ? SimpleBirthPlanBuilder : SimpleGuide;
            
            try {
              if (window.ReactDOM.createRoot) {
                window.ReactDOM.createRoot(container).render(window.React.createElement(componentToRender));
              } else {
                window.ReactDOM.render(window.React.createElement(componentToRender), container);
              }
              
              console.log("SimpleBirthPlanBuilder - component rendered successfully");
            } catch (error) {
              console.error("SimpleBirthPlanBuilder - Error rendering with React:", error);
              
              // Fall back to FallbackContent
              if (window.__birthPlanFallback && window.__birthPlanFallback.createFallbackContent) {
                window.__birthPlanFallback.createFallbackContent(mainContent);
              }
            }
          } else {
            console.log("SimpleBirthPlanBuilder - React or ReactDOM not available, using FallbackContent");
            if (window.__birthPlanFallback && window.__birthPlanFallback.createFallbackContent) {
              window.__birthPlanFallback.createFallbackContent(mainContent);
            }
          }
        } else {
          console.log("SimpleBirthPlanBuilder - content already exists, no need to render fallback");
        }
      }
    } else {
      setTimeout(checkAndRender, 100);
    }
  }
  
  // First check after a short delay
  setTimeout(checkAndRender, 500);
  
  // Also check when hash changes
  window.addEventListener('hashchange', function() {
    console.log("SimpleBirthPlanBuilder - hash changed, checking if render is needed");
    setTimeout(checkAndRender, 300);
  });
  
  // Check periodically for 10 seconds to ensure content is rendered
  var checkInterval = setInterval(function() {
    checkAndRender();
  }, 2000);
  
  setTimeout(function() {
    clearInterval(checkInterval);
  }, 10000);
})();

// Export for non-module contexts
if (typeof window !== 'undefined') {
  window.__simpleBirthPlanBuilder = {
    SimpleBirthPlanBuilder: SimpleBirthPlanBuilder,
    SimpleGuide: SimpleGuide
  };
}

// Try to support module.exports for compatibility
try {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
      SimpleBirthPlanBuilder: SimpleBirthPlanBuilder,
      SimpleGuide: SimpleGuide
    };
  }
} catch (e) {
  console.warn("Module exports not supported in this context");
}
