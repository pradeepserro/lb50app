import React, { useCallback, useMemo, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import type { Country, CountryCode } from 'react-native-country-picker-modal';
import { DEFAULT_THEME, Flag } from 'react-native-country-picker-modal';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { PhoneInput } from 'react-native-phone-entry';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';
import { formatPhoneE164, isValidPhoneForCountry } from '@/utils/phone';

const DEFAULT_COUNTRY_CODE: CountryCode = 'IN';
const FLAG_SIZE = Platform.OS === 'android' ? 12 : 14;

const DEFAULT_CALLING_CODES: Partial<Record<CountryCode, string>> = {
  IN: '+91',
};

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
  const defaultCallingCode =
    DEFAULT_CALLING_CODES[defaultCountryCode] ?? '+91';
  const initialCountryCode =
    (parsedDefaultPhone?.country as CountryCode | undefined) ??
    defaultCountryCode;
  const initialCallingCode = parsedDefaultPhone
    ? `+${parsedDefaultPhone.countryCallingCode}`
    : defaultCallingCode;

  const [countryCode, setCountryCode] =
    useState<CountryCode>(initialCountryCode);
  const [callingCode, setCallingCode] = useState(initialCallingCode);
  const [inputKey, setInputKey] = useState(0);

  const emitChange = useCallback(
    (raw: string, selectedCountry: CountryCode) => {
      const isValid = isValidPhoneForCountry(raw, selectedCountry);
      const e164 = isValid ? formatPhoneE164(raw, selectedCountry) : null;
      onPhoneChange({
        raw,
        e164,
        isValid,
        countryCode: selectedCountry,
      });
    },
    [onPhoneChange],
  );

  const defaultValues = useMemo(
    () => ({
      countryCode,
      callingCode,
      phoneNumber: defaultPhoneE164 ?? callingCode,
    }),
    [callingCode, countryCode, defaultPhoneE164],
  );

  const handleChangeText = useCallback(
    (text: string) => {
      const parsed = parsePhoneNumberFromString(text);
      const nextCountryCode = (parsed?.country ?? countryCode) as CountryCode;

      if (nextCountryCode !== countryCode) {
        setCountryCode(nextCountryCode);
        if (parsed?.countryCallingCode) {
          setCallingCode(`+${parsed.countryCallingCode}`);
        }
      }

      emitChange(text, nextCountryCode);
    },
    [countryCode, emitChange],
  );

  const handleChangeCountry = useCallback(
    (country: Country) => {
      const nextCountryCode = country.cca2;
      const nextCallingCode = `+${country.callingCode[0]}`;
      setCountryCode(nextCountryCode);
      setCallingCode(nextCallingCode);
      setInputKey(key => key + 1);
      emitChange(nextCallingCode, nextCountryCode);
    },
    [emitChange],
  );

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
        defaultValues={defaultValues}
        onChangeText={handleChangeText}
        countryPickerProps={{
          withCallingCode: true,
          withFilter: true,
          withAlphaFilter: true,
          withEmoji: false,
          preferredCountries: [DEFAULT_COUNTRY_CODE],
          onSelect: handleChangeCountry,
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
          placeholder: '(0000)000-000',
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
