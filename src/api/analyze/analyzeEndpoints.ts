import client from '@/api/client';
import type { AnalyzeResponse, AnalyzeTabTypeId } from '@/api/analyze/analyze';
import { API_ENDPOINTS } from '@/utils/constant';

export const fetchAnalyzeApi = async (
  typeId: AnalyzeTabTypeId,
): Promise<AnalyzeResponse> => {
  const response = await client.get<AnalyzeResponse>(API_ENDPOINTS.ANALYZE, {
    params: { type_id: typeId },
  });
  return {
    graphs: response.data.graphs ?? [],
  };
};
