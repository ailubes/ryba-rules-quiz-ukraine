
import { useState, useEffect } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { QuizQuestion as QuestionType } from '../types/quiz';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type QuizQuestionProps = {
  question: QuestionType;
  index: number;
  totalQuestions: number;
};

const QuizQuestion = ({ question, index, totalQuestions }: QuizQuestionProps) => {
  const { state, answerQuestion } = useQuiz();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const existingAnswer = state.answers.find((a) => a.questionId === question.id);

  // Set the selected option if an answer already exists
  useEffect(() => {
    if (existingAnswer) {
      setSelectedOption(existingAnswer.selectedOption);
    } else {
      setSelectedOption(null);
    }
  }, [existingAnswer, question.id]);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    answerQuestion(question.id, optionIndex);
  };

  return (
    <Card className="mb-6 border-2 border-gray-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">
            Питання {index + 1} з {totalQuestions}
          </h3>
          <span className="text-sm text-gray-500">
            {question.sectionId}
          </span>
        </div>

        <div className="py-4">
          <p className="text-lg font-medium mb-6">{question.text}</p>

          <RadioGroup value={selectedOption?.toString()} onValueChange={(value) => handleOptionSelect(Number(value))}>
            <div className="space-y-3">
              {question.options.map((option, optionIndex) => (
                <div 
                  key={optionIndex}
                  className={cn(
                    "flex items-center border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors",
                    selectedOption === optionIndex && "border-primary"
                  )}
                >
                  <RadioGroupItem value={optionIndex.toString()} id={`q${question.id}-o${optionIndex}`} className="mr-2" />
                  <Label htmlFor={`q${question.id}-o${optionIndex}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizQuestion;
