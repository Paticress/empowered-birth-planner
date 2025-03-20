
interface SignatureSectionProps {
  personalInfo: Record<string, any>;
}

export function SignatureSection({ personalInfo }: SignatureSectionProps) {
  const name = personalInfo.name || '';
  
  return (
    <div className="hidden print:block mt-12 print:break-inside-avoid">
      <h2 className="text-xl font-semibold mb-8 border-b pb-2">Assinaturas</h2>
      
      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="border-b border-black h-12 mb-2"></div>
          <p className="text-center">{name}</p>
          <p className="text-center text-sm text-gray-600">Gestante</p>
        </div>
        
        <div>
          <div className="border-b border-black h-12 mb-2"></div>
          <p className="text-center">{personalInfo.healthProvider || '_________________'}</p>
          <p className="text-center text-sm text-gray-600">Médico/Obstetra</p>
          <p className="text-center text-sm text-gray-600">CRM: {personalInfo.healthProviderRegistry || '_________________'}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div>
          <div className="border-b border-black h-12 mb-2"></div>
          <p className="text-center">{personalInfo.pediatrician || '_________________'}</p>
          <p className="text-center text-sm text-gray-600">Pediatra Neonatal</p>
          <p className="text-center text-sm text-gray-600">CRM: {personalInfo.pediatricianRegistry || '_________________'}</p>
        </div>
        
        <div>
          <div className="border-b border-black h-12 mb-2"></div>
          <p className="text-center">{personalInfo.doula || '_________________'}</p>
          <p className="text-center text-sm text-gray-600">Doula</p>
          <p className="text-center text-sm text-gray-600">Registro: {personalInfo.doulaRegistry || '_________________'}</p>
        </div>
      </div>
    </div>
  );
}
