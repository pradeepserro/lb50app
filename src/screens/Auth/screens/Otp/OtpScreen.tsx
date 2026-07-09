import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/screens/Auth/navigation/types';
import { styles } from '@/screens/Auth/screens/Otp/OtpScreen.styles';
import LogoPng from '@assets/icons/logo.png';
import RightArrow from '@assets/icons/right_arrow_white.svg';
import { PrimaryButton } from '@/components/PrimaryButton';
import ClockIcon from '@assets/icons/clock.svg';
import { verifyOtpApi } from '@/api/auth/authEndpoints';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import {
  getQuestionnaireCompleted,
  setAuthToken,
  setHasOnboarded,
  setQuestionnaireCompleted,
} from '@/utils/storage';

type Props = NativeStackScreenProps<AuthStackParamList, 'Otp'>;

export function OtpScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { phone, email } = route.params;
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(119);
  const inputRef = useRef<TextInput | null>(null);

  const canSubmit = useMemo(() => otp.trim().length === 6 && !loading, [otp, loading]);

  const focusOtpInput = () => {
    // After the keyboard is dismissed, focusing immediately can be flaky on iOS/Android.
    // A tiny delay makes it reliably reopen every time.
    setTimeout(() => inputRef.current?.focus(), 10);
  };

  useEffect(() => {
    const t = setTimeout(() => focusOtpInput(), 150);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const onVerify = async () => {
    if (!canSubmit) return;

    setLoading(true);
    try {
      const res = await verifyOtpApi({
        phone,
        otp,
      });

      if (res.status) {
        const token = res.token;
        await setAuthToken(token);
        await setHasOnboarded(true);
        if (email) {
          navigation.navigate('ResetPassword', { email, otp });
        } else {
          const questionnaireCompleted =
            res.user != null
              ? res.user.survey_completed === 1
              : await getQuestionnaireCompleted();

          if (res.user != null) {
            await setQuestionnaireCompleted(questionnaireCompleted);
          }

          const rootNav = navigation.getParent();
          rootNav?.reset({
            index: 0,
            routes: [
              {
                name: (questionnaireCompleted ? 'Dashboard' : 'Questionnaire') as never,
              },
            ],
          });
        }
      } else {
        showApiErrorAlert(res.message || 'Verification failed');
      }
    } catch (error: unknown) {
      showApiErrorAlert(error);
    } finally {
      setLoading(false);
    }
  };

  const onChangeOtp = (value: string) => {
    const next = value.replace(/\D/g, '').slice(0, 6);
    setOtp(next);
  };

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.safe}>
        <View style={styles.container}>
          <Image
            source={require('@assets/images/splash_bg.png')}
            style={styles.bg}
            resizeMode="cover"
          />

          <View style={styles.scrollContent}>
            <View style={styles.logoCircle}>
              <Image source={LogoPng} style={styles.logoPng} resizeMode="contain" />
            </View>

            <View style={styles.header}>
              <Text style={styles.h1}>Verify Identity</Text>
              <Text style={styles.h2}>
                We've sent a 6 digit verification code to you EMAIL address.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardBody}>
                <Pressable
                  accessibilityRole="button"
                  onPress={focusOtpInput}
                  onPressIn={focusOtpInput}
                  style={styles.otpWrap}>
                  <View style={styles.otpRow}>
                    {Array.from({ length: 6 }).map((_, i) => {
                      const filled = i < otp.length;
                      const isActive = i === otp.length && otp.length < 6;
                      return (
                        <View
                          key={i}
                          style={[
                            styles.otpCell,
                            isActive ? styles.otpCellActive : null,
                            filled ? styles.otpCellFilled : null,
                          ]}>
                          <Text style={styles.otpDot}>{filled ? '•' : ''}</Text>
                        </View>
                      );
                    })}
                  </View>

                  <TextInput
                    ref={r => {
                      inputRef.current = r;
                    }}
                    value={otp}
                    onChangeText={onChangeOtp}
                    keyboardType="number-pad"
                    textContentType="oneTimeCode"
                    autoComplete="sms-otp"
                    maxLength={6}
                    showSoftInputOnFocus
                    style={styles.otpHiddenInput}
                  />
                </Pressable>

                <View style={styles.resendWrap}>
                  <View style={styles.resendTimerRow}>
                    <ClockIcon width={16} height={16} />
                    <Text style={styles.resendLine}>
                      Resend code in <Text style={styles.resendTime}>{mm}:{ss}</Text>
                    </Text>
                  </View>

                  <Pressable
                    accessibilityRole="button"
                    disabled={secondsLeft > 0}
                    onPress={() => setSecondsLeft(119)}>
                    <Text
                      style={[styles.resendSms, secondsLeft > 0 ? styles.resendSmsDisabled : null]}>
                      Resend via Email
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View
                style={[styles.cardFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <PrimaryButton
                  title="Verify & Continue"
                  onPress={onVerify}
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
                    Having trouble? <Text style={styles.bottomLinkStrong}>Contact Support</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
