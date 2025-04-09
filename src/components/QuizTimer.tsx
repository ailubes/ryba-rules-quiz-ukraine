
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
  const { updateTimeRemaining } = useQuiz();
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isWarning, setIsWarning] = useState(false);
  const timerRef = useRef<number | null>(null);
  const onTimeUpRef = useRef(onTimeUp);
  
  // Update the ref when onTimeUp changes
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  // Set up the timer once on mount
  useEffect(() => {
    const setupTimer = () => {
      // Clear any existing timer
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }

      timerRef.current = window.setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (timerRef.current !== null) {
              window.clearInterval(timerRef.current);
              timerRef.current = null;
            }
            onTimeUpRef.current();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    };

    setupTimer();

    // Clean up interval on component unmount
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [timeLimit]); // Only re-run if timeLimit changes

  // Update context whenever timeLeft changes
  useEffect(() => {
    updateTimeRemaining(timeLeft);
  }, [timeLeft, updateTimeRemaining]);

  // Set warning when less than 20% of time remains
  useEffect(() => {
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
