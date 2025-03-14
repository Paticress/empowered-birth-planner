
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Facebook, Link, Linkedin, Twitter, WhatsApp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface GuideShareProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTab: string;
}

export function GuideShare({ open, onOpenChange, currentTab }: GuideShareProps) {
  const [copied, setCopied] = useState(false);
  
  const tabNames: Record<string, string> = {
    introduction: "Introdução ao Plano de Parto",
    structure: "Estrutura do Plano de Parto",
    rights: "Direitos no Parto",
    communication: "Comunicação com a Equipe Médica",
    checklist: "Checklist do Plano de Parto",
    resources: "Recursos Adicionais"
  };
  
  const shareTitle = `Guia do Plano de Parto - ${tabNames[currentTab] || 'Energia Materna'}`;
  const shareText = "Confira este guia completo para criar seu plano de parto humanizado!";
  
  const currentUrl = window.location.href.split('?')[0];
  const shareUrl = `${currentUrl}?tab=${currentTab}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    
    toast({
      title: "Link copiado!",
      description: "O link foi copiado para a área de transferência.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleShare = (platform: string) => {
    let shareLink = '';
    
    switch (platform) {
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareLink = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
        break;
      case 'linkedin':
        shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareLink, '_blank');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Compartilhar</DialogTitle>
          <DialogDescription>
            Compartilhe este guia com outras pessoas que estão planejando seu parto.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="flex flex-col space-y-2">
            <div className="text-sm font-medium">Link direto</div>
            <div className="flex space-x-2">
              <Input
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={handleCopyLink}
                className="shrink-0"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          <div className="text-sm font-medium">Redes sociais</div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="flex-1 min-w-[100px]"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-[100px]"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-[100px]"
              onClick={() => handleShare('whatsapp')}
            >
              <WhatsApp className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              className="flex-1 min-w-[100px]"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
