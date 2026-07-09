import React, { useMemo, useState } from 'react';
import {
  Alert,
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
import { styles } from '@/screens/Auth/screens/ResetPassword/ResetPasswordScreen.styles';

type Props = NativeStackScreenProps<AuthStackParamList, 'ResetPassword'>;

export function ResetPasswordScreen({ navigation, route }: Props) {
  const { email, otp } = route.params;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return password.length >= 4 && confirm === password && !loading;
  }, [password, confirm, loading]);

  const onReset = async () => {
    setLoading(true);
    try {
      await new Promise<void>(resolve => setTimeout(() => resolve(), 600));
      Alert.alert('Password reset', `Email: ${email}\nOTP: ${otp}`);
      navigation.popToTop();
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
            <Text style={styles.h1}>Reset password</Text>
            <Text style={styles.h2}>Choose a new password for {email}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.label}>New password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••"
              placeholderTextColor={Colors.muted}
              secureTextEntry
              style={styles.input}
            />

            <Text style={[styles.label, styles.confirmLabel]}>Confirm password</Text>
            <TextInput
              value={confirm}
              onChangeText={setConfirm}
              placeholder="••••"
              placeholderTextColor={Colors.muted}
              secureTextEntry
              style={styles.input}
            />

            <PrimaryButton
              title="Update password"
              onPress={onReset}
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
