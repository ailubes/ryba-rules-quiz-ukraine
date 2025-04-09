
import { useEffect, useState, useRef } from 'react';
import { useQuiz } from '../contexts/QuizContext';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

type QuizTimerProps = {
  timeLimit: number;
  onTimeUp: () => void;
};

const QuizTimer = ({ timeLimit, onTimeUp }: QuizTimerProps) => {
  const { state, updateTimeRemaining } = useQuiz();
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isWarning, setIsWarning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timer on component mount/unmount
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          if (timerRef.current) {
            window.clearInterval(timerRef.current);
          }
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Clean up interval on component unmount
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [onTimeUp]);

  useEffect(() => {
    updateTimeRemaining(timeLeft);
  }, [timeLeft, updateTimeRemaining]);

  useEffect(() => {
    // Set warning when less than 20% of time remains
    setIsWarning(timeLeft < timeLimit * 0.2);
  }, [timeLeft, timeLimit]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage
  const progressPercentage = (timeLeft / timeLimit) * 100;

  return (
    <Card className={`border-l-4 ${isWarning ? 'border-l-red-500' : 'border-l-fishing-green'}`}>
      <CardContent className="py-3 px-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Clock className={`h-5 w-5 ${isWarning ? 'text-red-500 animate-pulse-soft' : 'text-fishing-green'}`} />
            <span className="font-semibold">Залишилось часу:</span>
          </div>
          <div className={`font-mono text-lg font-bold ${isWarning ? 'text-red-500' : 'text-fishing-green'}`}>
            {formatTime(timeLeft)}
          </div>
        </div>
        
        <Progress
          value={progressPercentage}
          className={`h-2 ${isWarning ? 'bg-red-100' : 'bg-green-100'}`}
          indicatorClassName={isWarning ? 'bg-red-500' : 'bg-fishing-green'}
        />
      </CardContent>
    </Card>
  );
};

export default QuizTimer;
