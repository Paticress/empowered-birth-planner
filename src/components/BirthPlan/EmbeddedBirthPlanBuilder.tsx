
import { BirthPlanBuilder } from './BirthPlanBuilder';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import '../../styles/embed.css';  // Updated import path

export function EmbeddedBirthPlanBuilder() {
  // Enviar mensagem para o iframe container sobre o tamanho
  useEffect(() => {
    const sendResizeMessage = () => {
      // Envia mensagem para o container (Wix) com altura do conteúdo
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: 'resize', height }, '*');
    };

    // Envia mensagem inicial e configura listener para resize
    sendResizeMessage();
    window.addEventListener('resize', sendResizeMessage);
    
    // Verificar periodicamente mudanças de altura no conteúdo
    const resizeInterval = setInterval(sendResizeMessage, 500);

    return () => {
      window.removeEventListener('resize', sendResizeMessage);
      clearInterval(resizeInterval);
    };
  }, []);

  return (
    <div className="relative">
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
      
      {/* Passando embedded=true para indicar que está sendo usado em um iframe/contexto incorporado */}
      {/* O modo embedded pula a verificação de pagamento, pois será mostrado apenas para usuários pagantes no Wix */}
      <BirthPlanBuilder embedded={true} />
    </div>
  );
}
