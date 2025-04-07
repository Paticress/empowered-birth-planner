
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, CircleCheck } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MagicLinkFormProps {
  magicLinkEmail: string;
  setMagicLinkEmail: (email: string) => void;
  isLoading: boolean;
  isMagicLinkSent: boolean;
  setIsMagicLinkSent: (sent: boolean) => void;
  handleMagicLinkSubmit: (e: React.FormEvent) => Promise<void>;
  loadingText?: string;
}

export function MagicLinkForm({
  magicLinkEmail,
  setMagicLinkEmail,
  isLoading,
  isMagicLinkSent,
  setIsMagicLinkSent,
  handleMagicLinkSubmit,
  loadingText = "Enviando link de acesso..."
}: MagicLinkFormProps) {
  if (isMagicLinkSent) {
    return (
      <div className="space-y-6">
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CircleCheck className="h-5 w-5 text-green-600" />
          <AlertDescription className="pl-6">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{loadingText}</span>
              </div>
            ) : (
              <>
                <p className="font-medium mb-1">Link enviado com sucesso!</p>
                <p>Verifique seu email para acessar sua conta.</p>
              </>
            )}
          </AlertDescription>
        </Alert>
        
        <p className="text-sm text-gray-600">
          Não recebeu o email? Verifique sua caixa de spam ou 
          <button 
            type="button" 
            onClick={() => setIsMagicLinkSent(false)} 
            className="text-maternal-600 hover:text-maternal-800 font-medium ml-1"
            disabled={isLoading}
          >
            tente novamente
          </button>
        </p>
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
          disabled={isLoading}
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full font-semibold"
        disabled={isLoading}
        variant="birth-plan-builder"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText}
          </>
        ) : (
          <>
            <Mail className="mr-2 h-5 w-5" />
            Enviar Link de Acesso
          </>
        )}
      </Button>
    </form>
  );
}
