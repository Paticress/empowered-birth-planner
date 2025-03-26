
import { OnlineGuide } from './OnlineGuide';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import '../../styles/embed.css';

export function EmbeddedOnlineGuide() {
  // Enviar mensagem para o iframe container sobre o tamanho
  useEffect(() => {
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
    
    console.log("EmbeddedOnlineGuide mounted");

    return () => {
      window.removeEventListener('resize', sendResizeMessage);
      clearInterval(resizeInterval);
      document.body.classList.remove('embedded-mode');
    };
  }, []);

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
