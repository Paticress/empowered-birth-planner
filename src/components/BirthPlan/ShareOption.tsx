
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ShareOptionProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
}

export function ShareOption({ icon: Icon, title, description, onClick }: ShareOptionProps) {
  return (
    <button
      className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-maternal-50 transition-colors"
      onClick={onClick}
    >
      <Icon className="h-12 w-12 text-maternal-600 mb-4" />
      <span className="font-medium text-maternal-900">{title}</span>
      <span className="text-sm text-gray-500 mt-1">{description}</span>
    </button>
  );
}
