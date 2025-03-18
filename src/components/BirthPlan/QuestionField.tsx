
import { 
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Question } from './types/questionnaire';
import { Control } from 'react-hook-form';
import { Info } from 'lucide-react';

interface QuestionFieldProps {
  question: Question;
  errors: any;
  control: Control<Record<string, any>, any>;
}

export function QuestionField({ question, errors, control }: QuestionFieldProps) {
  return (
    <FormItem key={question.id} className="space-y-2">
      <div className="flex items-start gap-2">
        <FormLabel className="block font-medium text-maternal-900">
          {question.text} {question.isRequired && <span className="text-red-500">*</span>}
        </FormLabel>
        
        {question.description && (
          <div className="relative group">
            <Info size={16} className="text-maternal-500 cursor-help mt-1" />
            <div className="absolute left-0 w-64 p-2 mt-2 text-xs bg-white border rounded-md shadow-sm 
                           opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              {question.description}
            </div>
          </div>
        )}
      </div>
      
      {question.type === 'text' && (
        <TextQuestion question={question} control={control} />
      )}
      
      {question.type === 'textarea' && (
        <TextareaQuestion question={question} control={control} />
      )}
      
      {question.type === 'radio' && question.options && (
        <RadioQuestion question={question} control={control} />
      )}
      
      {question.type === 'checkbox' && question.options && (
        <CheckboxQuestion question={question} control={control} />
      )}
      
      {question.type === 'select' && question.options && (
        <SelectQuestion question={question} control={control} />
      )}
      
      {errors[question.id] && (
        <FormMessage>Este campo é obrigatório</FormMessage>
      )}
    </FormItem>
  );
}

// Specialized components for each question type
function TextQuestion({ question, control }: { question: Question; control: Control<Record<string, any>, any> }) {
  return (
    <FormField
      control={control}
      name={question.id}
      rules={{ required: question.isRequired }}
      render={({ field }) => (
        <FormControl>
          <Input
            id={question.id}
            type="text"
            className="w-full"
            {...field}
          />
        </FormControl>
      )}
    />
  );
}

function TextareaQuestion({ question, control }: { question: Question; control: Control<Record<string, any>, any> }) {
  return (
    <FormField
      control={control}
      name={question.id}
      rules={{ required: question.isRequired }}
      render={({ field }) => (
        <FormControl>
          <Textarea
            id={question.id}
            className="w-full"
            rows={4}
            {...field}
          />
        </FormControl>
      )}
    />
  );
}

function RadioQuestion({ question, control }: { question: Question; control: Control<Record<string, any>, any> }) {
  return (
    <FormField
      control={control}
      name={question.id}
      rules={{ required: question.isRequired }}
      render={({ field }) => (
        <FormControl>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="space-y-2"
          >
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                <label htmlFor={`${question.id}-${option}`} className="text-maternal-800">
                  {option}
                </label>
              </div>
            ))}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
}

function CheckboxQuestion({ question, control }: { question: Question; control: Control<Record<string, any>, any> }) {
  return (
    <div className="space-y-2">
      {question.options?.map((option) => (
        <FormField
          key={option}
          control={control}
          name={`${question.id}.${option}`}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  id={`${question.id}-${option}`}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="rounded-sm" // This ensures checkboxes are square
                />
              </FormControl>
              <label
                htmlFor={`${question.id}-${option}`}
                className="text-maternal-800"
              >
                {option}
              </label>
            </div>
          )}
        />
      ))}
    </div>
  );
}

function SelectQuestion({ question, control }: { question: Question; control: Control<Record<string, any>, any> }) {
  return (
    <FormField
      control={control}
      name={question.id}
      rules={{ required: question.isRequired }}
      render={({ field }) => (
        <FormControl>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormControl>
      )}
    />
  );
}
