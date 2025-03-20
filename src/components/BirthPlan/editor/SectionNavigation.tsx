
import { Button } from '@/components/ui/button';

interface SectionNavigationProps {
  birthPlanSections: Array<{
    id: string;
    title: string;
    color?: string;
    fields: Array<{ key: string; label: string }>;
  }>;
  activeSectionIndex: number;
  setActiveSectionIndex: (index: number) => void;
}

export function SectionNavigation({
  birthPlanSections,
  activeSectionIndex,
  setActiveSectionIndex
}: SectionNavigationProps) {
  return (
    <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
      {birthPlanSections.map((section, index) => (
        <Button
          key={section.id}
          variant={activeSectionIndex === index ? "default" : "outline"}
          className={activeSectionIndex === index 
            ? `bg-maternal-${section.color || '400'}` 
            : `hover:bg-maternal-${section.color || '100'} hover:text-maternal-800`}
          onClick={() => setActiveSectionIndex(index)}
        >
          {section.title}
        </Button>
      ))}
    </div>
  );
}
