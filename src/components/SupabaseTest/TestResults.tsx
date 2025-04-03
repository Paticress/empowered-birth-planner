
import React from 'react';
import { ResultItem, TestResultItemType } from './ResultItem';

interface TestResultsProps {
  results: TestResultItemType[];
}

export function TestResults({ results }: TestResultsProps) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Test Results</h2>
      
      {results.length === 0 ? (
        <p className="text-gray-500 italic">No tests run yet</p>
      ) : (
        <div className="space-y-4">
          {results.map((result) => (
            <ResultItem key={result.id} result={result} />
          ))}
        </div>
      )}
    </div>
  );
}
