import client from '@/api/client';
import type {
  QuizResponse,
  SaveQuizParams,
  SaveQuizResponse,
} from '@/api/quiz/quiz';
import { API_ENDPOINTS } from '@/utils/constant';

export const fetchQuizApi = async (): Promise<QuizResponse> => {
  const response = await client.get<QuizResponse>(API_ENDPOINTS.QUIZ);
  return response.data;
};

export const saveQuizApi = async (
  params: SaveQuizParams,
): Promise<SaveQuizResponse> => {
  const response = await client.post<SaveQuizResponse>(
    API_ENDPOINTS.QUIZ,
    {
      question_id: params.question_id,
      answer_id: params.answer_id,
      correct: params.correct,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
};