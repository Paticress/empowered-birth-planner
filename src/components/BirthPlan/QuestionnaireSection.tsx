
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Question, QuestionSection } from './types/questionnaire';
import { Input } from '@/components/ui/input';

interface QuestionnaireSectionProps {
  section: QuestionSection;
  onNext: (data: Record<string, any>) => void;
  onPrevious: () => void;
  isFirstSection: boolean;
  isLastSection: boolean;
}

export function QuestionnaireSection({ 
  section, 
  onNext, 
  onPrevious, 
  isFirstSection, 
  isLastSection 
}: QuestionnaireSectionProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-2">Questionário do Plano de Parto</h1>
      <p className="text-lg mb-6 text-maternal-700">
        {section.title}
      </p>
      
      <div className="bg-maternal-50 p-4 rounded-lg mb-6">
        <p>{section.description}</p>
      </div>
      
      <form onSubmit={handleSubmit(onNext)}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
            <CardDescription>Responda às perguntas abaixo para personalizar seu plano de parto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {section.questions.map((question) => (
              <QuestionField 
                key={question.id} 
                question={question} 
                register={register} 
                errors={errors} 
              />
            ))}
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
    </div>
  );
}

interface QuestionFieldProps {
  question: Question;
  register: any;
  errors: any;
}

function QuestionField({ question, register, errors }: QuestionFieldProps) {
  return (
    <div key={question.id} className="space-y-2">
      <label 
        htmlFor={question.id} 
        className="block font-medium text-maternal-900"
      >
        {question.text} {question.isRequired && <span className="text-red-500">*</span>}
      </label>
      
      {question.type === 'text' && (
        <Input
          id={question.id}
          type="text"
          className="w-full"
          {...register(question.id, { required: question.isRequired })}
        />
      )}
      
      {question.type === 'textarea' && (
        <Textarea
          id={question.id}
          className="w-full"
          rows={4}
          {...register(question.id, { required: question.isRequired })}
        />
      )}
      
      {question.type === 'radio' && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="radio"
                id={`${question.id}-${option}`}
                value={option}
                className="mr-2"
                {...register(question.id, { required: question.isRequired })}
              />
              <label htmlFor={`${question.id}-${option}`}>{option}</label>
            </div>
          ))}
        </div>
      )}
      
      {question.type === 'checkbox' && question.options && (
        <div className="space-y-2">
          {question.options.map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="checkbox"
                id={`${question.id}-${option}`}
                value={option}
                className="mr-2"
                {...register(question.id)}
              />
              <label htmlFor={`${question.id}-${option}`}>{option}</label>
            </div>
          ))}
        </div>
      )}
      
      {question.type === 'select' && question.options && (
        <select 
          id={question.id}
          className="w-full p-2 border border-gray-300 rounded-md"
          {...register(question.id, { required: question.isRequired })}
        >
          <option value="">Selecione uma opção</option>
          {question.options.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      )}
      
      {errors[question.id] && (
        <p className="text-red-500 text-sm">Este campo é obrigatório</p>
      )}
    </div>
  );
}
