
import { Check, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface TimelineStep {
  id: string;
  name: string;
  isCompleted: boolean;
  onClick: () => void;
}

interface TimelineProgressProps {
  title: string;
  steps: TimelineStep[];
  icon: ReactNode;
  isDisabled?: boolean;
  disabledMessage?: string;
}

export function TimelineProgress({ 
  title, 
  steps, 
  icon, 
  isDisabled = false,
  disabledMessage
}: TimelineProgressProps) {
  return (
    <Card className="p-6 bg-white border border-maternal-100 relative">
      {isDisabled && (
        <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-[1px] flex flex-col items-center justify-center rounded-lg z-10">
          <Lock className="h-10 w-10 text-maternal-400 mb-3" />
          <p className="text-maternal-700 font-medium text-center px-6">
            {disabledMessage || "Esta funcionalidade não está disponível para seu plano atual"}
          </p>
          <Button 
            variant="birth-plan-builder" 
            className="mt-4"
            onClick={() => window.open("https://www.energiamaterna.com.br/criar-meu-plano-de-parto-em-minutos", "_blank")}
          >
            Adquirir Acesso
          </Button>
        </div>
      )}
      
      <h2 className="text-xl font-semibold text-maternal-900 mb-4 flex items-center">
        {icon} {title}
      </h2>
      
      <ol className="relative border-l border-maternal-200 ml-3 space-y-4">
        {steps.map((step, index) => (
          <li key={step.id} className="ml-6">
            <span className={`absolute flex items-center justify-center w-6 h-6 rounded-full -left-3 ${
              step.isCompleted 
                ? 'bg-green-100' 
                : 'bg-maternal-100'
            }`}>
              {step.isCompleted ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-maternal-400"></div>
              )}
            </span>
            <div 
              className={`cursor-pointer hover:bg-maternal-50 p-2 rounded transition-colors ${
                !isDisabled ? 'cursor-pointer' : 'cursor-default'
              }`}
              onClick={!isDisabled ? step.onClick : undefined}
            >
              <h3 className={`text-lg font-semibold mb-1 ${
                step.isCompleted ? 'text-maternal-900' : 'text-maternal-600'
              }`}>
                {step.name}
              </h3>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
