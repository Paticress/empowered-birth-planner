
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface ResourceCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  isActive: boolean;
  buttonText: string;
  buttonIcon: ReactNode;
  buttonVariant?: 'resource' | 'resource-highlight';
  onClick: () => void;
  onButtonClick: (e: React.MouseEvent) => void;
}

export function ResourceCard({
  title,
  description,
  icon,
  isActive,
  buttonText,
  buttonIcon,
  buttonVariant = 'resource',
  onClick,
  onButtonClick
}: ResourceCardProps) {
  return (
    <div 
      className={`resource-card p-6 rounded-lg border border-maternal-200 cursor-pointer transition-all duration-300 ${isActive ? 'bg-maternal-50 shadow-md' : 'bg-white hover:shadow-sm'}`}
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className="bg-maternal-100 p-3 rounded-full mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-medium text-maternal-800">{title}</h3>
      </div>
      
      <p className="text-maternal-700 mb-3">
        {description}
      </p>
      
      <div className="mt-4">
        <Button 
          variant={buttonVariant}
          className="w-full"
          onClick={(e) => {
            e.stopPropagation();
            onButtonClick(e);
          }}
        >
          {buttonIcon} {buttonText}
        </Button>
      </div>
    </div>
  );
}
