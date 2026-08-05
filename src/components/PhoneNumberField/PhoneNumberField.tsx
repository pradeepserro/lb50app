import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { TextInput } from 'react-native';
import type { Country, CountryCode } from 'react-native-country-picker-modal';
import { DEFAULT_THEME, Flag } from 'react-native-country-picker-modal';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { MASK_PER_COUNTRY, PhoneInput } from 'react-native-phone-entry';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';
import {
  getCallingCodeForCountry,
  parsePhoneForCountry,
} from '@/utils/phone';

const DEFAULT_COUNTRY_CODE: CountryCode = 'IN';
const FLAG_SIZE = Platform.OS === 'android' ? 12 : 14;
const MAX_E164_DIGITS = 15;
const MIN_COUNTRY_MASK_DIGITS = 10;

function countMaskDigitSlots(mask: (string | RegExp)[]): number {
  return mask.filter(slot => slot instanceof RegExp).length;
}

function getPhoneMask(
  callingCode: string,
  countryCode: CountryCode,
): (string | RegExp)[] {
  const codeMask = callingCode
    .split('')
    .map(char => (char === '+' ? '+' : /\d/));
  const callingCodeDigits = callingCode.replace(/\D/g, '').length;
  const maxNationalDigits = MAX_E164_DIGITS - callingCodeDigits;
  const countryMask = MASK_PER_COUNTRY[countryCode] as
    | (string | RegExp)[]
    | undefined;

  if (
    countryMask?.length &&
    countMaskDigitSlots(countryMask) >=
      Math.min(maxNationalDigits, MIN_COUNTRY_MASK_DIGITS)
  ) {
    return [...codeMask, ' ', ...countryMask];
  }

  return [...codeMask, ' ', ...Array(maxNationalDigits).fill(/\d/)];
}

export type PhoneNumberFieldChange = {
  raw: string;
  e164: string | null;
  isValid: boolean;
  countryCode: CountryCode;
};

type Props = {
  defaultCountryCode?: CountryCode;
  defaultPhoneE164?: string | null;
  onPhoneChange: (change: PhoneNumberFieldChange) => void;
  onFocus?: () => void;
  /** Profile-only: toggles locked vs editing container styles. Ignored when variant is 'auth'. */
  editable?: boolean;
  /** 'auth' keeps the original login/register look; 'profile' applies edit-state styling. */
  variant?: 'auth' | 'profile';
};

