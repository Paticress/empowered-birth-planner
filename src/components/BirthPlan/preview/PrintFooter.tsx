
export function PrintFooter() {
  return (
    <div className="hidden print:block mt-6">
      <div className="flex justify-between items-center border-t pt-3">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/6f452e84-0922-495e-bad9-57a66fa763f6.png" 
            alt="Energia Materna" 
            className="h-8"
          />
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} Energia Materna - www.energiamaterna.com.br
          </p>
        </div>
        <div className="text-xs print:absolute print:bottom-4 print:right-4">
          <span className="print-page-number"></span>
        </div>
      </div>
    </div>
  );
}
