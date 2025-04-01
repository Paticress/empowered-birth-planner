
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react';

type MobileNavigationProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabNames: Record<string, string>;
};

export function MobileNavigation({ activeTab, onTabChange, tabNames }: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  
  const handleTabSelect = (tab: string) => {
    onTabChange(tab);
    setOpen(false);
  };
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="md:hidden flex items-center gap-2"
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
          <span>Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80%] sm:w-[350px]">
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Seções do Guia</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setOpen(false)}
              className="p-0 h-8 w-8"
              aria-label="Fechar menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-1">
            {Object.entries(tabNames).map(([id, label]) => (
              <Button
                key={id}
                variant={activeTab === id ? "default" : "ghost"}
                className={`w-full justify-start ${activeTab === id ? 'bg-brand-gold text-white' : ''}`}
                onClick={() => handleTabSelect(id)}
              >
                {label}
              </Button>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
}
