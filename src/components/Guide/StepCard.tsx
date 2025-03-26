
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepCardProps {
  stepNumber: number;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
}

export function StepCard({ stepNumber, title, description, icon: Icon, className }: StepCardProps) {
  return (
    <div className={cn(
      "flex items-start p-5 bg-white border border-maternal-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="flex-shrink-0 mr-4">
        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-pink-800 to-pink-900 text-white font-bold text-xl">
          {stepNumber}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <Icon className="mr-2 h-5 w-5 text-pink-800" />
          <h3 className="text-lg font-semibold text-maternal-800">{title}</h3>
        </div>
        <p className="text-maternal-700">{description}</p>
      </div>
    </div>
  );
}
