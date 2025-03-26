
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Book } from "lucide-react";

interface OnlineGuideTermsProps {
  trigger?: React.ReactNode;
  variant?: "link" | "button";
  className?: string;
}

export const OnlineGuideTerms = ({ 
  trigger, 
  variant = "link",
  className = ""
}: OnlineGuideTermsProps) => {
  const [terms, setTerms] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await fetch("/src/docs/online-guide-terms.md");
        const text = await response.text();
        setTerms(text);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load terms:", error);
        setTerms("Não foi possível carregar os termos. Por favor, tente novamente mais tarde.");
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const defaultTrigger = variant === "button" ? (
    <Button size="sm" variant="outline" className={className}>
      <Book className="mr-2 h-4 w-4" />
      Termos de Uso
    </Button>
  ) : (
    <button className={`text-maternal-600 hover:text-maternal-800 underline text-sm ${className}`}>
      Termos de Uso
    </button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Termos e Condições de Uso - Guia Online</DialogTitle>
          <DialogDescription>
            Por favor, leia atentamente os termos e condições de uso do Guia Online do Parto Respeitoso.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-maternal-600 rounded-full border-t-transparent"></div>
            </div>
          ) : (
            <div className="terms-content whitespace-pre-line prose prose-maternal">
              {terms.split('\n').map((line, index) => {
                if (line.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold mt-6 mb-4 text-maternal-900">{line.replace('# ', '')}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-bold mt-5 mb-3 text-maternal-800">{line.replace('## ', '')}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} className="text-lg font-bold mt-4 mb-2 text-maternal-700">{line.replace('### ', '')}</h3>;
                } else if (line.startsWith('- ')) {
                  return <li key={index} className="ml-6 my-1">{line.replace('- ', '')}</li>;
                } else if (line.trim() === '') {
                  return <br key={index} />;
                } else if (line.startsWith('**')) {
                  return <p key={index} className="font-bold mt-4">{line.replace(/\*\*/g, '')}</p>;
                } else {
                  return <p key={index} className="my-2">{line}</p>;
                }
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
