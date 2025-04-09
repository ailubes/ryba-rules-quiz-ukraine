
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { DifficultyLevel, QuizQuestion, QuizState, UserAnswer } from '../types/quiz';

type QuizContextType = {
  state: QuizState;
  startQuiz: (userName: string, regionId: number, difficultyLevel: DifficultyLevel) => void;
  loadQuestions: (questions: QuizQuestion[]) => void;
  answerQuestion: (questionId: string, selectedOption: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  completeQuiz: () => void;
  updateTimeRemaining: (time: number) => void;
};

const initialState: QuizState = {
  userName: '',
  regionId: 0,
  difficultyLevel: 'easy',
  currentPage: 0,
  timeRemaining: 0,
  questions: [],
  answers: [],
  isCompleted: false,
};

type QuizAction =
  | { type: 'START_QUIZ'; payload: { userName: string; regionId: number; difficultyLevel: DifficultyLevel } }
  | { type: 'LOAD_QUESTIONS'; payload: QuizQuestion[] }
  | { type: 'ANSWER_QUESTION'; payload: { questionId: string; selectedOption: number; isCorrect: boolean } }
  | { type: 'NEXT_PAGE' }
  | { type: 'PREV_PAGE' }
  | { type: 'COMPLETE_QUIZ' }
  | { type: 'UPDATE_TIME_REMAINING'; payload: number };

function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case 'START_QUIZ':
      return {
        ...state,
        userName: action.payload.userName,
        regionId: action.payload.regionId,
        difficultyLevel: action.payload.difficultyLevel,
        currentPage: 0,
        timeRemaining: 0,
        questions: [],
        answers: [],
        isCompleted: false,
        startTime: new Date(),
      };
    case 'LOAD_QUESTIONS':
      return {
        ...state,
        questions: action.payload,
      };
    case 'ANSWER_QUESTION':
      const existingAnswerIndex = state.answers.findIndex(
        (a) => a.questionId === action.payload.questionId
      );
      
      let updatedAnswers: UserAnswer[];
      
      if (existingAnswerIndex !== -1) {
        // Update existing answer
        updatedAnswers = [...state.answers];
        updatedAnswers[existingAnswerIndex] = {
          questionId: action.payload.questionId,
          selectedOption: action.payload.selectedOption,
          isCorrect: action.payload.isCorrect,
        };
      } else {
        // Add new answer
        updatedAnswers = [
          ...state.answers,
          {
            questionId: action.payload.questionId,
            selectedOption: action.payload.selectedOption,
            isCorrect: action.payload.isCorrect,
          },
        ];
      }
      
      return {
        ...state,
        answers: updatedAnswers,
      };
    case 'NEXT_PAGE':
      return {
        ...state,
        currentPage: state.currentPage + 1,
      };
    case 'PREV_PAGE':
      return {
        ...state,
        currentPage: Math.max(0, state.currentPage - 1),
      };
    case 'COMPLETE_QUIZ':
      return {
        ...state,
        isCompleted: true,
      };
    case 'UPDATE_TIME_REMAINING':
      return {
        ...state,
        timeRemaining: action.payload,
      };
    default:
      return state;
  }
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const startQuiz = (userName: string, regionId: number, difficultyLevel: DifficultyLevel) => {
    dispatch({
      type: 'START_QUIZ',
      payload: { userName, regionId, difficultyLevel },
    });
  };

  const loadQuestions = (questions: QuizQuestion[]) => {
    dispatch({
      type: 'LOAD_QUESTIONS',
      payload: questions,
    });
  };

  const answerQuestion = (questionId: string, selectedOption: number) => {
    const question = state.questions.find((q) => q.id === questionId);
    if (!question) return;

    const isCorrect = question.correctAnswer === selectedOption;

    dispatch({
      type: 'ANSWER_QUESTION',
      payload: { questionId, selectedOption, isCorrect },
    });
  };

  const nextPage = () => {
    dispatch({ type: 'NEXT_PAGE' });
  };

  const prevPage = () => {
    dispatch({ type: 'PREV_PAGE' });
  };

  const completeQuiz = () => {
    dispatch({ type: 'COMPLETE_QUIZ' });
  };

  const updateTimeRemaining = (time: number) => {
    dispatch({
      type: 'UPDATE_TIME_REMAINING',
      payload: time,
    });
  };

  return (
    <QuizContext.Provider
      value={{
        state,
        startQuiz,
        loadQuestions,
        answerQuestion,
        nextPage,
        prevPage,
        completeQuiz,
        updateTimeRemaining,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
