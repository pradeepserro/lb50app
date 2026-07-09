import client from '@/api/client';
import { API_ENDPOINTS } from '@/utils/constant';
import type { HomeResponse } from '@/api/home/home';

export const fetchHomeApi = async (): Promise<HomeResponse> => {
  const response = await client.get<HomeResponse>(API_ENDPOINTS.HOME);
  return response.data;
};
