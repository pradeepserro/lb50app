export interface ApiAnswerOption {
  id?: number;
  question_id?: number;
  answer?: string;
  option?: string;
  label?: string;
  warn?: number | null;
  stop?: number | null;
  link?: string | null;
  status_id?: number;
}

export interface ApiQuestionValidationRules {
  allowed?: string;
  regex?: string;
  min_length?: number;
  max_length?: number;
}

export interface ApiQuestionValidation {
  keyboard_type?: string;
  validation?: ApiQuestionValidationRules;
}

export interface ApiUserAnswer {
  id: number;
  answer: string;
}

export interface ApiQuestionItem {
  question_id: number;
  question: string;
  description: string | null;
  type_id: number;
  required: number;
  input_type?: number;
  min_length?: number;
  max_length?: number;
  validation: ApiQuestionValidation | null;
  answers: ApiAnswerOption[];
  user_answers: ApiUserAnswer[];
}

export interface QuestionsResponse {
  questions: ApiQuestionItem[];
  current_count: number;
  total_count: number;
}

export interface SubmitQuestionAnswer {
  question_id: number;
  answers: string;
  old_answer_id: number[];
}

export interface SubmitQuestionsParams {
  questions: SubmitQuestionAnswer[];
  previous_next: number;
}

export interface FetchQuestionsParams {
  from_locale?: number;
  reset_survey?: number;
  previous_next?: number;
}
