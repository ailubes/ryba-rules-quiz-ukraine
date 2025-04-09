
export type Region = {
  id: number;
  name: string;
};

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type DifficultyConfig = {
  totalQuestions: number;
  questionsPerPage: number;
  timeLimit: number; // in seconds
  sectionDistribution: Record<string, number>; // section to number of questions
};

export type QuizConfig = {
  [key in DifficultyLevel]: DifficultyConfig;
};

export type QuizSection = {
  id: string;
  name: string;
};

export type QuizQuestion = {
  id: string;
  sectionId: string;
  text: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation?: string;
};

export type UserAnswer = {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
};

export type QuizResult = {
  userId?: string; // Optional for anonymous users
  userName: string;
  regionId: number;
  difficultyLevel: DifficultyLevel;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  answers: UserAnswer[];
  completedAt: string;
};

export type QuizState = {
  userName: string;
  regionId: number;
  difficultyLevel: DifficultyLevel;
  currentPage: number;
  timeRemaining: number;
  questions: QuizQuestion[];
  answers: UserAnswer[];
  isCompleted: boolean;
  startTime?: Date;
};

export type QuizStatistics = {
  overallAverageScore: number;
  totalTestsTaken: number;
  difficultyDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  regionPerformance: {
    regionId: number;
    regionName: string;
    averageScore: number;
    testsTaken: number;
  }[];
};
