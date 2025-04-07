
import { AlertCircle } from 'lucide-react';

interface DebugInfoPanelProps {
  debugInfo: any;
}

export function DebugInfoPanel({ debugInfo }: DebugInfoPanelProps) {
  return (
    <div className="mt-8 text-left">
      <details className="bg-gray-100 p-3 rounded-md">
        <summary className="cursor-pointer text-sm font-semibold flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Informações de depuração para suporte
        </summary>
        <div className="mt-2 text-xs overflow-x-auto">
          <pre className="bg-gray-200 p-2 rounded">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      </details>
    </div>
  );
}
