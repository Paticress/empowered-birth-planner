
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Question, QuestionSection } from './types/questionnaire';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';

interface QuestionnaireSectionProps {
  section: QuestionSection;
  onNext: (data: Record<string, any>) => void;
  onPrevious: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
  initialData?: Record<string, any>;
}

export function QuestionnaireSection({ 
  section, 
  onNext, 
  onPrevious, 
  isFirstSection, 
  isLastSection,
  initialData = {}
}: QuestionnaireSectionProps) {
  const form = useForm({
    defaultValues: initialData
  });
  
  const { register, handleSubmit, formState, watch, control, setValue } = form;
  const { errors } = formState;
  
  // Watch all form values for conditional questions
  const watchedValues = watch();

  // Set up initial values if provided
  useEffect(() => {
    if (Object.keys(initialData).length > 0) {
      Object.entries(initialData).forEach(([key, value]) => {
        setValue(key, value);
      });
    }
  }, [initialData, setValue]);
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-2">Questionário do Plano de Parto</h1>
      <p className="text-lg mb-6 text-maternal-700">
        {section.title}
      </p>
      
      <div className="bg-maternal-50 p-4 rounded-lg mb-6">
        <p>{section.description}</p>
      </div>
      
      {/* Fixed: Properly passing the full form object to Form component */}
      <Form {...form}>
        <form onSubmit={handleSubmit(onNext)}>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>Responda às perguntas abaixo para personalizar seu plano de parto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.questions.map((question) => {
                // Check if this question should be conditionally displayed
                if (question.conditionalDisplay) {
                  const dependsOn = question.conditionalDisplay.dependsOn;
                  const showWhen = question.conditionalDisplay.showWhen;
                  const dependentValue = watchedValues[dependsOn];
                  
                  // If the dependent value doesn't match the condition, don't render this question
                  if (Array.isArray(showWhen)) {
                    if (!showWhen.includes(dependentValue)) return null;
                  } else {
                    if (dependentValue !== showWhen) return null;
                  }
                }
                
                return (
                  <QuestionField 
                    key={question.id} 
                    question={question} 
                    register={register} 
                    errors={errors}
                    control={control}
                  />
                );
              })}
            </CardContent>
          </Card>
          
          <div className="flex justify-between mt-8">
            <Button 
              type="button"
              variant="outline" 
              onClick={onPrevious}
              disabled={isFirstSection}
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Seção Anterior
            </Button>
            
            <Button 
              type="submit"
              className="bg-maternal-600 hover:bg-maternal-700 flex items-center"
            >
              {isLastSection ? 'Finalizar e Gerar Plano' : 'Próxima Seção'} 
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

interface QuestionFieldProps {
  question: Question;
  register: any;
  errors: any;
  control: any;
}

function QuestionField({ question, register, errors, control }: QuestionFieldProps) {
  return (
    <FormItem key={question.id} className="space-y-2">
      <FormLabel className="block font-medium text-maternal-900">
        {question.text} {question.isRequired && <span className="text-red-500">*</span>}
      </FormLabel>
      
      {question.type === 'text' && (
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
      )}
      
      {question.type === 'textarea' && (
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
      )}
      
      {question.type === 'radio' && question.options && (
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
                {question.options.map((option) => (
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
      )}
      
      {question.type === 'checkbox' && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`${question.id}-${option}`}
                {...register(`${question.id}.${option}`)}
              />
              <label
                htmlFor={`${question.id}-${option}`}
                className="text-maternal-800"
              >
                {option}
              </label>
            </div>
          ))}
        </div>
      )}
      
      {question.type === 'select' && question.options && (
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
                  {question.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
          )}
        />
      )}
      
      {errors[question.id] && (
        <FormMessage>Este campo é obrigatório</FormMessage>
      )}
    </FormItem>
  );
}
