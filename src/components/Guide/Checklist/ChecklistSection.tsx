
import { ReactNode } from 'react';

interface ChecklistSectionProps {
  title: string;
  children: ReactNode;
}

export function ChecklistSection({ title, children }: ChecklistSectionProps) {
  return (
    <div className="bg-white border border-brand-pink rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-medium text-brand-black mb-4">{title}</h3>
      <ul className="space-y-3">
        {children}
      </ul>
    </div>
  );
}
