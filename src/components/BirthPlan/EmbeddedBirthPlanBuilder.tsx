
import { BirthPlanBuilder } from './BirthPlanBuilder';
import { useEffect } from 'react';
import '../styles/embed.css';

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
    // Passando embedded=true para indicar que está sendo usado em um iframe/contexto incorporado
    // O modo embedded pula a verificação de pagamento, pois será mostrado apenas para usuários pagantes no Wix
    <BirthPlanBuilder embedded={true} />
  );
}
