
import { DifficultyLevel, QuizQuestion, QuizResult, QuizStatistics } from '../types/quiz';
import { QUIZ_CONFIG, QUIZ_SECTIONS } from '../constants/quizConfig';
import { REGIONS } from '../constants/regions';

// Generate mock questions (this would be replaced with real data fetching)
const generateMockQuestions = (difficultyLevel: DifficultyLevel): QuizQuestion[] => {
  const config = QUIZ_CONFIG[difficultyLevel];
  const questions: QuizQuestion[] = [];
  let questionId = 1;

  // Generate questions for each section based on distribution
  for (const [sectionId, count] of Object.entries(config.sectionDistribution)) {
    for (let i = 0; i < count; i++) {
      const sectionName = QUIZ_SECTIONS.find(s => s.id === sectionId)?.name || sectionId;
      
      questions.push({
        id: `q${questionId}`,
        sectionId,
        text: `Питання №${questionId} із розділу "${sectionName}"`,
        options: [
          `Варіант відповіді 1 для питання ${questionId}`,
          `Варіант відповіді 2 для питання ${questionId}`,
          `Варіант відповіді 3 для питання ${questionId}`,
          `Варіант відповіді 4 для питання ${questionId}`,
        ],
        correctAnswer: Math.floor(Math.random() * 4), // Random correct answer 0-3
        explanation: `Це пояснення правильної відповіді на питання ${questionId}`,
      });
      
      questionId++;
    }
  }

  // Shuffle questions
  return questions.sort(() => Math.random() - 0.5);
};

// Mock function to get questions
export const getQuizQuestions = (difficultyLevel: DifficultyLevel): Promise<QuizQuestion[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockQuestions(difficultyLevel));
    }, 500);
  });
};

// Mock function to save quiz results
export const saveQuizResult = (result: QuizResult): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Quiz result saved:', result);
      
      // In a real app, we'd save this to a database
      const existingResults = localStorage.getItem('quizResults');
      const results = existingResults ? JSON.parse(existingResults) : [];
      results.push(result);
      localStorage.setItem('quizResults', JSON.stringify(results));
      
      resolve();
    }, 500);
  });
};

// Mock function to get quiz statistics
export const getQuizStatistics = (): Promise<QuizStatistics> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, we'd calculate this from database data
      const existingResults = localStorage.getItem('quizResults');
      const results: QuizResult[] = existingResults ? JSON.parse(existingResults) : [];
      
      if (results.length === 0) {
        resolve({
          overallAverageScore: 0,
          totalTestsTaken: 0,
          difficultyDistribution: { easy: 0, medium: 0, hard: 0 },
          regionPerformance: [],
        });
        return;
      }
      
      // Calculate overall average score
      const totalScore = results.reduce((sum, result) => sum + (result.correctAnswers / result.totalQuestions) * 100, 0);
      const overallAverageScore = totalScore / results.length;
      
      // Calculate difficulty distribution
      const difficultyDistribution = {
        easy: results.filter(r => r.difficultyLevel === 'easy').length,
        medium: results.filter(r => r.difficultyLevel === 'medium').length,
        hard: results.filter(r => r.difficultyLevel === 'hard').length,
      };
      
      // Calculate region performance
      const regionMap: Map<number, { sum: number; count: number }> = new Map();
      results.forEach(result => {
        const current = regionMap.get(result.regionId) || { sum: 0, count: 0 };
        regionMap.set(result.regionId, {
          sum: current.sum + (result.correctAnswers / result.totalQuestions) * 100,
          count: current.count + 1,
        });
      });
      
      const regionPerformance = Array.from(regionMap.entries()).map(([regionId, data]) => {
        const region = REGIONS.find(r => r.id === regionId);
        return {
          regionId,
          regionName: region?.name || `Region ${regionId}`,
          averageScore: data.sum / data.count,
          testsTaken: data.count,
        };
      });
      
      resolve({
        overallAverageScore,
        totalTestsTaken: results.length,
        difficultyDistribution,
        regionPerformance,
      });
    }, 500);
  });
};

// Mock function to import questions (for admin)
export const importQuizQuestions = (questions: any[]): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Imported questions:', questions);
      localStorage.setItem('importedQuestions', JSON.stringify(questions));
      resolve(true);
    }, 800);
  });
};
