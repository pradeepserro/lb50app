import {
  getCountryCallingCode,
  parsePhoneNumberFromString,
  type CountryCode as LibCountryCode,
} from 'libphonenumber-js';
import type { CountryCode } from 'react-native-country-picker-modal';

export function getCallingCodeForCountry(countryCode: CountryCode): string {
  return `+${getCountryCallingCode(countryCode as LibCountryCode)}`;
}

export function parsePhoneForCountry(
  phone: string,
  countryCode: CountryCode,
) {
  const trimmed = phone.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith('+')) {
    return (
      parsePhoneNumberFromString(trimmed) ??
      parsePhoneNumberFromString(trimmed, countryCode as LibCountryCode)
    );
  }

  return parsePhoneNumberFromString(trimmed, countryCode as LibCountryCode);
}

export function isValidPhoneForCountry(
  phone: string,
  countryCode: CountryCode,
): boolean {
  return parsePhoneForCountry(phone, countryCode)?.isValid() ?? false;
}

export function formatPhoneE164(
  phone: string,
  countryCode: CountryCode,
): string | null {
  const parsed = parsePhoneForCountry(phone, countryCode);
  if (!parsed?.isValid()) {
    return null;
  }
  return parsed.format('E.164');
}
