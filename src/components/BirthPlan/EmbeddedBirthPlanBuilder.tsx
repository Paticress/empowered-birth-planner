
import { BirthPlanBuilder } from './BirthPlanBuilder';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import '../../styles/embed.css';

export function EmbeddedBirthPlanBuilder() {
  const [loaded, setLoaded] = useState(false);
  
  // Debug logs to check component rendering
  console.log("EmbeddedBirthPlanBuilder - Component rendering started");
  
  // Enviar mensagem para o iframe container sobre o tamanho
  useEffect(() => {
    console.log("EmbeddedBirthPlanBuilder - useEffect running");
    
    const sendResizeMessage = () => {
      // Envia mensagem para o container (Wix) com altura do conteúdo
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: 'resize', height }, '*');
      console.log("Sending resize message, height:", height);
    };

    // Envia mensagem inicial e configura listener para resize
    sendResizeMessage();
    window.addEventListener('resize', sendResizeMessage);
    
    // Verificar periodicamente mudanças de altura no conteúdo
    const resizeInterval = setInterval(sendResizeMessage, 500);

    // Remove o Header padrão do site que pode estar aparecendo
    document.body.classList.add('embedded-mode');
    
    console.log("EmbeddedBirthPlanBuilder mounted completely");
    setLoaded(true);

    return () => {
      console.log("EmbeddedBirthPlanBuilder - Cleanup running");
      window.removeEventListener('resize', sendResizeMessage);
      clearInterval(resizeInterval);
      document.body.classList.remove('embedded-mode');
    };
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
