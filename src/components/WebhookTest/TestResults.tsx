
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TestResult, TestResultType } from './TestResult';

interface TestResultsProps {
  results: TestResultType[];
}

export function TestResults({ results }: TestResultsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results</CardTitle>
        <CardDescription>
          Results of your webhook and database tests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
          {results.length === 0 ? (
            <p className="text-muted-foreground text-sm italic">No tests run yet</p>
          ) : (
            results.map(result => (
              <TestResult key={result.id} result={result} />
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
