import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/screens/Auth/navigation/types';
import { Colors } from '@/theme/colors';
import { PrimaryButton } from '@/components/PrimaryButton';
import { styles } from '@/screens/Auth/screens/ForgotPassword/ForgotPasswordScreen.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => email.trim().length > 0 && !loading, [email, loading]);

  const onSendOtp = async () => {
    setLoading(true);
    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
      navigation.navigate('Otp', { email: email.trim() });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.safe}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}>
              <Text style={styles.back}>Back</Text>
            </Pressable>
          </View>

          <View style={styles.header}>
            <Text style={styles.h1}>Forgot password</Text>
            <Text style={styles.h2}>We’ll send an OTP to your email</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />

            <PrimaryButton
              title="Send OTP"
              onPress={onSendOtp}
              disabled={!canSubmit}
              loading={loading}
              style={styles.submitButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
