
import React from 'react';
import { Copy, FileText, Share2, Mail } from 'lucide-react';
import { ShareOption } from '../ShareOption';

interface ShareOptionsGridProps {
  onCopyText: () => void;
  onExportWord: () => void;
  onShareWhatsApp: () => void;
  onOpenEmailDialog: () => void;
}

export function ShareOptionsGrid({
  onCopyText,
  onExportWord,
  onShareWhatsApp,
  onOpenEmailDialog
}: ShareOptionsGridProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-semibold text-maternal-800 mb-6">Opções de Compartilhamento</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ShareOption
          icon={Copy}
          title="Copiar Texto"
          description="Copie o conteúdo para compartilhar"
          onClick={onCopyText}
        />
        
        <ShareOption
          icon={FileText}
          title="Word (Editável)"
          description="Salve como documento editável"
          onClick={onExportWord}
        />
        
        <ShareOption
          icon={Share2}
          title="WhatsApp"
          description="Compartilhe via WhatsApp"
          onClick={onShareWhatsApp}
        />
        
        <ShareOption
          icon={Mail}
          title="E-mail"
          description="Envie por e-mail para sua equipe"
          onClick={onOpenEmailDialog}
        />
      </div>
    </div>
  );
}
