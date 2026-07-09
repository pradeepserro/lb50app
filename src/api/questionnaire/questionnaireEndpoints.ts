import client from '@/api/client';
import {
  FetchQuestionsParams,
  QuestionsResponse,
  SubmitQuestionsParams,
} from '@/api/questionnaire/questionnaire';
import {
  API_ENDPOINTS,
  QUESTIONNAIRE_PREVIOUS_NEXT,
  QUESTIONNAIRE_RESET_SURVEY,
} from '@/utils/constant';

export const fetchQuestionsApi = async (
  params?: FetchQuestionsParams,
): Promise<QuestionsResponse> => {
  const response = await client.post<QuestionsResponse>(
    API_ENDPOINTS.QUESTIONS,
    {
      previous_next: QUESTIONNAIRE_PREVIOUS_NEXT.NONE,
      ...params,
    },
  );
  return response.data;
};

export const submitQuestionsApi = async (
  params: SubmitQuestionsParams,
): Promise<QuestionsResponse> => {
  const response = await client.post<QuestionsResponse>(
    API_ENDPOINTS.QUESTIONS,
    params,
  );
  return response.data;
};

export const resetQuestionnaireProgressApi = async (): Promise<QuestionsResponse> =>
  fetchQuestionsApi({
    reset_survey: QUESTIONNAIRE_RESET_SURVEY,
  });
