
import { Outlet } from 'react-router-dom';
import { UnifiedHeader } from '@/components/Header/UnifiedHeader';
import { Footer } from '@/components/Footer';

const MainLayout = () => (
  <div className="min-h-screen flex flex-col">
    <UnifiedHeader />
    <main className="flex-grow pt-24">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default MainLayout;
