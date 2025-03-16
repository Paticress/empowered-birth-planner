
import { ReactNode } from 'react';

interface ChecklistSectionProps {
  title: string;
  children: ReactNode;
}

export function ChecklistSection({ title, children }: ChecklistSectionProps) {
  return (
    <div className="bg-brand-pink bg-opacity-30 border border-maternal-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-medium text-brand-charcoal mb-4">{title}</h3>
      <ul className="space-y-3">
        {children}
      </ul>
    </div>
  );
}
