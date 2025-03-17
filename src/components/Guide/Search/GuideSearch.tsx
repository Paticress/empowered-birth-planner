
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

type SearchResult = {
  title: string;
  content: string;
  section: string;
  tab: string;
};

type GuideSearchProps = {
  onNavigate?: (tab: string) => void;
};

// Hard-coded search index - ideally this would be loaded from a proper search index
const SEARCH_INDEX: SearchResult[] = [
  {
    title: "O que é um plano de parto",
    content: "Um plano de parto é um documento que expressa seus desejos e preferências para o trabalho de parto e nascimento do bebê.",
    section: "Introdução",
    tab: "introduction"
  },
  {
    title: "Como estruturar seu plano de parto",
    content: "Seu plano de parto deve ser claro, conciso e organizado em seções lógicas.",
    section: "Estrutura",
    tab: "structure"
  },
  {
    title: "Seus direitos no parto",
    content: "Você tem direito a um acompanhante de sua escolha durante todo o trabalho de parto, parto e pós-parto.",
    section: "Direitos",
    tab: "rights"
  },
  {
    title: "Comunicação com a equipe médica",
    content: "Estabeleça uma comunicação clara e respeitosa com sua equipe médica para garantir que suas preferências sejam respeitadas.",
    section: "Comunicação",
    tab: "communication"
  },
  {
    title: "Checklist do plano de parto",
    content: "Utilize nosso checklist para garantir que você considerou todos os aspectos importantes do seu plano de parto.",
    section: "Checklist",
    tab: "checklist"
  },
  {
    title: "Recursos adicionais",
    content: "Confira nossos recursos adicionais para aprofundar seu conhecimento sobre plano de parto e parto humanizado.",
    section: "Recursos",
    tab: "resources"
  },
];

export function GuideSearch({ onNavigate }: GuideSearchProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // Memoized search results to avoid unnecessary re-renders
  const filteredResults = useMemo(() => {
    if (search.length < 2) {
      return [];
    }
    
    const searchTerms = search.toLowerCase().split(' ').filter(term => term.length > 0);
    
    return SEARCH_INDEX.filter(item => {
      const titleMatches = searchTerms.some(term => 
        item.title.toLowerCase().includes(term)
      );
      
      const contentMatches = searchTerms.some(term => 
        item.content.toLowerCase().includes(term)
      );
      
      return titleMatches || contentMatches;
    });
  }, [search]);
  
  // Update the results state when the filtered results change
  useEffect(() => {
    setResults(filteredResults);
  }, [filteredResults]);
  
  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Memoized select handler to prevent unnecessary re-renders
  const handleSelect = useCallback((result: SearchResult) => {
    if (onNavigate) {
      onNavigate(result.tab);
    }
    setOpen(false);
    setSearch('');
  }, [onNavigate]);

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="text-white border-white hover:bg-brand-tan bg-brand-gold/30 gap-2"
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Pesquisar</span>
        <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-brand-gold/20 px-1.5 font-mono text-xs text-white">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[550px] p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>Pesquisar no Guia</DialogTitle>
          </DialogHeader>
          <Command className="rounded-t-none">
            <CommandInput 
              placeholder="Digite para pesquisar..." 
              value={search}
              onValueChange={setSearch}
              autoFocus
            />
            <CommandList>
              <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
              {results.length > 0 && (
                <CommandGroup heading="Resultados">
                  {results.map((result, index) => (
                    <CommandItem
                      key={index}
                      value={result.title}
                      onSelect={() => handleSelect(result)}
                      className="flex flex-col items-start"
                    >
                      <div className="font-medium">{result.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {result.content.length > 100 
                          ? `${result.content.substring(0, 100)}...` 
                          : result.content}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Seção: {result.section}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
