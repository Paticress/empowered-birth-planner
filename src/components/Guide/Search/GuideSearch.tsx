
import { useState, useEffect } from 'react';
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
  onClose?: () => void;
};

export function GuideSearch({ onNavigate, onClose }: GuideSearchProps) {
  const [open, setOpen] = useState(true); // Changed to true to ensure dialog opens properly
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchIndex, setSearchIndex] = useState<SearchResult[]>([]);
  
  // Build a more complete search index
  useEffect(() => {
    // More comprehensive search index with additional terms
    const index: SearchResult[] = [
      {
        title: "O que é um plano de parto",
        content: "Um plano de parto é um documento que expressa seus desejos e preferências para o trabalho de parto e nascimento do bebê.",
        section: "Introdução",
        tab: "introduction"
      },
      {
        title: "Objetivos do plano de parto",
        content: "O plano de parto ajuda a comunicar suas preferências à equipe médica e garantir uma experiência de parto mais respeitosa.",
        section: "Introdução",
        tab: "introduction"
      },
      {
        title: "Como estruturar seu plano de parto",
        content: "Seu plano de parto deve ser claro, conciso e organizado em seções lógicas como informações pessoais, preferências durante o trabalho de parto, e pós-parto.",
        section: "Estrutura",
        tab: "structure"
      },
      {
        title: "Seções essenciais do plano de parto",
        content: "As seções essenciais incluem informações pessoais, preferências para o trabalho de parto, parto, pós-parto e procedimentos com o bebê.",
        section: "Estrutura",
        tab: "structure"
      },
      {
        title: "Seus direitos no parto",
        content: "Você tem direito a um acompanhante de sua escolha durante todo o trabalho de parto, parto e pós-parto. Também tem direito à informação clara sobre procedimentos médicos.",
        section: "Direitos",
        tab: "rights"
      },
      {
        title: "Violência obstétrica",
        content: "A violência obstétrica inclui procedimentos sem consentimento, tratamento desrespeitoso e negação de direitos durante o parto.",
        section: "Direitos",
        tab: "rights"
      },
      {
        title: "Comunicação com a equipe médica",
        content: "Estabeleça uma comunicação clara e respeitosa com sua equipe médica. Faça perguntas e solicite explicações sobre procedimentos.",
        section: "Comunicação",
        tab: "communication"
      },
      {
        title: "Como abordar divergências",
        content: "Aprenda a lidar com diferenças de opinião entre você e a equipe médica de forma respeitosa e eficaz.",
        section: "Comunicação",
        tab: "communication"
      },
      {
        title: "Checklist do plano de parto",
        content: "Utilize nosso checklist para garantir que você considerou todos os aspectos importantes do seu plano de parto, desde o trabalho de parto até o pós-parto.",
        section: "Checklist",
        tab: "checklist"
      },
      {
        title: "Recursos adicionais",
        content: "Confira nossos recursos adicionais, como livros, sites e profissionais recomendados para aprofundar seu conhecimento sobre parto humanizado.",
        section: "Recursos",
        tab: "resources"
      },
      {
        title: "Posições para o parto",
        content: "Existem diversas posições que podem facilitar o trabalho de parto e o nascimento, como de cócoras, de lado, de quatro, em pé, entre outras.",
        section: "Estrutura",
        tab: "structure"
      },
      {
        title: "Alívio da dor",
        content: "Existem métodos não-farmacológicos para alívio da dor como banhos quentes, massagens, bola de pilates, e também opções farmacológicas como analgesia.",
        section: "Estrutura",
        tab: "structure"
      },
      {
        title: "Cesárea",
        content: "A cesárea pode ser necessária em algumas situações. É importante conhecer as indicações reais e como planejar uma cesárea respeitosa caso seja necessária.",
        section: "Estrutura",
        tab: "structure"
      },
      {
        title: "Contato pele a pele",
        content: "O contato pele a pele imediato entre mãe e bebê traz diversos benefícios como regulação térmica, início da amamentação e vínculo.",
        section: "Estrutura",
        tab: "structure"
      },
      {
        title: "Clampeamento tardio do cordão",
        content: "O clampeamento tardio do cordão umbilical permite que o bebê receba mais sangue e nutrientes da placenta.",
        section: "Estrutura",
        tab: "structure"
      }
    ];
    
    setSearchIndex(index);
  }, []);
  
  // Improved search functionality with partial matching
  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      return;
    }
    
    const searchTerms = search.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const filtered = searchIndex.filter(item => {
      // Check for matches in title
      const titleMatches = searchTerms.some(term => 
        item.title.toLowerCase().includes(term)
      );
      
      // Check for matches in content
      const contentMatches = searchTerms.some(term => 
        item.content.toLowerCase().includes(term)
      );
      
      // Check for matches in section
      const sectionMatches = searchTerms.some(term => 
        item.section.toLowerCase().includes(term)
      );
      
      return titleMatches || contentMatches || sectionMatches;
    });
    
    // Sort results by relevance (title matches first)
    const sortedResults = filtered.sort((a, b) => {
      const aHasTitleMatch = searchTerms.some(term => a.title.toLowerCase().includes(term));
      const bHasTitleMatch = searchTerms.some(term => b.title.toLowerCase().includes(term));
      
      if (aHasTitleMatch && !bHasTitleMatch) return -1;
      if (!aHasTitleMatch && bHasTitleMatch) return 1;
      return 0;
    });
    
    setResults(sortedResults);
  }, [search, searchIndex]);
  
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
  
  const handleSelect = (result: SearchResult) => {
    console.log('Search result selected:', result);
    if (onNavigate) {
      onNavigate(result.tab);
    }
    setOpen(false);
    setSearch('');
    if (onClose) onClose();
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            <CommandEmpty>Nenhum resultado encontrado para "{search}".</CommandEmpty>
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
  );
}
