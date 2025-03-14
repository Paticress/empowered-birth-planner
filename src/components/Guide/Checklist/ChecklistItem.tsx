
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';

interface ChecklistItemProps {
  label: string;
  id: string;
}

export function ChecklistItem({ label, id }: ChecklistItemProps) {
  const [checked, setChecked] = useState<boolean>(false);
  
  // Load saved state on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('checklist-items');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      if (parsedItems[id] !== undefined) {
        setChecked(parsedItems[id]);
      }
    }
  }, [id]);
  
  // Save state when checkbox changes
  const handleCheckedChange = (value: boolean) => {
    setChecked(value);
    
    // Save to localStorage
    const savedItems = localStorage.getItem('checklist-items');
    const parsedItems = savedItems ? JSON.parse(savedItems) : {};
    parsedItems[id] = value;
    localStorage.setItem('checklist-items', JSON.stringify(parsedItems));
  };

  return (
    <li className="flex items-start gap-2 print:break-inside-avoid">
      <Checkbox 
        id={id}
        checked={checked}
        onCheckedChange={handleCheckedChange}
        className="mt-1 h-5 w-5 rounded border-maternal-300 text-maternal-600 focus:ring-maternal-600 print:border-black"
      />
      <label 
        htmlFor={id} 
        className="ml-2 text-base select-none cursor-pointer"
      >
        {label}
      </label>
    </li>
  );
}
