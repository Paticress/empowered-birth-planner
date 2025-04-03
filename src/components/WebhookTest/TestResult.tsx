
import { CheckCircle, AlertTriangle } from 'lucide-react';

export interface TestResultType {
  id: string;
  success: boolean;
  message: string;
  details?: any;
  timestamp: string;
}

interface TestResultProps {
  result: TestResultType;
}

export function TestResult({ result }: TestResultProps) {
  return (
    <div 
      className={`border p-3 rounded-md ${
        result.success 
          ? 'bg-green-50 border-green-200' 
          : 'bg-red-50 border-red-200'
      }`}
    >
      <div className="flex items-start">
        {result.success ? (
          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
        ) : (
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium ${
            result.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {result.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(result.timestamp).toLocaleTimeString()}
          </p>
          
          {result.details && (
            <details className="mt-2">
              <summary className="text-xs cursor-pointer">
                View Details
              </summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                {JSON.stringify(result.details, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
