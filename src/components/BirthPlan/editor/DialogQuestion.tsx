
import { useState, useEffect } from 'react';
import { CheckboxOptions } from './CheckboxOptions';
import { RadioOptions } from './RadioOptions';
import { Textarea } from '@/components/ui/textarea';
import { SelectableOptions } from './SelectableOptions';

interface DialogQuestionProps {
  question: any;
  questionId: string;
  selectedOptions: Record<string, Record<string, boolean>>;
  setSelectedOptions: React.Dispatch<React.SetStateAction<Record<string, Record<string, boolean>>>>;
  questionnaireAnswers: Record<string, any>;
  textareaValues: Record<string, string>;
  onTextareaChange: (id: string, value: string) => void;
}

export function DialogQuestion({
  question,
  questionId,
  selectedOptions,
  setSelectedOptions,
  questionnaireAnswers,
  textareaValues,
  onTextareaChange
}: DialogQuestionProps) {
  const isSpecialQuestion = ['emergencyPreferences', 'highRiskComplications', 'lowRiskOccurrences'].includes(questionId);
  
  // Debug logs para questões especiais
  if (isSpecialQuestion) {
    console.log(`Renderizando DialogQuestion para questão especial: ${questionId}`);
    console.log(`Tipo: ${question.type}`);
    console.log(`Tem resposta do questionário:`, !!questionnaireAnswers[questionId]);
    console.log(`Opções selecionadas:`, selectedOptions[questionId]);
  }

  // For textarea questions, render textarea
  if (question.type === 'textarea') {
    return (
      <div className="mb-6">
        <label htmlFor={questionId} className="block font-medium mb-2">
          {question.text}
        </label>
        {question.description && (
          <p className="text-sm text-gray-500 mb-2">{question.description}</p>
        )}
        <Textarea
          id={questionId}
          value={textareaValues[questionId] || ''}
          onChange={(e) => onTextareaChange(questionId, e.target.value)}
          placeholder="Digite sua resposta aqui..."
          className="w-full"
          rows={4}
        />
      </div>
    );
  }

  // Forçar tratamento de questões especiais como checkbox sempre
  if (isSpecialQuestion) {
    return (
      <div className="mb-6">
        <label className="block font-medium mb-2">
          {question.text}
        </label>
        {question.description && (
          <p className="text-sm text-gray-500 mb-2">{question.description}</p>
        )}
        <SelectableOptions
          question={{...question, type: 'checkbox'}} // Força tipo checkbox
          questionId={questionId}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          isSpecialField={true}
          questionnaireAnswers={questionnaireAnswers}
        />
      </div>
    );
  }

  // For other question types (checkbox, radio, select)
  return (
    <div className="mb-6">
      <label className="block font-medium mb-2">
        {question.text}
      </label>
      {question.description && (
        <p className="text-sm text-gray-500 mb-2">{question.description}</p>
      )}
      <SelectableOptions
        question={question}
        questionId={questionId}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        questionnaireAnswers={questionnaireAnswers}
      />
    </div>
  );
}
