import type { ApiQuestionValidation } from '@/api/questionnaire/questionnaire';

export interface LogHistoryItem {
  id: number;
  value: number;
  date?: string;
  created_at?: string;
  log_description: string;
  type_id: number;
  answer_description?: string;
}

export interface LogHistoryResponse {
  logs: LogHistoryItem[];
}

export interface LogAnswerOption {
  id: number;
  description: string;
  value: number;
}

export interface LogUserAnswer {
  id: number;
  log_answer_id?: number;
  value: number;
}

export interface Log6PillarMaster {
  id: number;
  description: string;
  answer_type: number;
  log_answers: LogAnswerOption[];
  user_answers: LogUserAnswer[];
}

export interface Log6PillarsResponse {
  date: string;
  history_dates?: string[];
  log_masters: Log6PillarMaster[];
}

export interface LogOthersMaster {
  id: number;
  description: string;
  required?: number;
  validation?: ApiQuestionValidation | null;
  user_answers: LogUserAnswer[];
}

export interface LogOthersResponse {
  date: string;
  history_dates?: string[];
  log_masters: LogOthersMaster[];
}

export interface SaveLog6PillarMaster {
  id: number;
  log_answers: number[];
  user_old_log_answers: number[];
}

export interface SaveLog6PillarsParams {
  date: string;
  log_masters: SaveLog6PillarMaster[];
}

export interface SaveLogOthersMaster {
  id: number;
  log_answers: number[];
  user_old_log_answers: number[];
}

export const LOG_OTHERS_TYPE_ID = {
  WEEKLY: 2,
  ANNUAL: 3,
} as const;

export interface SaveLogOthersParams {
  date: string;
  type_id: number;
  log_masters: SaveLogOthersMaster[];
}

export function formatLogApiDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function normalizeHistoryDate(dateInput: string): string | null {
  const datePart = dateInput.trim().split(/[T ]/)[0] ?? '';
  if (!datePart) {
    return null;
  }

  const isoMatch = datePart.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    const day = isoMatch[3].padStart(2, '0');
    const parsed = parseDatePart(`${year}-${month}-${day}`);
    return parsed ? `${year}-${month}-${day}` : null;
  }

  const parsed = parseDatePart(datePart);
  if (!parsed) {
    return null;
  }

  return formatLogApiDate(parsed);
}

export function normalizeHistoryDates(dates: string[] | undefined): string[] {
  if (!dates?.length) {
    return [];
  }

  const normalized = dates
    .map((date) => normalizeHistoryDate(date))
    .filter((date): date is string => date != null);

  return [...new Set(normalized)];
}

function parseDatePart(datePart: string): Date | null {
  const isoMatch = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const parsed = new Date(`${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}T12:00:00`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const dmyMatch = datePart.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmyMatch) {
    const parsed = new Date(
      `${dmyMatch[3]}-${dmyMatch[2].padStart(2, '0')}-${dmyMatch[1].padStart(2, '0')}T12:00:00`,
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const fallback = new Date(`${datePart}T12:00:00`);
  return Number.isNaN(fallback.getTime()) ? null : fallback;
}

export function getLogHistoryDateString(item: LogHistoryItem): string {
  const raw = item.date?.trim() || item.created_at?.trim() || '';
  if (!raw) {
    return '';
  }
  return raw.split(/[T ]/)[0] ?? '';
}

export function parseLogHistoryDate(dateInput: string): { month: string; day: string } {
  const datePart = dateInput.trim().split(/[T ]/)[0] ?? '';
  if (!datePart) {
    return { month: '', day: '' };
  }

  const parsed = parseDatePart(datePart);
  if (!parsed) {
    return { month: '', day: '' };
  }

  return {
    month: parsed.toLocaleDateString(undefined, { month: 'long' }).toUpperCase(),
    day: String(parsed.getDate()),
  };
}

export function formatLogHistoryTitle(description: string): string {
  const text = description.trim();
  if (text.length > 0 && text === text.toUpperCase() && /[A-Z]/.test(text)) {
    return text
      .split(/\s+/)
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }
  return text;
}

export function formatLogHistoryAnswer(item: LogHistoryItem): string {
  const description = item.answer_description?.trim();
  if (description) {
    return description;
  }
  if (item.type_id === 2 && item.value != null) {
    return String(item.value);
  }
  return '';
}

export function normalizeLogHistoryItem(
  item: LogHistoryItem,
): LogHistoryItem {
  return {
    ...item,
    date: getLogHistoryDateString(item),
  };
}
