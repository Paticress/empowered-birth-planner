
import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface ChecklistSectionProps {
  title: string;
  children: ReactNode;
}

export function ChecklistSection({ title, children }: ChecklistSectionProps) {
  return (
    <Card className="bg-white border border-brand-pink rounded-lg p-4 shadow-sm">
      <h3 className="text-xl font-medium text-brand-black mb-4">{title}</h3>
      <ul className="space-y-3">
        {children}
      </ul>
    </Card>
  );
}
