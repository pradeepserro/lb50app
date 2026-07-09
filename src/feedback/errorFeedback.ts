import axios from 'axios';
import { showThemedErrorFeedback } from '@/feedback/errorFeedbackBridge';

/**
 * Resolves a user-facing string from any common error shape:
 * Axios errors, Error instances, plain strings, or JSON-like `{ message }` bodies.
 */
export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === 'string' && data.trim()) {
      return data;
    }
    if (data && typeof data === 'object') {
      const msg = (data as { message?: string; error?: string; detail?: string })
        .message;
      const errStr = (data as { error?: string }).error;
      const detail = (data as { detail?: string }).detail;
      if (typeof msg === 'string' && msg.trim()) return msg;
      if (typeof errStr === 'string' && errStr.trim()) return errStr;
      if (typeof detail === 'string' && detail.trim()) return detail;
    }

    if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    }
    if (
      error.code === 'ERR_NETWORK' ||
      error.message === 'Network Error'
    ) {
      return 'Could not reach the server. Check your connection and API URL.';
    }

    if (typeof error.message === 'string' && error.message.trim()) {
      return error.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (typeof error === 'string') {
    const t = error.trim();
    return t || 'Something went wrong';
  }

  if (error && typeof error === 'object' && !(error instanceof Error)) {
    const o = error as Record<string, unknown>;
    for (const key of ['message', 'error', 'detail'] as const) {
      const v = o[key];
      if (typeof v === 'string' && v.trim()) return v;
    }
  }

  return 'Something went wrong';
}

/**
 * Single themed error UI for the app. Pass any of:
 * - thrown Axios / network errors
 * - `Error` (e.g. Yup `ValidationError`)
 * - plain `string` message
 * - API-style object `{ message?: string }` (non-Error plain object)
 *
 * @param title - dialog title (e.g. `'Invalid Phone'`, `'Unavailable'`)
 */
export function showApiErrorAlert(source: unknown, title = 'Error'): void {
  const message = getApiErrorMessage(source);
  showThemedErrorFeedback(title, message);
}
