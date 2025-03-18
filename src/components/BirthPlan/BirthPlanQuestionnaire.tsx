import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';

interface BirthPlanQuestionnaireProps {
  onSubmit: (data: Record<string, any>) => void;
}

type QuestionSection = {
  id: string;
  title: string;
  description: string;
  questions: Question[];
};

type Question = {
  id: string;
  text: string;
  type: 'text' | 'textarea' | 'checkbox' | 'radio' | 'select';
  options?: string[];
  isRequired?: boolean;
};

export function BirthPlanQuestionnaire({ onSubmit }: BirthPlanQuestionnaireProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  
  // Sample sections and questions - in a real implementation, these would be more comprehensive
  const sections: QuestionSection[] = [
    {
      id: 'personal',
      title: 'Informações Pessoais',
      description: 'Vamos começar com algumas informações básicas sobre você e sua gravidez',
      questions: [
        {
          id: 'name',
          text: 'Qual é o seu nome completo?',
          type: 'text',
          isRequired: true,
        },
        {
          id: 'dueDate',
          text: 'Qual é a sua data prevista para o parto?',
          type: 'text',
          isRequired: true,
        },
        {
          id: 'healthProvider',
          text: 'Quem é seu médico/obstetra?',
          type: 'text',
          isRequired: true,
        },
      ],
    },
    {
      id: 'medical',
      title: 'Histórico Médico',
      description: 'Estas informações ajudarão a personalizar seu plano de acordo com suas necessidades médicas',
      questions: [
        {
          id: 'hasConditions',
          text: 'Você tem alguma condição médica relevante para o parto?',
          type: 'radio',
          options: ['Sim', 'Não'],
          isRequired: true,
        },
        {
          id: 'medicalConditions',
          text: 'Se sim, descreva suas condições médicas:',
          type: 'textarea',
        },
        {
          id: 'medications',
          text: 'Você está tomando algum medicamento atualmente?',
          type: 'textarea',
        },
        {
          id: 'allergies',
          text: 'Você tem alguma alergia?',
          type: 'textarea',
        },
      ],
    },
    {
      id: 'preferences',
      title: 'Preferências para o Parto',
      description: 'Compartilhe suas preferências para o ambiente e procedimentos durante o parto',
      questions: [
        {
          id: 'birthPlacePreference',
          text: 'Onde você prefere dar à luz?',
          type: 'radio',
          options: ['Hospital', 'Casa de Parto', 'Em casa', 'Outro'],
          isRequired: true,
        },
        {
          id: 'companionPreference',
          text: 'Quem você gostaria que estivesse presente durante o parto?',
          type: 'textarea',
          isRequired: true,
        },
        {
          id: 'painManagementPreference',
          text: 'Quais são suas preferências para alívio da dor?',
          type: 'textarea',
          isRequired: true,
        },
      ],
    },
  ];
  
  const currentSection = sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sections.length - 1;
  
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const handleSectionSubmit = (data: Record<string, any>) => {
    // Save data from current section
    setFormData({
      ...formData,
      ...data,
    });
    
    if (isLastSection) {
      // If this is the last section, submit the complete form
      onSubmit({
        ...formData,
        ...data,
      });
    } else {
      // Otherwise, move to the next section
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const goToPreviousSection = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <h1 className="text-3xl font-bold text-maternal-900 mb-2">Questionário do Plano de Parto</h1>
      <p className="text-lg mb-6 text-maternal-700">
        Seção {currentSectionIndex + 1} de {sections.length}: {currentSection.title}
      </p>
      
      <div className="bg-maternal-50 p-4 rounded-lg mb-6">
        <p>{currentSection.description}</p>
      </div>
      
      <form onSubmit={handleSubmit(handleSectionSubmit)}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{currentSection.title}</CardTitle>
            <CardDescription>Responda às perguntas abaixo para personalizar seu plano de parto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentSection.questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <label 
                  htmlFor={question.id} 
                  className="block font-medium text-maternal-900"
                >
                  {question.text} {question.isRequired && <span className="text-red-500">*</span>}
                </label>
                
                {question.type === 'text' && (
                  <input
                    id={question.id}
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md"
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
                
                {errors[question.id] && (
                  <p className="text-red-500 text-sm">Este campo é obrigatório</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="flex justify-between mt-8">
          <Button 
            type="button"
            variant="outline" 
            onClick={goToPreviousSection}
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
