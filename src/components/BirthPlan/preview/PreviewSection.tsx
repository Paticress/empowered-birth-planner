
import { getSectionIcon } from '../utils/sectionIcons';
import { useIsMobile } from '@/hooks/use-mobile';

export interface PreviewSectionProps {
  sectionId: string;
  title: string;
  sectionData?: Record<string, any>;
  fields?: { key: string; label: string }[];
}

export function PreviewSection({ sectionId, title, sectionData = {}, fields = [] }: PreviewSectionProps) {
  const SectionIcon = getSectionIcon(sectionId);
  const isMobile = useIsMobile();
  
  return (
    <div className="mb-6 md:mb-8 print:mb-3 print:break-inside-avoid">
      <div className="flex items-center gap-2 mb-3 md:mb-4 print:mb-2">
        {SectionIcon && (
          <span className="inline-block print:inline-block">
            <SectionIcon 
              className="h-4 w-4 md:h-5 md:w-5 text-maternal-700 print:text-black" 
              aria-hidden="true"
              style={{ printColorAdjust: 'exact' }}
            />
          </span>
        )}
        <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-semibold text-maternal-800 print:text-lg print:font-bold`}>
          {title}
        </h2>
      </div>
      
      <div className="space-y-3 md:space-y-4 print:space-y-1.5">
        {fields.map((field) => {
          const value = sectionData[field.key];
          
          // Skip empty fields
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return null;
          }
          
          return (
            <div key={field.key} className="print:mb-2">
              <h3 className="font-semibold text-maternal-700 mb-1 text-sm md:text-base print:text-sm">{field.label}</h3>
              <div className="bg-maternal-50 p-3 md:p-4 rounded-lg print:p-0 print:bg-transparent print:border-0">
                {Array.isArray(value) ? (
                  <ul className="list-disc pl-5 space-y-1 text-sm md:text-base print:text-sm">
                    {value.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm md:text-base print:text-sm">{value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
