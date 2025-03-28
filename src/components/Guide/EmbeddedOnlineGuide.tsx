
import { OnlineGuide } from './OnlineGuide';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import '../../styles/embed.css';

export function EmbeddedOnlineGuide() {
  const [loaded, setLoaded] = useState(false);
  
  // Debug logs to check component rendering
  console.log("EmbeddedOnlineGuide - Component rendering started");
  
  // Enviar mensagem para o iframe container sobre o tamanho
  useEffect(() => {
    console.log("EmbeddedOnlineGuide - useEffect running");
    
    const sendResizeMessage = () => {
      // Envia mensagem para o container (Wix) com altura do conteúdo
      const height = document.body.scrollHeight;
      try {
        window.parent.postMessage({ 
          type: 'resize', 
          height,
          source: 'energia-materna-guide'
        }, '*');
        console.log("EmbeddedOnlineGuide - Sending resize message, height:", height);
      } catch (error) {
        console.error("EmbeddedOnlineGuide - Error sending postMessage:", error);
      }
    };

    // Envia mensagem inicial e configura listener para resize
    setTimeout(sendResizeMessage, 100);
    window.addEventListener('resize', sendResizeMessage);
    
    // Observe DOM changes to detect content changes that affect height
    const observer = new MutationObserver(() => {
      console.log("EmbeddedOnlineGuide - DOM mutation detected, sending resize");
      sendResizeMessage();
    });
    
    // Start observing
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true,
      characterData: true 
    });
    
    // Verificar periodicamente mudanças de altura no conteúdo como fallback
    const resizeInterval = setInterval(sendResizeMessage, 500);

    // Remove o Header padrão do site que pode estar aparecendo
    document.body.classList.add('embedded-mode');
    
    console.log("EmbeddedOnlineGuide mounted completely");
    setLoaded(true);

    return () => {
      console.log("EmbeddedOnlineGuide - Cleanup running");
      window.removeEventListener('resize', sendResizeMessage);
      clearInterval(resizeInterval);
      observer.disconnect();
      document.body.classList.remove('embedded-mode');
    };
  }, []);

  // Add a helpful debug message to check if the component is accessible
  useEffect(() => {
    console.log("EmbeddedOnlineGuide is accessible at URL:", window.location.href);
    
    // Listen for messages from parent to ensure two-way communication
    const handleParentMessages = (event) => {
      console.log("Received message from parent:", event.data);
      // Add any specific handling for parent messages here if needed
    };
    
    window.addEventListener('message', handleParentMessages);
    return () => window.removeEventListener('message', handleParentMessages);
  }, []);

  if (!loaded) {
    console.log("EmbeddedOnlineGuide - Initial loading state");
    return <div className="p-8 text-center">Carregando...</div>;
  }

  console.log("EmbeddedOnlineGuide - Rendering main content");
  return (
    <div className="relative embedded-container">
      {/* Banner de navegação para a versão completa */}
      <div className="bg-maternal-800 text-white p-2 text-center">
        <p className="text-sm">
          Esta é a versão incorporada do Guia do Parto Respeitoso.
          <Link to="/guia-online">
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
      
      <OnlineGuide embedded={true} />
    </div>
  );
}
