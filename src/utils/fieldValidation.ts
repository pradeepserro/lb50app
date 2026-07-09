import type { KeyboardTypeOptions } from 'react-native';
import type { ApiQuestionValidation } from '@/api/questionnaire/questionnaire';

export interface FieldValidation {
  keyboardType?: KeyboardTypeOptions;
  regex?: RegExp;
  minLength?: number;
  maxLength?: number;
}

function regexAllowsDecimals(regexPattern: string | undefined): boolean {
  if (!regexPattern) return false;
  try {
    return new RegExp(regexPattern).test('1.5');
  } catch {
    return false;
  }
}

function filterNumericInput(value: string, allowsDecimal: boolean): string {
  if (!allowsDecimal) {
    return value.replace(/\D/g, '');
  }

  let filtered = '';
  let hasDecimal = false;
  for (const char of value) {
    if (char >= '0' && char <= '9') {
      filtered += char;
    } else if (char === '.' && !hasDecimal) {
      filtered += char;
      hasDecimal = true;
    }
  }
  return filtered;
}

export function parseFieldValidation(
  validation: ApiQuestionValidation | null | undefined,
): FieldValidation | undefined {
  if (!validation) return undefined;

  const result: FieldValidation = {};
  const rules = validation.validation;
  const allowsDecimal = regexAllowsDecimals(rules?.regex);
  if (validation.keyboard_type === 'numeric') {
    result.keyboardType = allowsDecimal ? 'decimal-pad' : 'numeric';
  } else if (validation.keyboard_type === 'alphabetic') {
    result.keyboardType = 'default';
  }

  if (rules?.regex) {
    try {
      result.regex = new RegExp(rules.regex);
    } catch {
      // ignore invalid regex from API
    }
  }
  if (rules?.min_length != null) {
    result.minLength = rules.min_length;
  }
  if (rules?.max_length != null) {
    result.maxLength = rules.max_length;
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

export function filterTextInput(
  value: string,
  validation: ApiQuestionValidation | null | undefined,
): string {
  const parsed = parseFieldValidation(validation);
  let text = value;

  const rules = validation?.validation;
  const allowed = rules?.allowed;
  if (allowed === 'numbers') {
    text = filterNumericInput(text, regexAllowsDecimals(rules?.regex));
  } else if (allowed === 'alphabetic') {
    text = text.replace(/[^a-zA-Z\s]/g, '');
  }

  if (parsed?.maxLength != null) {
    text = text.slice(0, parsed.maxLength);
  }

  return text;
}

export function validateTextField(
  label: string,
  value: string,
  validation?: FieldValidation,
  required = false,
): string | null {
  const text = value.trim();

  if (required && !text) {
    return `Please enter "${label}" before saving.`;
  }

  if (!text) {
    return null;
  }

  if (validation?.minLength != null && text.length < validation.minLength) {
    return `"${label}" must be at least ${validation.minLength} characters.`;
  }
  if (validation?.maxLength != null && text.length > validation.maxLength) {
    return `"${label}" must be at most ${validation.maxLength} characters.`;
  }
  if (validation?.regex && !validation.regex.test(text)) {
    return `Please enter a valid value for "${label}".`;
  }

  return null;
}
