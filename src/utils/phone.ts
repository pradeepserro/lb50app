import {
  parsePhoneNumberFromString,
  type CountryCode as LibCountryCode,
} from 'libphonenumber-js';
import type { CountryCode } from 'react-native-country-picker-modal';
import { isValidNumber } from 'react-native-phone-entry';

export function isValidPhoneForCountry(
  phone: string,
  countryCode: CountryCode,
): boolean {
  if (!phone.trim()) {
    return false;
  }
  return isValidNumber(phone, countryCode);
}

export function formatPhoneE164(
  phone: string,
  countryCode: CountryCode,
): string | null {
  const parsed = parsePhoneNumberFromString(phone, countryCode as LibCountryCode);
  if (!parsed?.isValid()) {
    return null;
  }
  return parsed.format('E.164');
}
