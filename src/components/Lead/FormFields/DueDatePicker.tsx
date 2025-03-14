
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DueDatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export function DueDatePicker({ value, onChange }: DueDatePickerProps) {
  return (
    <div className="space-y-2">
      <Label>Data Prevista para o Parto (DPP)</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal rounded-xl border-maternal-200",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(value, "dd/MM/yyyy") : <span>Selecione a data</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
            disabled={(date) => 
              date < new Date() // Não permitir datas no passado
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
