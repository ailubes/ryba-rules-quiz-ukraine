import { useState, useEffect } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { QuizResult } from '../types/quiz';
import { REGIONS } from '../constants/regions';
import { saveQuizResult } from '../services/mockQuizService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, XCircle, ArrowRight, Home } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/components/ui/use-toast';

type QuizResultsProps = {
  onRestart: () => void;
  onViewStats: () => void;
};

const QuizResults = ({ onRestart, onViewStats }: QuizResultsProps) => {
  const { toast } = useToast();
  const { state } = useQuiz();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const correctAnswers = state.answers.filter((a) => a.isCorrect).length;
  const score = Math.round((correctAnswers / state.questions.length) * 100);
  
  const region = REGIONS.find((r) => r.id === state.regionId);

  useEffect(() => {
    const saveResults = async () => {
      try {
        setSaving(true);
        
        const result: QuizResult = {
          userName: state.userName,
          regionId: state.regionId,
          difficultyLevel: state.difficultyLevel,
          score,
          totalQuestions: state.questions.length,
          correctAnswers,
          answers: state.answers,
          completedAt: new Date().toISOString(),
        };
        
        await saveQuizResult(result);
        setSaved(true);
        toast({
          title: "Результати збережено",
          description: "Ваші результати анонімно збережені та додані до статистики.",
        });
      } catch (error) {
        console.error('Error saving quiz results:', error);
        toast({
          title: "Помилка",
          description: "Не вдалося зберегти результати тесту.",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    };
    
    saveResults();
  }, [state, score, correctAnswers, toast]);
  
  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = () => {
    if (score >= 80) return 'Відмінно! Ви добре знаєте правила рибальства.';
    if (score >= 60) return 'Добре! Але є місце для покращення знань.';
    if (score >= 40) return 'Задовільно. Варто більше вивчити правила рибальства.';
    return 'Потрібно краще вивчити правила рибальства.';
  };

  return (
    <div className="container max-w-3xl px-4 py-8 mx-auto">
      <Card className="bg-white shadow-md">
        <CardHeader className="text-center bg-gradient-to-r from-fishing-blue to-fishing-lightBlue text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">
            Результати тесту
          </CardTitle>
          <CardDescription className="text-white/80">
            {state.userName} - {region?.name}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-2">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-full mb-3">
              <span className={`text-5xl font-bold ${getScoreColor()}`}>
                {score}%
              </span>
            </div>
            <h3 className="text-xl font-medium">
              {getScoreDescription()}
            </h3>
            <p className="text-gray-500 mt-2">
              Правильних відповідей: {correctAnswers} з {state.questions.length}
            </p>
          </div>

          <Progress
            value={score}
            className="h-3 mb-4"
            indicatorClassName={
              score >= 80 ? 'bg-green-600' :
              score >= 60 ? 'bg-yellow-600' :
              'bg-red-600'
            }
          />

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Детальний огляд:</h3>
            <Accordion type="single" collapsible className="border rounded-lg">
              <AccordionItem value="answers">
                <AccordionTrigger className="px-4 py-2">
                  Переглянути відповіді
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="space-y-4 mt-2">
                    {state.questions.map((question, index) => {
                      const answer = state.answers.find((a) => a.questionId === question.id);
                      const isCorrect = answer?.isCorrect;
                      return (
                        <div 
                          key={question.id} 
                          className={`p-4 rounded-lg border ${
                            isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <div className="mt-1 flex-shrink-0">
                              {isCorrect ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">
                                {index + 1}. {question.text}
                              </p>
                              
                              {answer && (
                                <div className="mt-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Ваша відповідь:</span> {question.options[answer.selectedOption]}
                                  </p>
                                  {!isCorrect && (
                                    <p className="text-sm mt-1">
                                      <span className="font-medium">Правильна відповідь:</span> {question.options[question.correctAnswer]}
                                    </p>
                                  )}
                                </div>
                              )}
                              
                              {question.explanation && (
                                <p className="text-sm mt-2 bg-white/50 p-2 rounded">
                                  <span className="font-medium">Пояснення:</span> {question.explanation}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row sm:justify-between gap-3 bg-gray-50 p-6 rounded-b-lg">
          {saving ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Збереження результатів...</span>
            </div>
          ) : (
            <>
              <Button variant="outline" onClick={onRestart}>
                <Home className="mr-2 h-4 w-4" />
                На головну
              </Button>
              <Button onClick={onViewStats} className="bg-fishing-blue hover:bg-fishing-blue/90">
                Переглянути статистику
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizResults;
