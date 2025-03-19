
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface DueDateFieldProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
}

export const DueDateField = ({ value, onChange }: DueDateFieldProps) => {
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
              date < new Date() // Don't allow past dates
            }
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
