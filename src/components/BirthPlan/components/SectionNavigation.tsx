
import { Button } from '@/components/ui/button';

interface SectionNavigationProps {
  sections: Array<{
    id: string;
    title: string;
    color?: string;
  }>;
  activeSectionIndex: number;
  onSectionChange: (index: number) => void;
}

export function SectionNavigation({ 
  sections, 
  activeSectionIndex, 
  onSectionChange 
}: SectionNavigationProps) {
  return (
    <div className="flex overflow-x-auto pb-2 mb-6 gap-2">
      {sections.map((section, index) => (
        <Button
          key={section.id}
          variant={activeSectionIndex === index ? "default" : "outline"}
          className={activeSectionIndex === index 
            ? `bg-maternal-${section.color || '400'}` 
            : `hover:bg-maternal-${section.color || '100'} hover:text-maternal-800`}
          onClick={() => onSectionChange(index)}
        >
          {section.title}
        </Button>
      ))}
    </div>
  );
}
