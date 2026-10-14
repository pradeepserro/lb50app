import client from '@/api/client';
import { API_ENDPOINTS } from '@/utils/constant';
import type { HomeResponse } from '@/api/home/home';

function formatLocalDateTime(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds(),
  )}`;
}

export const fetchHomeApi = async (): Promise<HomeResponse> => {
  const response = await client.get<HomeResponse>(API_ENDPOINTS.HOME, {
    params: {
      current_datetime: formatLocalDateTime(new Date()),
    },
  });
  return response.data;
};