export function PhoneNumberField({
  defaultCountryCode = DEFAULT_COUNTRY_CODE,
  defaultPhoneE164 = null,
  onPhoneChange,
  onFocus,
  editable = true,
  variant = 'auth',
}: Props) {
  const parsedDefaultPhone = defaultPhoneE164
    ? parsePhoneNumberFromString(defaultPhoneE164)
    : null;
  const initialCountryCode =
    (parsedDefaultPhone?.country as CountryCode | undefined) ??
    defaultCountryCode;
  const initialCallingCode = parsedDefaultPhone
    ? `+${parsedDefaultPhone.countryCallingCode}`
    : getCallingCodeForCountry(defaultCountryCode);

  const [countryCode, setCountryCode] =
    useState<CountryCode>(initialCountryCode);
  const [callingCode, setCallingCode] = useState(initialCallingCode);
  const [inputKey, setInputKey] = useState(0);
  const inputRef = useRef<TextInput | null>(null);
  const phoneTextRef = useRef(
    parsedDefaultPhone
      ? `+${parsedDefaultPhone.countryCallingCode}${parsedDefaultPhone.nationalNumber}`
      : initialCallingCode,
  );

  const emitChange = useCallback(
    (raw: string, selectedCountry: CountryCode) => {
      const parsed = parsePhoneForCountry(raw, selectedCountry);
      const resolvedCountry = (parsed?.country ?? selectedCountry) as CountryCode;
      const isValid = parsed?.isValid() ?? false;

      onPhoneChange({
        raw,
        e164: isValid && parsed ? parsed.format('E.164') : null,
        isValid,
        countryCode: resolvedCountry,
      });
    },
    [onPhoneChange],
  );
  const emitChangeRef = useRef(emitChange);
  emitChangeRef.current = emitChange;

  const inputDefaults = useMemo(
    () => ({
      countryCode,
      callingCode,
      phoneNumber: phoneTextRef.current,
    }),
    // inputKey forces PhoneInput to remount with fresh defaults on country change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [countryCode, callingCode, inputKey],
  );

  const phoneMask = useMemo(
    () => getPhoneMask(callingCode, countryCode),
    [callingCode, countryCode],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      phoneTextRef.current = text;
      const parsed = parsePhoneForCountry(text, countryCode);
      const nextCountryCode = (parsed?.country ?? countryCode) as CountryCode;
      const nextCallingCode = parsed?.countryCallingCode
        ? `+${parsed.countryCallingCode}`
        : callingCode;

      if (nextCountryCode !== countryCode) {
        setCountryCode(nextCountryCode);
      }
      if (nextCallingCode !== callingCode) {
        setCallingCode(nextCallingCode);
      }

      emitChange(text, nextCountryCode);
    },
    [callingCode, countryCode, emitChange],
  );

  const handleChangeCountry = useCallback(
    (country: Country) => {
      const nextCountryCode = country.cca2;
      const nextCallingCode = `+${country.callingCode[0]}`;
      phoneTextRef.current = nextCallingCode;
      setCountryCode(nextCountryCode);
      setCallingCode(nextCallingCode);
      setInputKey(key => key + 1);
      emitChange(nextCallingCode, nextCountryCode);
      setTimeout(() => inputRef.current?.focus(), 100);
    },
    [emitChange],
  );

  useEffect(() => {
    emitChangeRef.current(phoneTextRef.current, countryCode);
  }, [countryCode, callingCode]);

  const isProfileVariant = variant === 'profile';

  return (
    <View
      pointerEvents={isProfileVariant && !editable ? 'none' : 'auto'}
      style={[
        styles.fieldInputWrap,
        isProfileVariant &&
          (editable
            ? styles.fieldInputWrapEditing
            : styles.fieldInputWrapLocked),
      ]}
    >
      <PhoneInput
        key={inputKey}
        defaultValues={inputDefaults}
        onChangeText={handleChangeText}
        onChangeCountry={handleChangeCountry}
        countryPickerProps={{
          withCallingCode: true,
          withFilter: true,
          withAlphaFilter: true,
          withEmoji: false,
          preferredCountries: [DEFAULT_COUNTRY_CODE],
          renderFlagButton: ({ countryCode: pickerCountryCode }) => (
            <View style={styles.flagContainer}>
              <Flag
                countryCode={(pickerCountryCode ?? countryCode) as CountryCode}
                withEmoji={false}
                withFlagButton
                flagSize={Platform.OS === 'android' ? 14 : 16}
              />
            </View>
          ),
          theme: {
            ...DEFAULT_THEME,
            flagSize: FLAG_SIZE,
            flagSizeButton: FLAG_SIZE,
          },
        }}
        flagProps={{
          withEmoji: false,
          flagSize: Platform.OS === 'android' ? 14 : 16,
          // Forwarded to FlagButton by react-native-phone-entry at runtime.
          // @ts-expect-error containerButtonStyle is not declared on Flag props.
          containerButtonStyle: styles.flagContainer,
        }}
        theme={{
          containerStyle: styles.phoneInputContainer,
          flagButtonStyle: styles.flagButton,
          textInputStyle: styles.phoneTextInput,
          dropDownImageStyle: styles.dropdownIcon,
        }}
        maskInputProps={{
          mask: phoneMask,
          // @ts-expect-error ref is forwarded to MaskInput by react-native-phone-entry.
          ref: (ref: TextInput | null) => {
            inputRef.current = ref;
          },
          placeholder: 'Phone number',
          placeholderTextColor: 'rgba(10,20,40,0.35)',
          textAlignVertical: 'center',
          onFocus,
          ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
        }}
      />
    </View>
  );
}

const INPUT_HEIGHT = 44;

const styles = StyleSheet.create({
  fieldInputWrap: {
    height: INPUT_HEIGHT,
    borderRadius: 50,
    backgroundColor: '#F1F4F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  fieldInputWrapLocked: {
    backgroundColor: Colors.gray,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  fieldInputWrapEditing: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(110, 191, 98, 0.35)',
  },
  phoneInputContainer: {
    flex: 1,
    height: INPUT_HEIGHT,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    alignItems: 'center',
  },
  flagButton: {
    width: undefined,
    minWidth: 56,
    maxWidth: 72,
    height: INPUT_HEIGHT,
    borderRightWidth: 0,
    paddingHorizontal: 0,
    marginRight: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  flagContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginRight: 0,
    height: INPUT_HEIGHT,
  },
  phoneTextInput: {
    flex: 1,
    height: INPUT_HEIGHT,
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 14,
    lineHeight: Platform.OS === 'ios' ? 18 : undefined,
    color: Colors.titleTextColor,
    fontFamily: Fonts.MontserratRegular,
    textAlignVertical: 'center',
  },
  dropdownIcon: {
    height: 14,
    width: 14,
    tintColor: 'rgba(10,20,40,0.45)',
    alignSelf: 'center',
  },
});
