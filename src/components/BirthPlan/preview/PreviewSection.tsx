
import { getSectionIcon } from '../utils/sectionIcons';

interface PreviewSectionProps {
  sectionId: string;
  title: string;
  fields: { key: string; label: string }[];
  sectionData: Record<string, any>;
}

export function PreviewSection({ sectionId, title, fields, sectionData }: PreviewSectionProps) {
  const SectionIcon = getSectionIcon(sectionId);
  
  return (
    <div className="mb-8 print:mb-3 print:break-inside-avoid">
      <div className="flex items-center gap-2 mb-4 print:mb-2">
        {SectionIcon && (
          <span className="inline-block print:inline-block">
            <SectionIcon 
              className="h-5 w-5 text-maternal-700 print:text-black" 
              aria-hidden="true"
              style={{ printColorAdjust: 'exact' }}
            />
          </span>
        )}
        <h2 className="text-2xl font-semibold text-maternal-800 print:text-lg print:font-bold">{title}</h2>
      </div>
      
      <div className="space-y-4 print:space-y-1.5">
        {fields.map((field) => {
          const value = sectionData[field.key];
          
          // Skip empty fields
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return null;
          }
          
          return (
            <div key={field.key} className="print:mb-2">
              <h3 className="font-semibold text-maternal-700 mb-1 print:text-sm">{field.label}</h3>
              <div className="bg-maternal-50 p-4 rounded-lg print:p-0 print:bg-transparent print:border-0">
                {Array.isArray(value) ? (
                  <ul className="list-disc pl-5 space-y-1 print:text-sm">
                    {value.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="print:text-sm">{value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
