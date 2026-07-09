import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  type LayoutChangeEvent,
  Modal,
  Pressable,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/screens/Auth/navigation/types';
import { styles } from '@/screens/Auth/screens/Register/RegisterScreen.styles';
import LogoPng from '@assets/icons/logo.png';
import RightArrow from '@assets/icons/right_arrow_white.svg';
import { PrimaryButton } from '@/components/PrimaryButton';
import UserIcon from '@assets/icons/user.svg';
import ChevronDownGreenIcon from '@assets/icons/chevron_down_blue.svg';
import GenderIcon from '@assets/icons/gender.svg';
import EmailIcon from '@assets/icons/email.svg';
import AgeIcon from '@assets/icons/age.svg';
import LocationIcon from '@assets/icons/location.svg';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { PhoneNumberField } from '@/components/PhoneNumberField/PhoneNumberField';
import { ErrorMessage, Formik } from 'formik';
import * as Yup from 'yup';
import { registerApi } from '@/api/auth/authEndpoints';
import { showApiErrorAlert } from '@/feedback/errorFeedback';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

type RegisterFormValues = {
  fullName: string;
  age: string;
  gender: string;
  email: string;
  address: string;
  phone: string;
};

type RegisterFieldKey =
  | 'fullName'
  | 'age'
  | 'gender'
  | 'email'
  | 'address'
  | 'phone';

