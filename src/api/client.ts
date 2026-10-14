import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '@/utils/constant';
import { getAuthToken } from '@/utils/storage';

const REDACTED = '[REDACTED]';
const SENSITIVE_FIELD_PATTERN =
    /authorization|access.?token|refresh.?token|password|passcode|secret|api.?key|credential|cookie|otp|pin/i;

type FormDataLogDetails = {
    fields: Array<{ field: string; value: unknown }>;
    attachments: Array<{ field: string; name: string; type: string }>;
};

function isSensitiveField(field?: string): boolean {
    return Boolean(field && SENSITIVE_FIELD_PATTERN.test(field));
}

function sanitizeString(value: string): string {
    const queryPattern = new RegExp(
        `([?&](?:${SENSITIVE_FIELD_PATTERN.source})=)[^&#]*`,
        'gi',
    );
    const assignmentPattern = new RegExp(
        `((?:${SENSITIVE_FIELD_PATTERN.source})\\s*[:=]\\s*)[^\\s,}&]+`,
        'gi',
    );

    return value
        .replace(/(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi, `$1${REDACTED}`)
        .replace(queryPattern, `$1${REDACTED}`)
        .replace(assignmentPattern, `$1${REDACTED}`);
}

function isFileLike(value: unknown): value is Record<string, unknown> {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const file = value as Record<string, unknown>;
    return 'uri' in file && ('name' in file || 'type' in file);
}

function getAttachmentDetails(value: Record<string, unknown>): {
    name: string;
    type: string;
} {
    return {
        name:
            typeof value.name === 'string'
                ? sanitizeString(value.name)
                : '[unnamed attachment]',
        type:
            typeof value.type === 'string'
                ? sanitizeString(value.type)
                : '[unknown type]',
    };
}

function isFormData(value: unknown): value is FormData {
    if (!value || typeof value !== 'object') {
        return false;
    }

    return (
        (typeof FormData !== 'undefined' && value instanceof FormData) ||
        Array.isArray((value as { _parts?: unknown })._parts)
    );
}

function getFormDataLogDetails(data: FormData): FormDataLogDetails {
    const details: FormDataLogDetails = {
        fields: [],
        attachments: [],
    };
    const parts = (data as FormData & { _parts?: Array<[string, unknown]> })
        ._parts;

    if (!Array.isArray(parts)) {
        details.fields.push({
            field: '[FormData]',
            value: '[Fields unavailable for inspection]',
        });
        return details;
    }

    parts.forEach(([field, value]) => {
        if (isSensitiveField(field)) {
            details.fields.push({ field, value: REDACTED });
            return;
        }

        if (isFileLike(value)) {
            details.attachments.push({
                field,
                ...getAttachmentDetails(value),
            });
            return;
        }

        details.fields.push({
            field,
            value: sanitizeForLog(value, field),
        });
    });

    return details;
}

function sanitizeForLog(
    value: unknown,
    field?: string,
    seen = new WeakSet<object>(),
): unknown {
    if (isSensitiveField(field)) {
        return REDACTED;
    }

    if (value === null || value === undefined) {
        return value;
    }

    if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
            try {
                return sanitizeForLog(JSON.parse(value), field, seen);
            } catch {
                // Keep non-JSON strings intact apart from credential redaction.
            }
        }
        return sanitizeString(value);
    }

    if (typeof value !== 'object') {
        return typeof value === 'bigint' ? String(value) : value;
    }

    if (isFormData(value)) {
        return getFormDataLogDetails(value);
    }

    if (isFileLike(value)) {
        return getAttachmentDetails(value);
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (seen.has(value)) {
        return '[Circular]';
    }
    seen.add(value);

    if (Array.isArray(value)) {
        const result = value.map(item => sanitizeForLog(item, undefined, seen));
        seen.delete(value);
        return result;
    }

    const result = Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, item]) => [
            key,
            sanitizeForLog(item, key, seen),
        ]),
    );
    seen.delete(value);
    return result;
}

function formatForLog(value: unknown): string {
    if (value === undefined) {
        return 'undefined';
    }

    try {
        return JSON.stringify(sanitizeForLog(value), null, 2) ?? 'undefined';
    } catch {
        return '[Unable to serialize safely]';
    }
}

const client = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

function getSafeUrl(config?: AxiosRequestConfig): string {
    if (!config) {
        return 'UNKNOWN';
    }

    try {
        return sanitizeString(client.getUri({ ...config, params: undefined }));
    } catch {
        return sanitizeString(`${config.baseURL ?? ''}${config.url ?? ''}`);
    }
}

function logApiRequest(config: AxiosRequestConfig): void {
    try {
        const formDataDetails = isFormData(config.data)
            ? getFormDataLogDetails(config.data)
            : null;
        const lines = [
            '========== API REQUEST ==========',
            `METHOD: ${(config.method ?? 'GET').toUpperCase()}`,
            `URL: ${getSafeUrl(config)}`,
            `REQUEST DATA: ${formatForLog(
                formDataDetails ? '[FormData]' : config.data,
            )}`,
            `QUERY PARAMS: ${formatForLog(config.params)}`,
        ];

        if (formDataDetails) {
            lines.push(
                `FORM DATA FIELDS: ${formatForLog(formDataDetails.fields)}`,
                `ATTACHMENTS: ${formatForLog(formDataDetails.attachments)}`,
            );
        }

        lines.push('=================================');
        console.log(lines.join('\n'));
    } catch {
        console.warn('[API logger] Unable to format request safely.');
    }
}

function logApiResponse(response: AxiosResponse): void {
    try {
        console.log(
            [
                '========== API RESPONSE ==========',
                `STATUS: ${response.status}`,
                `URL: ${getSafeUrl(response.config)}`,
                `RESPONSE: ${formatForLog(response.data)}`,
                '==================================',
            ].join('\n'),
        );
    } catch {
        console.warn('[API logger] Unable to format response safely.');
    }
}

function logApiError(error: unknown): void {
    try {
        const axiosError = axios.isAxiosError(error) ? error : null;
        const method = axiosError?.config?.method?.toUpperCase() ?? 'UNKNOWN';
        const status = axiosError?.response?.status ?? 'NO HTTP RESPONSE';
        const message =
            error instanceof Error ? sanitizeString(error.message) : 'Unknown error';
        const response = axiosError?.response
            ? formatForLog(axiosError.response.data)
            : 'Network/request-level error: no HTTP response received.';

        console.error(
            [
                '========== API ERROR ==========',
                `METHOD: ${method}`,
                `URL: ${getSafeUrl(axiosError?.config)}`,
                `STATUS: ${status}`,
                `ERROR MESSAGE: ${message}`,
                `RESPONSE: ${response}`,
                '===============================',
            ].join('\n'),
        );
    } catch {
        console.warn('[API logger] Unable to format API error safely.');
    }
}

client.interceptors.request.use(
    async (config) => {
        const token = await getAuthToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (__DEV__) {
            logApiRequest(config);
        }

        return config;
    },
    (error) => Promise.reject(error)
);

client.interceptors.response.use(
    (response) => {
        if (__DEV__) {
            logApiResponse(response);
        }

        return response;
    },
    (error) => {
        if (__DEV__) {
            logApiError(error);
        }

        return Promise.reject(error);
    },
);

export default client;
