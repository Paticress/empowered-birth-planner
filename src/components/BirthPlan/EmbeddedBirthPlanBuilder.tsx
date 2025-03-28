
import { BirthPlanBuilder } from './BirthPlanBuilder';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import '../../styles/embed.css';
import { useDomainDebug } from '@/hooks/useDomainDebug';

export function EmbeddedBirthPlanBuilder() {
  const [loaded, setLoaded] = useState(false);
  
  // Use debug hook
  useDomainDebug();
  
  // Debug logs to check component rendering
  console.log("EmbeddedBirthPlanBuilder - Component rendering started");
  
  // Enviar mensagem para o iframe container sobre o tamanho
  useEffect(() => {
    console.log("EmbeddedBirthPlanBuilder - useEffect running");
    
    const sendResizeMessage = () => {
      // Envia mensagem para o container (Wix) com altura do conteúdo
      const height = document.body.scrollHeight;
      try {
        window.parent.postMessage({ 
          type: 'resize', 
          height, 
          source: 'energia-materna-birth-plan',
          component: 'EmbeddedBirthPlanBuilder'
        }, '*');
        console.log("EmbeddedBirthPlanBuilder - Sending resize message, height:", height);
      } catch (error) {
        console.error("EmbeddedBirthPlanBuilder - Error sending postMessage:", error);
      }
    };

    // Envia mensagem inicial e configura listener para resize
    setTimeout(sendResizeMessage, 100);
    window.addEventListener('resize', sendResizeMessage);
    
    // Observe DOM changes to detect content changes
    const observer = new MutationObserver(() => {
      console.log("EmbeddedBirthPlanBuilder - DOM mutation detected, sending resize");
      sendResizeMessage();
    });
    
    // Start observing
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      characterData: true 
    });
    
    // Verificar periodicamente mudanças de altura no conteúdo
    const resizeInterval = setInterval(sendResizeMessage, 500);

    // Remove o Header padrão do site que pode estar aparecendo
    document.body.classList.add('embedded-mode');
    
    // Send ready signal to parent
    try {
      window.parent.postMessage({ 
        type: 'ready', 
        source: 'energia-materna-birth-plan',
        component: 'EmbeddedBirthPlanBuilder',
        url: window.location.href
      }, '*');
      console.log("EmbeddedBirthPlanBuilder - Sent ready message to parent");
    } catch (error) {
      console.error("EmbeddedBirthPlanBuilder - Error sending ready message:", error);
    }
    
    console.log("EmbeddedBirthPlanBuilder mounted completely");
    setLoaded(true);

    return () => {
      console.log("EmbeddedBirthPlanBuilder - Cleanup running");
      window.removeEventListener('resize', sendResizeMessage);
      clearInterval(resizeInterval);
      observer.disconnect();
      document.body.classList.remove('embedded-mode');
    };
  }, []);

  // Listen for messages from parent window
  useEffect(() => {
    const handleParentMessages = (event: MessageEvent) => {
      console.log("EmbeddedBirthPlanBuilder - Received message from parent:", event.data);
      
      // Handle check message from parent
      if (event.data && event.data.type === 'wix-check') {
        try {
          window.parent.postMessage({ 
            type: 'loaded', 
            source: 'energia-materna-birth-plan',
            component: 'EmbeddedBirthPlanBuilder',
            height: document.body.scrollHeight
          }, '*');
          console.log("EmbeddedBirthPlanBuilder - Sent loaded confirmation to parent");
        } catch (error) {
          console.error("EmbeddedBirthPlanBuilder - Error sending loaded confirmation:", error);
        }
      }
    };
    
    window.addEventListener('message', handleParentMessages);
    return () => window.removeEventListener('message', handleParentMessages);
  }, []);

  if (!loaded) {
    console.log("EmbeddedBirthPlanBuilder - Initial loading state");
    return <div className="p-8 text-center">Carregando...</div>;
  }

  console.log("EmbeddedBirthPlanBuilder - Rendering main content");
  return (
    <div className="relative embedded-container">
      {/* Banner de navegação para a versão completa */}
      <div className="bg-maternal-800 text-white p-2 text-center">
        <p className="text-sm">
          Esta é a versão incorporada do Construtor de Plano de Parto.
          <Link to="/criar-plano">
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2 text-xs bg-white text-maternal-800 hover:bg-maternal-100"
            >
              Acessar Versão Completa
            </Button>
          </Link>
        </p>
      </div>
      
      {/* Passing embedded=true to indicate that it's being used in an iframe/embedded context */}
      {/* Embedded mode skips payment verification as it will only be shown to paying users in Wix */}
      <BirthPlanBuilder embedded={true} />
    </div>
  );
}
