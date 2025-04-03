
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Wand2 } from 'lucide-react';

interface MagicLinkFormProps {
  magicLinkEmail: string;
  setMagicLinkEmail: (email: string) => void;
  isLoading: boolean;
  isMagicLinkSent: boolean;
  setIsMagicLinkSent: (sent: boolean) => void;
  handleMagicLinkSubmit: (e: React.FormEvent) => Promise<void>;
}

export function MagicLinkForm({
  magicLinkEmail,
  setMagicLinkEmail,
  isLoading,
  isMagicLinkSent,
  setIsMagicLinkSent,
  handleMagicLinkSubmit
}: MagicLinkFormProps) {
  if (isMagicLinkSent) {
    return (
      <div className="space-y-4">
        <Alert className="bg-maternal-50 border-maternal-200">
          <AlertDescription className="text-maternal-800">
            <div className="flex flex-col items-center text-center space-y-2">
              <Mail className="h-12 w-12 text-maternal-600 mb-2" />
              <h3 className="font-semibold text-lg">Link Enviado!</h3>
              <p>Verifique seu email para acessar sua conta com apenas um clique.</p>
              <p className="text-sm text-maternal-600 mt-2">Não recebeu? Verifique sua pasta de spam ou solicite novamente.</p>
            </div>
          </AlertDescription>
        </Alert>
        <Button 
          onClick={() => setIsMagicLinkSent(false)}
          variant="outline"
          className="w-full"
        >
          Solicitar Novamente
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="magic-link-email">Email</Label>
        <Input
          id="magic-link-email"
          type="email"
          placeholder="Insira o email usado na compra"
          value={magicLinkEmail}
          onChange={(e) => setMagicLinkEmail(e.target.value)}
          required
          className="focus:border-maternal-500 focus:ring-maternal-400"
        />
      </div>
      
      <div className="bg-maternal-50 p-3 rounded-md border border-maternal-100 text-sm text-maternal-700">
        <p>Receba um link de acesso direto no seu email. Sem necessidade de lembrar senhas!</p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full font-semibold"
        disabled={isLoading}
        variant="birth-plan-builder"
      >
        <Wand2 className="mr-2 h-5 w-5" />
        {isLoading ? 'Enviando...' : 'Enviar Link de Acesso'}
      </Button>
    </form>
  );
}
