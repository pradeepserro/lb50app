import client from '@/api/client';
import { API_ENDPOINTS } from '@/utils/constant';
import type { LearnResponse, LearnStatusResponse, LearnTopicId } from '@/api/learn/learn';

export const fetchLearnApi = async (topicId: LearnTopicId): Promise<LearnResponse> => {
  const response = await client.get<LearnResponse>(API_ENDPOINTS.LEARN, {
    params: { topic_id: topicId },
  });
  return response.data;
};

export const fetchLearnStatusApi = async (): Promise<LearnStatusResponse> => {
  const response = await client.get<LearnStatusResponse>(API_ENDPOINTS.LEARNSTATUS);
  return response.data;
};
