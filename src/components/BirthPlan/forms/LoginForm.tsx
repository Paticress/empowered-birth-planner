
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface LoginFormProps {
  loginCredentials: {
    email: string;
    password: string;
  };
  isLoading: boolean;
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: (e: React.FormEvent) => Promise<void>;
}

export function LoginForm({
  loginCredentials,
  isLoading,
  handleLoginChange,
  handleLogin
}: LoginFormProps) {
  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Insira o email usado na compra"
          value={loginCredentials.email}
          onChange={handleLoginChange}
          required
          className="focus:border-maternal-500 focus:ring-maternal-400"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="Insira sua senha"
          value={loginCredentials.password}
          onChange={handleLoginChange}
          required
          className="focus:border-maternal-500 focus:ring-maternal-400"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full font-semibold"
        disabled={isLoading}
        variant="birth-plan-builder"
      >
        <FileText className="mr-2 h-5 w-5" />
        {isLoading ? 'Verificando...' : 'Acessar Meu Plano de Parto'}
      </Button>
    </form>
  );
}
