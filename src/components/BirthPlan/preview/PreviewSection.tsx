
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
    <div className="mb-8 print:mb-4 print:break-inside-avoid">
      <div className="flex items-center gap-2 mb-4 print:mb-2">
        {SectionIcon && <SectionIcon className="h-5 w-5 text-maternal-700 print:text-black" />}
        <h2 className="text-2xl font-semibold text-maternal-800 print:text-xl">{title}</h2>
      </div>
      
      <div className="space-y-4 print:space-y-2">
        {fields.map((field) => {
          const value = sectionData[field.key];
          
          // Skip empty fields
          if (!value || (Array.isArray(value) && value.length === 0)) {
            return null;
          }
          
          return (
            <div key={field.key}>
              <h3 className="font-semibold text-maternal-700 mb-1 print:text-sm">{field.label}</h3>
              <div className="bg-maternal-50 p-4 rounded-lg print:p-2 print:bg-white print:border print:border-gray-300">
                {Array.isArray(value) ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {value.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{value}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
