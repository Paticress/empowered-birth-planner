
import { BirthPlanBuilder } from './BirthPlanBuilder';
import { useEffect } from 'react';

export function EmbeddedBirthPlanBuilder() {
  // Debugging
  useEffect(() => {
    console.log("EmbeddedBirthPlanBuilder mounted and running");
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
    const resizeInterval = setInterval(sendResizeMessage, 500);

    // Adicionar uma mensagem de carregamento completo após um curto atraso
    setTimeout(() => {
      console.log("Sending loaded message to parent");
      window.parent.postMessage({ type: 'loaded', status: 'success' }, '*');
      sendResizeMessage(); // Enviar tamanho novamente após carregamento
    }, 1000);

    return () => {
      window.removeEventListener('resize', sendResizeMessage);
      clearInterval(resizeInterval);
    };
  }, []);

  return (
    <div className="embedded-root">
      {/* Passando embedded=true para indicar que está sendo usado em um iframe/contexto incorporado */}
      <BirthPlanBuilder embedded={true} />
    </div>
  );
}
