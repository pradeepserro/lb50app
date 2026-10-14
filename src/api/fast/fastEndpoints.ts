import client from '@/api/client';
import { API_ENDPOINTS } from '@/utils/constant';
import type { FastResponse, GetFastHoursResponse, SaveFastParams } from '@/api/fast/fast';

export const fetchFastHoursApi = async (): Promise<GetFastHoursResponse> => {
  const response = await client.get<GetFastHoursResponse>(API_ENDPOINTS.FAST);
  return response.data;
};

function buildFastFormData(params: SaveFastParams): FormData {
  const formData = new FormData();
  formData.append('id', params.id == null ? '' : String(params.id));
  formData.append('start_datetime', params.start_datetime);
  formData.append('current_datetime', params.current_datetime);
  formData.append('hours', String(params.hours));
  formData.append('meal_feedback', String(params.meal_feedback));
  return formData;
}

export const saveFastApi = async (params: SaveFastParams): Promise<FastResponse> => {
  const response = await client.post<FastResponse>(
    API_ENDPOINTS.FAST,
    buildFastFormData(params),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
