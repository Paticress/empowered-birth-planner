
import React from 'react';

export interface TestResultItemType {
  id: string;
  test: string;
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

interface ResultItemProps {
  result: TestResultItemType;
}

export function ResultItem({ result }: ResultItemProps) {
  return (
    <div 
      className={`p-4 rounded-md ${
        result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium flex items-center">
            {result.success ? (
              <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            {result.test}
          </h3>
          <p className={result.success ? 'text-green-800' : 'text-red-800'}>
            {result.message}
          </p>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(result.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      {result.data && (
        <details className="mt-2">
          <summary className="text-sm cursor-pointer hover:text-blue-600">
            Response Details
          </summary>
          <pre className="mt-2 p-2 bg-gray-100 rounded overflow-x-auto text-xs">
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
