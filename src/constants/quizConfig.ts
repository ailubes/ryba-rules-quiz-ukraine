
import { QuizConfig, QuizSection } from '../types/quiz';

export const QUIZ_SECTIONS: QuizSection[] = [
  { id: 'general', name: 'I. Загальні положення' },
  { id: 'conditions', name: 'II. Умови здійснення любительського рибальства' },
  { id: 'rights', name: 'III. Права та обов\'язки рибалок' },
  { id: 'prohibited1', name: 'IV. Заборонені знаряддя лову і способи добування (Частина 1)' },
  { id: 'prohibited2', name: 'V. Заборонені знаряддя лову і способи добування (Частина 2) та умови здійснення підводного полювання' },
  { id: 'sports', name: 'VI. Вимоги щодо проведення офіційних спортивних заходів' },
  { id: 'monitoring', name: 'VII. Контроль за дотриманням цих Правил та відповідальність за їх порушення' },
  { id: 'appendices', name: 'Додатки (мінімальні розміри, добові ліміти, заборони)' },
];

export const QUIZ_CONFIG: QuizConfig = {
  easy: {
    totalQuestions: 30,
    questionsPerPage: 10,
    timeLimit: 450, // 7.5 minutes in seconds
    sectionDistribution: {
      general: 4,
      conditions: 4,
      rights: 4,
      prohibited1: 4,
      prohibited2: 4,
      sports: 3,
      monitoring: 3,
      appendices: 4,
    },
  },
  medium: {
    totalQuestions: 50,
    questionsPerPage: 10,
    timeLimit: 750, // 12.5 minutes in seconds
    sectionDistribution: {
      general: 7,
      conditions: 7,
      rights: 7,
      prohibited1: 7,
      prohibited2: 7,
      sports: 7,
      monitoring: 8,
      appendices: 0,
    },
  },
  hard: {
    totalQuestions: 100,
    questionsPerPage: 20,
    timeLimit: 1500, // 25 minutes in seconds
    sectionDistribution: {
      general: 12,
      conditions: 13,
      rights: 15,
      prohibited1: 15,
      prohibited2: 15,
      sports: 15,
      monitoring: 15,
      appendices: 0,
    },
  },
};

export const DIFFICULTY_INFO = {
  easy: {
    label: 'Легкий',
    description: '30 питань, 7.5 хвилин',
  },
  medium: {
    label: 'Середній',
    description: '50 питань, 12.5 хвилин',
  },
  hard: {
    label: 'Складний',
    description: '100 питань, 25 хвилин',
  }
};
