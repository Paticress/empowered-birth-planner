
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { QuestionSection } from './types/questionnaire';
import { 
  Form,
} from '@/components/ui/form';
import { useEffect } from 'react';
import { QuestionField } from './QuestionField';

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
  
  const { handleSubmit, formState, watch, control, setValue } = form;
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
