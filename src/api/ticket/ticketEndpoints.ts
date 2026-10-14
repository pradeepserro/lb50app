import axios from 'axios';
import client from '@/api/client';
import type {
  SaveTicketParams,
  TicketDetailsResponse,
  TicketListResponse,
  TicketSaveResponse,
  TicketStatusId,
  TicketTypesResponse,
} from '@/api/ticket/ticket';
import { API_ENDPOINTS, resolveMediaUrl } from '@/utils/constant';

export const fetchTicketListApi = async (
  statusId: TicketStatusId,
): Promise<TicketListResponse> => {
  const params = { Status_id: statusId };

  if (__DEV__) {
    console.log('[Tickets API][REQUEST]', {
      method: 'GET',
      endpoint: API_ENDPOINTS.TICKET_LIST,
      params,
    });
  }

  try {
    const response = await client.get<TicketListResponse>(
      API_ENDPOINTS.TICKET_LIST,
      { params },
    );

    if (__DEV__) {
      console.log('[Tickets API][RESPONSE]', {
        status: response.status,
        body: response.data,
      });
    }

    return {
      ...response.data,
      tickets: response.data.tickets ?? [],
    };
  } catch (error) {
    if (__DEV__) {
      console.error('[Tickets API][ERROR]', {
        status: axios.isAxiosError(error)
          ? error.response?.status ?? null
          : null,
        body: axios.isAxiosError(error) ? error.response?.data ?? null : null,
      });
    }

    throw error;
  }
};

export const fetchTicketTypesApi = async (
  typeId = 1,
): Promise<TicketTypesResponse> => {
  const params = { type_id: typeId };

  if (__DEV__) {
    console.log('[Ticket Types API][REQUEST]', {
      method: 'GET',
      endpoint: API_ENDPOINTS.TICKET_TYPES,
      params,
    });
  }

  try {
    const response = await client.get<TicketTypesResponse>(
      API_ENDPOINTS.TICKET_TYPES,
      { params },
    );

    if (__DEV__) {
      console.log('[Ticket Types API][RESPONSE]', {
        status: response.status,
        body: response.data,
      });
    }

    return {
      ...response.data,
      ticket_types: response.data.ticket_types ?? [],
    };
  } catch (error) {
    if (__DEV__) {
      console.error('[Ticket Types API][ERROR]', {
        status: axios.isAxiosError(error)
          ? error.response?.status ?? null
          : null,
        body: axios.isAxiosError(error) ? error.response?.data ?? null : null,
      });
    }

    throw error;
  }
};

export const fetchTicketDetailsApi = async (
  ticketId: number,
): Promise<TicketDetailsResponse> => {
  const params = { ticket_id: ticketId };

  if (__DEV__) {
    console.log('[Ticket Details API][REQUEST]', {
      method: 'GET',
      endpoint: API_ENDPOINTS.TICKET,
      params,
    });
  }

  try {
    const response = await client.get<TicketDetailsResponse>(
      API_ENDPOINTS.TICKET,
      { params },
    );

    if (__DEV__) {
      console.log('[Ticket Details API][RESPONSE]', {
        status: response.status,
        body: response.data,
      });
    }

    if (!response.data.ticket) {
      throw new Error('Ticket details were not returned by the server.');
    }

    return {
      ...response.data,
      ticket: {
        ...response.data.ticket,
        details: (response.data.ticket.details ?? []).map(detail => ({
          ...detail,
          attachments: (detail.attachments ?? []).map(attachment => ({
            ...attachment,
            attachment_url: resolveMediaUrl(attachment.attachment_url),
          })),
        })),
      },
    };
  } catch (error) {
    if (__DEV__) {
      console.error('[Ticket Details API][ERROR]', {
        status: axios.isAxiosError(error)
          ? error.response?.status ?? null
          : null,
        body: axios.isAxiosError(error) ? error.response?.data ?? null : null,
      });
    }

    throw error;
  }
};

