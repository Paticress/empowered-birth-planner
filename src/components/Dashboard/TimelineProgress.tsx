
import { CheckCircle2, Circle, ArrowRight, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TimelineStep {
  id: string;
  name: string;
  description?: string;
  isCompleted: boolean;
  onClick?: () => void;
}

interface TimelineProgressProps {
  title: string;
  steps: TimelineStep[];
  icon?: React.ReactNode;
  className?: string;
}

export function TimelineProgress({ 
  title, 
  steps, 
  icon = <Clock className="h-5 w-5 mr-2 text-maternal-600" />,
  className 
}: TimelineProgressProps) {
  return (
    <Card className={cn("p-6 bg-white border border-maternal-100", className)}>
      <h2 className="text-xl font-semibold text-maternal-900 mb-4 flex items-center">
        {icon} {title}
      </h2>
      
      <div className="relative">
        {steps.map((step, index) => (
          <div 
            key={step.id} 
            className={cn(
              "flex mb-6 last:mb-0",
              step.onClick && step.isCompleted ? "cursor-pointer" : ""
            )}
            onClick={step.isCompleted && step.onClick ? step.onClick : undefined}
          >
            <div className="relative">
              {/* Status icon */}
              <div className={cn(
                "z-10 relative flex items-center justify-center w-8 h-8 rounded-full",
                step.isCompleted ? "bg-green-100" : "bg-gray-100"
              )}>
                {step.isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-gray-300" />
                )}
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={cn(
                  "absolute top-8 left-4 w-0.5 h-full -mt-2",
                  step.isCompleted ? "bg-green-500" : "bg-gray-200"
                )} />
              )}
            </div>
            
            <div className="ml-4 flex-1">
              <div className="flex items-center">
                <h3 className={cn(
                  "font-medium",
                  step.isCompleted ? "text-maternal-900" : "text-maternal-600"
                )}>
                  {step.name}
                </h3>
                {step.isCompleted && step.onClick && (
                  <ArrowRight className="ml-2 h-4 w-4 text-maternal-600" />
                )}
              </div>
              
              {step.description && (
                <p className="text-sm text-maternal-500 mt-1">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
