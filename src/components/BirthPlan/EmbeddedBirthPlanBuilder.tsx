
import { BirthPlanBuilder } from './BirthPlanBuilder';
import { useEffect, useState } from 'react';

export function EmbeddedBirthPlanBuilder() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    url: '',
    time: '',
    userAgent: ''
  });

  // Capture debug information
  useEffect(() => {
    setDebugInfo({
      url: window.location.href,
      time: new Date().toString(),
      userAgent: navigator.userAgent
    });
    
    console.log("EmbeddedBirthPlanBuilder mounted with debug info:", {
      url: window.location.href,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }, []);

  // Enviar mensagem para o iframe container sobre o tamanho
  useEffect(() => {
    const sendResizeMessage = () => {
      // Log dimensions for debugging
      console.log("Content height:", document.body.scrollHeight);
      
      // Envia mensagem para o container (Wix) com altura do conteúdo
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: 'resize', height }, '*');
    };

    // Envia mensagem inicial e configura listener para resize
    sendResizeMessage();
    window.addEventListener('resize', sendResizeMessage);
    
    // Verificar periodicamente mudanças de altura no conteúdo
    const resizeInterval = setInterval(() => {
      sendResizeMessage();
      if (!isLoaded && document.body.scrollHeight > 100) {
        setIsLoaded(true);
      }
    }, 500);

    // Adicionar uma mensagem de carregamento completo após um curto atraso
    setTimeout(() => {
      console.log("Sending loaded message to parent");
      window.parent.postMessage({ type: 'loaded', status: 'success' }, '*');
      setIsLoaded(true);
      sendResizeMessage(); // Enviar tamanho novamente após carregamento
    }, 1000);

    return () => {
      window.removeEventListener('resize', sendResizeMessage);
      clearInterval(resizeInterval);
    };
  }, [isLoaded]);

  // Listen for messages from parent
  useEffect(() => {
    const handleMessage = (event) => {
      console.log("Message received from parent:", event.data);
      
      // If parent asks for size, send it
      if (event.data && event.data.type === 'checkSize') {
        const height = document.body.scrollHeight;
        window.parent.postMessage({ type: 'resize', height }, '*');
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return (
    <div className="embedded-root">
      {/* Display debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          padding: '10px', 
          marginBottom: '10px',
          fontSize: '12px'
        }}>
          <p>Debug Info: {debugInfo.url}</p>
          <p>Time: {debugInfo.time}</p>
          <p>Agent: {debugInfo.userAgent}</p>
        </div>
      )}
      
      {/* Passando embedded=true para indicar que está sendo usado em um iframe/contexto incorporado */}
      <BirthPlanBuilder embedded={true} />
    </div>
  );
}
