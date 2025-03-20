
export function PrintFooter() {
  return (
    <div className="hidden print:block mt-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Criado em {new Date().toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-600">
          Energia Materna - www.energiamaterna.com.br
        </p>
        <div className="text-sm print:absolute print:bottom-4 print:right-4">
          <span className="print-page-number"></span>
        </div>
      </div>
    </div>
  );
}
