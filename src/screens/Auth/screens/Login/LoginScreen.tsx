import React, { useMemo, useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/screens/Auth/navigation/types';
import { styles } from '@/screens/Auth/screens/Login/LoginScreen.styles';
import LogoPng from '@assets/icons/logo.png';
import RightArrow from '@assets/icons/right_arrow_white.svg';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PhoneNumberField } from '@/components/PhoneNumberField/PhoneNumberField';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { loginApi } from '@/api/auth/authEndpoints';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import * as Yup from 'yup';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export function LoginScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const [phoneE164, setPhoneE164] = useState<string | null>(null);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return Boolean(phoneE164) && isPhoneValid && !loading;
  }, [phoneE164, isPhoneValid, loading]);


  const onContinue = async () => {
    try {
      await phoneSchema.validate({ phone: phoneE164 });
      if (!phoneE164) {
        return;
      }
      setLoading(true);

      const res = await loginApi({
        phone: phoneE164,
      });

      if (res.status) {
        navigation.replace('Otp', {
          phone: phoneE164,
        });
      } else {
        showApiErrorAlert(res.message || 'Login failed');
      }

    } catch (err: any) {
      if (err.name === 'ValidationError') {
        showApiErrorAlert(err, 'Invalid Phone');
        return;
      }

      showApiErrorAlert(err);
    } finally {
      setLoading(false);
    }
  };

  const phoneSchema = Yup.object().shape({
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^\+[1-9]\d{6,14}$/, 'Enter a valid phone number for the selected country'),
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
              <Text style={styles.h1}>Welcome Back</Text>
              <Text style={styles.h2}>
                Enter your phone number to continue{'\n'}your health journey.
              </Text>
            </View>

            <View style={styles.card}>
              <View style={styles.cardBody}>
                <View style={styles.field}>
                  <Text style={styles.fieldLabel}>Phone Number</Text>
                  <PhoneNumberField
                    onPhoneChange={({ e164, isValid }) => {
                      setPhoneE164(e164);
                      setIsPhoneValid(isValid);
                    }}
                  />
                </View>
              </View>

              <View
                style={[styles.cardFooter, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <PrimaryButton
                  title="Continue"
                  onPress={onContinue}
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
                  onPress={() => navigation.replace('Register')}
                  style={styles.bottomLinkRow}>
                  <Text style={styles.bottomLinkText}>
                    Don’t have an account? <Text style={styles.bottomLinkStrong}>Sign Up</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