export function RegisterScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false);
  const [genderPickerOpen, setGenderPickerOpen] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardBottomInset, setKeyboardBottomInset] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const fieldOffsetsRef = useRef<Partial<Record<RegisterFieldKey, number>>>({});

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, event => {
      setKeyboardVisible(true);
      setKeyboardBottomInset(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardBottomInset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onFieldLayout = useCallback(
    (key: RegisterFieldKey) => (event: LayoutChangeEvent) => {
      fieldOffsetsRef.current[key] = event.nativeEvent.layout.y;
    },
    [],
  );

  const scrollToField = useCallback((key: RegisterFieldKey) => {
    requestAnimationFrame(() => {
      const y = fieldOffsetsRef.current[key];
      if (y == null) {
        return;
      }
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 24), animated: true });
    });
  }, []);

  const isValidAge = (value: string) => {
    const trimmed = value.trim();
    if (!/^\d+$/.test(trimmed)) {
      return false;
    }
    const n = Number(trimmed);
    return Number.isInteger(n) && n >= 1 && n <= 100;
  };

  const registerValidationSchema: Yup.ObjectSchema<RegisterFormValues> = Yup.object({
    fullName: Yup.string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .required('Full Name is required'),
    age: Yup.string()
      .trim()
      .required('Age is required')
      .matches(/^\d+$/, 'Enter a valid age')
      .test('age-range', 'Age must be between 1 and 100', value => isValidAge(value ?? '')),
    gender: Yup.string().trim().required('Gender is required'),
    email: Yup.string()
      .trim()
      .email('Enter a valid email address')
      .required('Email is required'),
    address: Yup.string().trim().ensure(),
    phone: Yup.string()
      .trim()
      .required('Phone number is required')
      .matches(/^\+[1-9]\d{6,14}$/, 'Enter a valid phone number for the selected country'),
  });

  const genderToApiValue = (genderLabel: string) => {
    switch (genderLabel) {
      case 'Male':
        return 1;
      case 'Female':
        return 2;
      case 'Other':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Formik<RegisterFormValues>
        initialValues={{
          fullName: '',
          age: '',
          gender: '',
          email: '',
          address: '',
          phone: '',
        }}
        validationSchema={registerValidationSchema}
        validateOnMount
        validateOnBlur
        validateOnChange
        onSubmit={async values => {
          setLoading(true);
          try {
            const res = await registerApi({
              name: values.fullName.trim(),
              age: Number(values.age),
              gender: genderToApiValue(values.gender.trim()),
              email: values.email.trim(),
              phone: values.phone.trim(),
            });

            if (res.status) {
              navigation.replace('Otp', { phone: values.phone.trim() });
            } else {
              showApiErrorAlert(res.message || 'Registration failed');
            }
          } catch (error: unknown) {
            showApiErrorAlert(error);
          } finally {
            setLoading(false);
          }
        }}>
        {formik => {
          const canSubmit =
            formik.values.fullName.trim().length >= 2 &&
            /^\+[1-9]\d{6,14}$/.test(formik.values.phone.trim()) &&
            formik.values.gender.trim().length > 0 &&
            isValidAge(formik.values.age) &&
            formik.values.email.trim().length > 0 &&
            formik.isValid &&
            !loading;

          return (
            <View style={styles.container}>
              <Image
                source={require('@assets/images/splash_bg.png')}
                style={styles.bg}
                resizeMode="cover"
              />
              <SafeAreaView style={styles.safe} edges={['top']}>
                <View style={styles.scrollContent}>
                  <View style={styles.logoCircle}>
                    <Image source={LogoPng} style={styles.logoPng} resizeMode="contain" />
                  </View>

                  <View style={styles.header}>
                    <Text style={styles.h1}>Create Account</Text>
                    <Text style={styles.h2}>Lets start with your profile</Text>
                  </View>

                  <View style={styles.card}>
                    <KeyboardAvoidingView
                      style={styles.keyboardAvoid}
                      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                      <ScrollView
                        ref={scrollRef}
                        style={styles.scroll}
                        contentContainerStyle={[
                          styles.cardScrollContent,
                          {
                            paddingBottom:
                              keyboardBottomInset > 0
                                ? keyboardBottomInset + 16
                                : Math.max(insets.bottom, 16),
                          },
                        ]}
                        automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
                        keyboardShouldPersistTaps="handled"
                        // keyboardDismissMode="on-drag"
                        nestedScrollEnabled
                        showsVerticalScrollIndicator={keyboardVisible}>
                        <View style={styles.field} onLayout={onFieldLayout('fullName')}>
                          <Text style={styles.fieldLabel}>Full Name</Text>
                          <View style={styles.fieldInputWrap}>
                            <View style={styles.fieldIconCircle}>
                              <UserIcon width={20} height={20} />
                            </View>
                            <TextInput
                              value={formik.values.fullName}
                              onChangeText={formik.handleChange('fullName')}
                              onBlur={formik.handleBlur('fullName')}
                              onFocus={() => scrollToField('fullName')}
                              placeholder="John Doe"
                              placeholderTextColor="rgba(10,20,40,0.35)"
                              style={styles.fieldInput}
                              autoCapitalize="words"
                              autoCorrect={false}
                            />
                          </View>
                          {formik.touched.fullName && formik.errors.fullName ? (
                            <ErrorMessage
                              name="fullName"
                              render={msg => <Text style={styles.errorText}>{msg}</Text>}
                            />
                          ) : null}
                        </View>

                        <View style={styles.field} onLayout={onFieldLayout('age')}>
                          <Text style={styles.fieldLabel}>Age</Text>
                          <View style={styles.fieldInputWrap}>
                            <View style={styles.fieldIconCircle}>
                              <AgeIcon width={20} height={20} />
                            </View>
                            <TextInput
                              value={formik.values.age}
                              onChangeText={text => {
                                formik.setFieldValue('age', text.replace(/\D/g, '').slice(0, 3));
                              }}
                              onBlur={formik.handleBlur('age')}
                              onFocus={() => scrollToField('age')}
                              style={styles.fieldInput}
                              keyboardType="number-pad"
                              placeholder="25"
                              placeholderTextColor="rgba(10,20,40,0.35)"
                              autoCapitalize="none"
                              autoCorrect={false}
                            />
                          </View>
                          {formik.touched.age && formik.errors.age ? (
                            <ErrorMessage
                              name="age"
                              render={msg => <Text style={styles.errorText}>{msg}</Text>}
                            />
                          ) : null}
                        </View>

                        <View style={styles.field} onLayout={onFieldLayout('gender')}>
                          <Text style={styles.fieldLabel}>Gender Identity</Text>
                          <Pressable
                            accessibilityRole="button"
                            onPress={() => {
                              scrollToField('gender');
                              setGenderPickerOpen(true);
                            }}
                            style={styles.fieldInputWrap}>
                            <View style={styles.fieldIconCircle}>
                              <GenderIcon width={20} height={20} />
                            </View>
                            <Text
                              style={[
                                styles.fieldInput,
                                formik.values.gender ? styles.selectText : styles.selectPlaceholder,
                              ]}>
                              {formik.values.gender || 'Select Gender'}
                            </Text>
                            <ChevronDownGreenIcon style={styles.chevIcon} />
                          </Pressable>
                          {formik.touched.gender && formik.errors.gender ? (
                            <ErrorMessage
                              name="gender"
                              render={msg => <Text style={styles.errorText}>{msg}</Text>}
                            />
                          ) : null}
                        </View>

                        <View style={styles.field} onLayout={onFieldLayout('email')}>
                          <Text style={styles.fieldLabel}>Email Address</Text>
                          <View style={styles.fieldInputWrap}>
                            <View style={styles.fieldIconCircle}>
                              <EmailIcon width={20} height={20} />
                            </View>
                            <TextInput
                              value={formik.values.email}
                              onChangeText={formik.handleChange('email')}
                              onBlur={formik.handleBlur('email')}
                              onFocus={() => scrollToField('email')}
                              placeholder="name@example.com"
                              placeholderTextColor="rgba(10,20,40,0.35)"
                              style={styles.fieldInput}
                              keyboardType="email-address"
                              autoCapitalize="none"
                              autoCorrect={false}
                            />
                          </View>
                          {formik.touched.email && formik.errors.email ? (
                            <ErrorMessage
                              name="email"
                              render={msg => <Text style={styles.errorText}>{msg}</Text>}
                            />
                          ) : null}
                        </View>

                        <View style={styles.field} onLayout={onFieldLayout('address')}>
                          <Text style={styles.fieldLabel}>Address</Text>
                          <View style={styles.fieldInputWrap}>
                            <View style={styles.fieldIconCircle}>
                              <LocationIcon width={20} height={20} />
                            </View>
                            <TextInput
                              value={formik.values.address}
                              onChangeText={formik.handleChange('address')}
                              onBlur={formik.handleBlur('address')}
                              onFocus={() => scrollToField('address')}
                              placeholder="Mumbai, India"
                              placeholderTextColor="rgba(10,20,40,0.35)"
                              style={styles.fieldInput}
                              autoCapitalize="sentences"
                              autoCorrect={false}
                            />
                          </View>
                          {formik.touched.address && formik.errors.address ? (
                            <ErrorMessage
                              name="address"
                              render={msg => <Text style={styles.errorText}>{msg}</Text>}
                            />
                          ) : null}
                        </View>

                        <View style={styles.field} onLayout={onFieldLayout('phone')}>
                          <Text style={styles.fieldLabel}>Phone Number</Text>
                          <PhoneNumberField
                            onFocus={() => scrollToField('phone')}
                            onPhoneChange={({ e164, isValid }) => {
                              formik.setFieldValue('phone', e164 ?? '');
                              if (isValid) {
                                formik.setFieldError('phone', undefined);
                              }
                            }}
                          />
                          {formik.touched.phone && formik.errors.phone ? (
                            <ErrorMessage
                              name="phone"
                              render={msg => <Text style={styles.errorText}>{msg}</Text>}
                            />
                          ) : null}
                        </View>

                        <PrimaryButton
                          title="Continue"
                          onPress={() => {
                            formik.setTouched(
                              {
                                fullName: true,
                                age: true,
                                gender: true,
                                email: true,
                                address: true,
                                phone: true,
                              },
                              false,
                            );
                            formik.submitForm();
                          }}
                          disabled={!canSubmit}
                          loading={loading}
                          style={styles.continueBtn}
                          titleStyle={styles.continueText}
                          renderRightAccessory={() => (
                            <View style={styles.continueArrowCircle}>
                              <RightArrow />
                            </View>
                          )}
                        />

                        <Pressable
                          accessibilityRole="button"
                          onPress={() => navigation.replace('Login')}
                          style={styles.bottomLinkRow}>
                          <Text style={styles.bottomLinkText}>
                            Already have an account?{' '}
                            <Text style={styles.bottomLinkStrong}>Login</Text>
                          </Text>
                        </Pressable>
                      </ScrollView>
                    </KeyboardAvoidingView>
                  </View>
                </View>
              </SafeAreaView>

              <Modal
                transparent
                visible={genderPickerOpen}
                animationType="fade"
                onRequestClose={() => setGenderPickerOpen(false)}>
                <Pressable
                  style={styles.modalOverlay}
                  onPress={() => setGenderPickerOpen(false)}>
                  <Pressable style={styles.modalSheet} onPress={() => { }}>
                    <Text style={styles.modalTitle}>Select Gender</Text>

                    {(['Male', 'Female', 'Other'] as const).map(option => (
                      <Pressable
                        key={option}
                        accessibilityRole="button"
                        style={styles.modalOption}
                        onPress={() => {
                          formik.setFieldValue('gender', option);
                          formik.setFieldTouched('gender', true, false);
                          setGenderPickerOpen(false);
                        }}>
                        <Text style={styles.modalOptionText}>{option}</Text>
                      </Pressable>
                    ))}
                  </Pressable>
                </Pressable>
              </Modal>
            </View>
          );
        }}
      </Formik>
    </TouchableWithoutFeedback>
  );
}
