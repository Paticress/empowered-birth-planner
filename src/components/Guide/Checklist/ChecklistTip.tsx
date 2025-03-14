
interface ChecklistTipProps {
  children: React.ReactNode;
}

export function ChecklistTip({ children }: ChecklistTipProps) {
  return (
    <div className="bg-maternal-100 p-4 rounded-lg border-l-4 border-maternal-600 mb-6">
      <p className="font-medium text-maternal-900">
        {children}
      </p>
    </div>
  );
}
