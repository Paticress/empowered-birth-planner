
import { Button } from '@/components/ui/button';

export function LoginCardFooter() {
  return (
    <div className="mt-6 text-center text-sm text-maternal-700">
      <p>
        Ainda não tem acesso? Adquira seu plano em nosso site.
      </p>
      <Button
        variant="link"
        className="text-maternal-600 hover:text-maternal-800"
        onClick={() => window.open('https://www.energiamaterna.com.br', '_blank')}
      >
        Saiba mais
      </Button>
    </div>
  );
}
