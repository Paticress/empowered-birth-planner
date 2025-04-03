
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

interface SignupFormProps {
  signupCredentials: {
    email: string;
    password: string;
    confirmPassword: string;
  };
  isLoading: boolean;
  handleSignupChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSignup: (e: React.FormEvent) => Promise<void>;
}

export function SignupForm({
  signupCredentials,
  isLoading,
  handleSignupChange,
  handleSignup
}: SignupFormProps) {
  return (
    <form onSubmit={handleSignup} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          placeholder="Insira seu email"
          value={signupCredentials.email}
          onChange={handleSignupChange}
          required
          className="focus:border-maternal-500 focus:ring-maternal-400"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="signup-password">Senha</Label>
        <Input
          id="signup-password"
          name="password"
          type="password"
          placeholder="Crie uma senha"
          value={signupCredentials.password}
          onChange={handleSignupChange}
          required
          className="focus:border-maternal-500 focus:ring-maternal-400"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Senha</Label>
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Confirme sua senha"
          value={signupCredentials.confirmPassword}
          onChange={handleSignupChange}
          required
          className="focus:border-maternal-500 focus:ring-maternal-400"
        />
        <p className="text-xs text-muted-foreground">
          A senha deve ter no mínimo 6 caracteres
        </p>
      </div>
      
      <Button 
        type="submit" 
        className="w-full font-semibold"
        disabled={isLoading}
        variant="birth-plan-builder"
      >
        <UserPlus className="mr-2 h-5 w-5" />
        {isLoading ? 'Cadastrando...' : 'Criar Conta'}
      </Button>
    </form>
  );
}
