import client from '@/api/client';
import { API_ENDPOINTS } from '@/utils/constant';
import { EatResponse, SaveEatParams } from '@/api/eat/eat';

function buildEatFormData(params: SaveEatParams): FormData {
  const formData = new FormData();

  formData.append('start_datetime', params.start_datetime);
  formData.append('meal_type', String(params.meal_type));
  formData.append('addon_type', String(params.addon_type));
  formData.append('carb_level', String(params.carb_level));

  if (params.photo) {
    formData.append('photo', {
      uri: params.photo.uri,
      name: params.photo.name,
      type: params.photo.type,
    } as any);
  }

  return formData;
}

export const saveEatApi = async (params: SaveEatParams): Promise<EatResponse> => {
  const response = await client.post<EatResponse>(
    API_ENDPOINTS.EAT,
    buildEatFormData(params),
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
