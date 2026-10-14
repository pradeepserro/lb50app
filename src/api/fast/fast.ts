import type { HomeResponse } from '@/api/home/home';

export interface SaveFastParams {
  id: string | number | null;
  start_datetime: string;
  current_datetime: string;
  hours: number;
  meal_feedback: 0 | 1;
}

export interface GetFastHoursResponse {
  hours: string;
}

export type FastResponse = HomeResponse;
