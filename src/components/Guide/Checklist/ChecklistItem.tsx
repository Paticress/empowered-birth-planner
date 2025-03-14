
interface ChecklistItemProps {
  label: string;
}

export function ChecklistItem({ label }: ChecklistItemProps) {
  return (
    <li className="flex items-start">
      <input 
        type="checkbox" 
        className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600"
      />
      <span className="ml-3">{label}</span>
    </li>
  );
}
