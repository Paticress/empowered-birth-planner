
import { Footer } from '@/components/Footer';
import { LoginHeader } from './LoginHeader';
import { LoginCard } from './LoginCard';

export function LoginPage() {
  return (
    <div className="bg-maternal-50 min-h-screen">
      <LoginHeader />
      
      <main className="max-w-md mx-auto px-4 py-12">
        <LoginCard />
      </main>
      
      <Footer />
    </div>
  );
}
