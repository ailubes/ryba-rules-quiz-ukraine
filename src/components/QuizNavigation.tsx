
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

type QuizNavigationProps = {
  currentPage: number;
  totalPages: number;
  canGoNext: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onFinish: () => void;
};

const QuizNavigation = ({
  currentPage,
  totalPages,
  canGoNext,
  onPrevPage,
  onNextPage,
  onFinish,
}: QuizNavigationProps) => {
  const isLastPage = currentPage === totalPages - 1;

  return (
    <div className="flex justify-between items-center mt-8">
      <Button
        variant="outline"
        onClick={onPrevPage}
        disabled={currentPage === 0}
        className="flex items-center"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Назад
      </Button>

      <div className="text-sm text-gray-500">
        Сторінка {currentPage + 1} з {totalPages}
      </div>

      {isLastPage ? (
        <Button onClick={onFinish} disabled={!canGoNext} className="bg-fishing-green hover:bg-fishing-green/90">
          <CheckCircle className="mr-2 h-4 w-4" />
          Завершити
        </Button>
      ) : (
        <Button onClick={onNextPage} disabled={!canGoNext} className="flex items-center">
          Далі
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default QuizNavigation;
