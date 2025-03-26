import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Search, ChevronRight } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

// Sample search data - this would typically come from your content
const searchIndex = [
  { id: 'intro-1', section: 'introduction', title: 'Introdução ao Plano de Parto', content: 'O que é um plano de parto e por que ele é importante para garantir seus direitos' },
  { id: 'intro-2', section: 'introduction', title: 'Benefícios do Plano de Parto', content: 'Como o plano de parto pode melhorar sua experiência e comunicação com a equipe médica' },
  { id: 'struct-1', section: 'structure', title: 'Estrutura do Plano de Parto', content: 'Como organizar seu plano de parto em seções claras e objetivas' },
  { id: 'struct-2', section: 'structure', title: 'Tamanho Ideal do Plano', content: 'Recomendações sobre extensão e formato para facilitar a leitura pela equipe médica' },
  { id: 'rights-1', section: 'rights', title: 'Direitos da Gestante', content: 'Conheça seus direitos legais durante a gestação, parto e pós-parto' },
  { id: 'rights-2', section: 'rights', title: 'Violência Obstétrica', content: 'O que é e como identificar situações de violência obstétrica' },
  { id: 'comm-1', section: 'communication', title: 'Comunicação Eficaz', content: 'Como comunicar seus desejos de forma clara e respeitosa' },
  { id: 'comm-2', section: 'communication', title: 'Negociando Intervenções', content: 'Estratégias para discutir intervenções médicas quando necessário' },
  { id: 'check-1', section: 'checklist', title: 'Checklist Pré-Parto', content: 'Lista de itens para verificar antes de finalizar seu plano de parto' },
  { id: 'check-2', section: 'checklist', title: 'Checklist de Maternidade', content: 'O que levar para a maternidade e como se preparar' },
  { id: 'res-1', section: 'resources', title: 'Livros Recomendados', content: 'Bibliografia para aprofundar seus conhecimentos sobre parto humanizado' },
  { id: 'res-2', section: 'resources', title: 'Sites e Aplicativos', content: 'Recursos online para acompanhar sua gestação e preparação para o parto' },
  // Add more items to make search more comprehensive
  { id: 'rights-3', section: 'rights', title: 'Legislação Brasileira', content: 'Leis que protegem a gestante e garantem seus direitos durante o parto' },
  { id: 'struct-3', section: 'structure', title: 'Modelos de Plano de Parto', content: 'Exemplos e templates para criar seu próprio plano de parto' },
  { id: 'comm-3', section: 'communication', title: 'Conversando com o Obstetra', content: 'Como apresentar seu plano de parto ao médico e discutir preferências' },
];

interface GuideSearchProps {
  onClose: () => void;
  onNavigate?: (section: string) => void;
}

export function GuideSearch({ onClose, onNavigate }: GuideSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<typeof searchIndex>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();
  
  // Focus the input when the component mounts
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    
    // Add event listener for Escape key to close the search
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);
  
  // Handle search as user types
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Simple search algorithm with partial matching
    const query = searchQuery.toLowerCase().trim();
    const results = searchIndex.filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.content.toLowerCase().includes(query)
    );
    
    // Sort results by relevance
    results.sort((a, b) => {
      // Prefer title matches over content matches
      const aTitleMatch = a.title.toLowerCase().includes(query);
      const bTitleMatch = b.title.toLowerCase().includes(query);
      
      if (aTitleMatch && !bTitleMatch) return -1;
      if (!aTitleMatch && bTitleMatch) return 1;
      
      // If both match in the same way, sort by position of match
      const aTitlePos = a.title.toLowerCase().indexOf(query);
      const bTitlePos = b.title.toLowerCase().indexOf(query);
      
      if (aTitleMatch && bTitleMatch) {
        return aTitlePos - bTitlePos;
      }
      
      // Otherwise sort by content position
      const aContentPos = a.content.toLowerCase().indexOf(query);
      const bContentPos = b.content.toLowerCase().indexOf(query);
      
      return aContentPos - bContentPos;
    });
    
    setSearchResults(results);
  }, [searchQuery]);
  
  const handleResultClick = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
    onClose();
  };
  
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-start pt-20 sm:pt-32 px-4">
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[70vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search header */}
        <div className="p-4 border-b flex items-center gap-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar no guia..."
            className="border-none shadow-none focus-visible:ring-0 flex-1"
            autoComplete="off"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Search results */}
        <div className="overflow-y-auto flex-1">
          {searchQuery.trim() !== '' && searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Nenhum resultado encontrado para "{searchQuery}"</p>
              <p className="text-sm text-gray-400 mt-2">Tente termos mais gerais ou verifique a ortografia</p>
            </div>
          ) : (
            <ul className="divide-y">
              {searchResults.map((result) => (
                <li key={result.id}>
                  <button
                    className="w-full text-left p-4 hover:bg-gray-50 flex justify-between items-center"
                    onClick={() => handleResultClick(result.section)}
                  >
                    <div>
                      <h3 className="font-medium text-maternal-800">{result.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{result.content}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 ml-2" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        {/* Search footer */}
        <div className="border-t p-3 text-center text-xs text-gray-500">
          Pressione ESC para fechar a busca
        </div>
      </div>
    </div>
  );
}
