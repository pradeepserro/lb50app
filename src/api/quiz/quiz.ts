export interface QuizAnswer {
  id: number;
  answer: string;
  correct: number;
  correct_description: string | null;
}

export interface QuizQuestion {
  id: number;
  question: string;
  answers: QuizAnswer[];
}

export interface QuizResponse {
  count: number;
  quizzes: QuizQuestion[];
  incorrect_answer: string[];
}

export interface SaveQuizParams {
  question_id: number;
  answer_id: number;
  correct: number;
}

export interface SaveQuizResponse {
  message: string;
}