function buildTicketFormData(params: SaveTicketParams): FormData {
  const formData = new FormData();

  formData.append('ticket_id', String(params.ticket_id));
  formData.append('title', params.title ?? '');
  formData.append('comments', params.comments);
  formData.append(
    'type_id',
    params.type_id === undefined ? '' : String(params.type_id),
  );

  params.attachments.forEach((attachment, index) => {
    formData.append(`file${index + 1}`, {
      uri: attachment.uri,
      name: attachment.name,
      type: attachment.type,
    } as any);
  });

  return formData;
}

function sanitizeHeaders(headers: unknown): unknown {
  if (!headers) {
    return null;
  }

  const serializableHeaders =
    typeof (headers as { toJSON?: () => unknown }).toJSON === 'function'
      ? (headers as { toJSON: () => unknown }).toJSON()
      : headers;

  if (!serializableHeaders || typeof serializableHeaders !== 'object') {
    return serializableHeaders;
  }

  return Object.fromEntries(
    Object.entries(serializableHeaders as Record<string, unknown>).map(
      ([key, value]) => [
        key,
        /authorization|cookie|password|token/i.test(key) ? '[REDACTED]' : value,
      ],
    ),
  );
}

function getSafeRequestDetails(request: unknown): unknown {
  if (!request || typeof request !== 'object') {
    return request ?? null;
  }

  const requestDetails = request as Record<string, unknown>;

  return {
    readyState: requestDetails.readyState ?? null,
    status: requestDetails.status ?? null,
    responseURL: requestDetails.responseURL ?? null,
    responseType: requestDetails.responseType ?? null,
    timeout: requestDetails.timeout ?? null,
    withCredentials: requestDetails.withCredentials ?? null,
  };
}

export const saveTicketApi = async (
  params: SaveTicketParams,
): Promise<TicketSaveResponse> => {
  if (__DEV__) {
    console.log('========== TICKET SAVE REQUEST ==========');
    console.log('[Ticket Save API][REQUEST]', {
      method: 'POST',
      endpoint: API_ENDPOINTS.TICKET,
      fullUrl: client.getUri({ url: API_ENDPOINTS.TICKET }),
      requestFields: {
        ticket_id: params.ticket_id,
        title: params.title ?? '',
        comments: params.comments,
        type_id: params.type_id ?? '',
      },
      attachments: params.attachments.map((attachment, index) => ({
        field: `file${index + 1}`,
        uri: attachment.uri,
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
      })),
    });
  }

  try {
    const response = await client.post<TicketSaveResponse>(
      API_ENDPOINTS.TICKET,
      buildTicketFormData(params),
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    if (__DEV__) {
      console.log('========== TICKET SAVE RESPONSE ==========');
      console.log('[Ticket Save API][RESPONSE]', {
        status: response.status,
        body: response.data,
      });
    }

    return {
      ...response.data,
      tickets: response.data.tickets ?? [],
    };
  } catch (error) {
    if (__DEV__) {
      const isAxiosError = axios.isAxiosError(error);

      console.log('========== TICKET SAVE ERROR ==========');
      console.log('[Ticket Save API][ERROR]', {
        message:
          error instanceof Error ? error.message : String(error ?? 'Unknown'),
        code: isAxiosError ? error.code ?? null : null,
        name: error instanceof Error ? error.name : null,
        isAxiosError,
        failureType: isAxiosError
          ? error.response
            ? 'response'
            : error.request
            ? 'request'
            : 'setup'
          : 'non-axios',
        responseStatus: isAxiosError ? error.response?.status ?? null : null,
        responseData: isAxiosError ? error.response?.data ?? null : null,
        responseHeaders: isAxiosError
          ? sanitizeHeaders(error.response?.headers)
          : null,
        request: isAxiosError ? getSafeRequestDetails(error.request) : null,
        configUrl: isAxiosError ? error.config?.url ?? null : null,
        configMethod: isAxiosError ? error.config?.method ?? null : null,
      });
    }

    throw error;
  }
};
