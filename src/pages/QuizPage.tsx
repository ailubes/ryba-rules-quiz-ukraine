
import { useState } from 'react';
import { QuizProvider } from '../contexts/QuizContext';
import UserRegistrationForm from '../components/UserRegistrationForm';
import QuizContainer from '../components/QuizContainer';
import QuizResults from '../components/QuizResults';
import QuizStatistics from '../components/QuizStatistics';
import { Fish } from 'lucide-react';
import { Link } from 'react-router-dom';

enum QuizStep {
  REGISTRATION,
  QUIZ,
  RESULTS,
  STATISTICS,
}

const QuizPage = () => {
  const [currentStep, setCurrentStep] = useState<QuizStep>(QuizStep.REGISTRATION);

  const handleStartQuiz = () => {
    setCurrentStep(QuizStep.QUIZ);
  };

  const handleQuizComplete = () => {
    setCurrentStep(QuizStep.RESULTS);
  };

  const handleViewStats = () => {
    setCurrentStep(QuizStep.STATISTICS);
  };

  const handleRestart = () => {
    setCurrentStep(QuizStep.REGISTRATION);
  };

  const renderStep = () => {
    switch (currentStep) {
      case QuizStep.REGISTRATION:
        return <UserRegistrationForm onSubmit={handleStartQuiz} />;
      case QuizStep.QUIZ:
        return <QuizContainer onComplete={handleQuizComplete} />;
      case QuizStep.RESULTS:
        return <QuizResults onRestart={handleRestart} onViewStats={handleViewStats} />;
      case QuizStep.STATISTICS:
        return <QuizStatistics onBack={handleRestart} />;
      default:
        return <UserRegistrationForm onSubmit={handleStartQuiz} />;
    }
  };

  return (
    <div className="min-h-screen water-bg">
      <header className="bg-white shadow-sm mb-8">
        <div className="container mx-auto py-4 px-4 flex justify-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <Fish className="h-8 w-8 text-fishing-blue" />
              <h1 className="text-2xl font-bold text-fishing-blue">
                ПРАВИЛА любительського рибальства
              </h1>
            </Link>
          </div>
        </div>
      </header>

      <QuizProvider>{renderStep()}</QuizProvider>

      <footer className="mt-12 py-6 bg-gray-100">
        <div className="container mx-auto text-center text-gray-500 text-sm">
          <p>© 2025 Тест на знання правил любительського рибальства України</p>
        </div>
      </footer>
    </div>
  );
};

export default QuizPage;
