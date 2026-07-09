import client from '@/api/client';
import type {
  RelaxResponse,
  SaveRelaxParams,
  SaveRelaxResponse,
} from '@/api/relax/relax';
import { API_ENDPOINTS } from '@/utils/constant';

function buildRelaxFormData(params: SaveRelaxParams): FormData {
  const formData = new FormData();
  formData.append('type_id', String(params.type_id));
  formData.append('duration', String(params.duration));
  return formData;
}

export const fetchRelaxApi = async (): Promise<RelaxResponse> => {
  const response = await client.get<RelaxResponse>(API_ENDPOINTS.RELAX);
  return response.data;
};

export const saveRelaxApi = async (
  params: SaveRelaxParams,
): Promise<SaveRelaxResponse> => {
  const response = await client.post<SaveRelaxResponse>(
    API_ENDPOINTS.RELAX,
    buildRelaxFormData(params),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
