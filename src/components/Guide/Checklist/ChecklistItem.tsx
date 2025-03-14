
import { useState, useEffect } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, X } from 'lucide-react';

interface ChecklistItemProps {
  label: string;
  id: string;
}

export function ChecklistItem({ label, id }: ChecklistItemProps) {
  const [checked, setChecked] = useState<boolean>(false);
  const [showNotes, setShowNotes] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');
  
  // Load saved state on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem('checklist-items');
    if (savedItems) {
      const parsedItems = JSON.parse(savedItems);
      if (parsedItems[id] !== undefined) {
        if (typeof parsedItems[id] === 'object') {
          setChecked(parsedItems[id].checked || false);
          setNotes(parsedItems[id].notes || '');
        } else {
          // Handle legacy format (boolean only)
          setChecked(parsedItems[id]);
        }
      }
    }
  }, [id]);
  
  // Save state when checkbox changes
  const handleCheckedChange = (value: boolean) => {
    setChecked(value);
    saveToLocalStorage(value, notes);
  };
  
  // Save notes
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    saveToLocalStorage(checked, newNotes);
  };
  
  // Save to localStorage with both checked state and notes
  const saveToLocalStorage = (isChecked: boolean, noteText: string) => {
    const savedItems = localStorage.getItem('checklist-items');
    const parsedItems = savedItems ? JSON.parse(savedItems) : {};
    parsedItems[id] = {
      checked: isChecked,
      notes: noteText
    };
    localStorage.setItem('checklist-items', JSON.stringify(parsedItems));
  };

  return (
    <li className="flex flex-col space-y-2 print:break-inside-avoid">
      <div className="flex items-start gap-2">
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
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="ml-auto h-8 w-8 p-0 text-muted-foreground print:hidden"
          onClick={() => setShowNotes(!showNotes)}
          title={showNotes ? "Esconder notas" : "Adicionar notas"}
        >
          {showNotes ? <X className="h-4 w-4" /> : <MessageSquare className="h-4 w-4" />}
        </Button>
      </div>
      
      {showNotes && (
        <div className="pl-7 print:block">
          <Textarea
            placeholder="Adicione suas anotações aqui..."
            className="min-h-[80px] w-full text-sm"
            value={notes}
            onChange={handleNotesChange}
          />
        </div>
      )}
      
      {notes && !showNotes && notes.trim() !== '' && (
        <div className="pl-7 text-sm text-muted-foreground italic border-l-2 border-maternal-200 print:block">
          <p>Nota: {notes}</p>
        </div>
      )}
    </li>
  );
}
