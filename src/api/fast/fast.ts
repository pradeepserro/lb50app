import type { HomeResponse } from '@/api/home/home';

export interface SaveFastParams {
  start_datetime: string;
  hours: number;
}

export interface GetFastHoursResponse {
  hours: string;
}

export type FastResponse = HomeResponse;
