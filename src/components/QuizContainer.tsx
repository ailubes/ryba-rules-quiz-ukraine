
import { useEffect, useState } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { QuizQuestion as QuestionType } from '../types/quiz';
import { QUIZ_CONFIG } from '../constants/quizConfig';
import QuizQuestion from './QuizQuestion';
import QuizNavigation from './QuizNavigation';
import QuizTimer from './QuizTimer';
import { getQuizQuestions } from '../services/mockQuizService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';

type QuizContainerProps = {
  onComplete: () => void;
};

const QuizContainer = ({ onComplete }: QuizContainerProps) => {
  const { toast } = useToast();
  const { state, loadQuestions, nextPage, prevPage, completeQuiz } = useQuiz();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const config = QUIZ_CONFIG[state.difficultyLevel];
  const totalPages = Math.ceil(config.totalQuestions / config.questionsPerPage);

  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        setLoading(true);
        const questions = await getQuizQuestions(state.difficultyLevel);
        loadQuestions(questions);
        setError(null);
      } catch (error) {
        console.error('Error fetching quiz questions:', error);
        setError('Не вдалося завантажити питання для тесту. Будь ласка, спробуйте пізніше.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [state.difficultyLevel, loadQuestions]);

  const getCurrentPageQuestions = (): QuestionType[] => {
    const startIndex = state.currentPage * config.questionsPerPage;
    const endIndex = startIndex + config.questionsPerPage;
    return state.questions.slice(startIndex, endIndex);
  };

  const currentPageQuestions = getCurrentPageQuestions();

  const handleTimeUp = () => {
    toast({
      title: "Час вийшов!",
      description: "Час на виконання тесту закінчився.",
      variant: "destructive",
    });
    completeQuiz();
    onComplete();
  };

  const handleNextPage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    nextPage();
  };

  const handlePrevPage = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    prevPage();
  };

  const handleFinish = () => {
    completeQuiz();
    onComplete();
  };

  // Check if all questions on the current page have answers
  const canGoNext = (): boolean => {
    return currentPageQuestions.every((question) =>
      state.answers.some((answer) => answer.questionId === question.id)
    );
  };

  if (loading) {
    return (
      <div className="container max-w-3xl px-4 py-8 mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Завантаження питань...
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((j) => (
                      <Skeleton key={j} className="h-12 w-full" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-3xl px-4 py-8 mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Помилка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl px-4 py-8 mx-auto">
      <QuizTimer timeLimit={config.timeLimit} onTimeUp={handleTimeUp} />

      <div className="my-6">
        {currentPageQuestions.map((question, index) => (
          <QuizQuestion
            key={question.id}
            question={question}
            index={state.currentPage * config.questionsPerPage + index}
            totalQuestions={config.totalQuestions}
          />
        ))}
      </div>

      <QuizNavigation
        currentPage={state.currentPage}
        totalPages={totalPages}
        canGoNext={canGoNext()}
        onPrevPage={handlePrevPage}
        onNextPage={handleNextPage}
        onFinish={handleFinish}
      />
    </div>
  );
};

export default QuizContainer;
