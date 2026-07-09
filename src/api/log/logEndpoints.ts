import client from '@/api/client';
import {
  normalizeLogHistoryItem,
  type Log6PillarsResponse,
  type LogHistoryResponse,
  type LogOthersResponse,
  type SaveLog6PillarsParams,
  type SaveLogOthersParams,
} from '@/api/log/log';
import { API_ENDPOINTS } from '@/utils/constant';

function mapLogHistoryResponse(data: LogHistoryResponse): LogHistoryResponse {
  return {
    logs: (data.logs ?? []).map(normalizeLogHistoryItem),
  };
}

export const fetchLogHistoryApi = async (): Promise<LogHistoryResponse> => {
  const response = await client.get<LogHistoryResponse>(API_ENDPOINTS.LOG_HISTORY);
  return mapLogHistoryResponse(response.data);
};

export const deleteLogHistoryApi = async (id: number): Promise<LogHistoryResponse> => {
  const response = await client.post<LogHistoryResponse>(API_ENDPOINTS.LOG_HISTORY, {
    id: String(id),
  });
  return mapLogHistoryResponse(response.data);
};

export const fetchLog6PillarsApi = async (date?: string): Promise<Log6PillarsResponse> => {
  const response = await client.get<Log6PillarsResponse>(API_ENDPOINTS.LOG_6_PILLARS, {
    params: date ? { date } : undefined,
  });
  return response.data;
};

export const saveLog6PillarsApi = async (params: SaveLog6PillarsParams): Promise<void> => {
  await client.post(API_ENDPOINTS.LOG_6_PILLARS, params);
};

export const fetchLogOthersApi = async (
  date?: string,
  typeId?: number,
): Promise<LogOthersResponse> => {
  const params: Record<string, string | number> = {};
  if (date) {
    params.date = date;
  }
  if (typeId != null) {
    params.type_id = typeId;
  }
  const response = await client.get<LogOthersResponse>(API_ENDPOINTS.LOG_OTHERS, {
    params: Object.keys(params).length > 0 ? params : undefined,
  });
  return response.data;
};

export const saveLogOthersApi = async (params: SaveLogOthersParams): Promise<void> => {
  await client.post(API_ENDPOINTS.LOG_OTHERS, params);
};
