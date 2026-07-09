import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '@/screens/Auth/navigation/types';
import { LoginScreen } from '@/screens/Auth/screens/Login/LoginScreen';
import { RegisterScreen } from '@/screens/Auth/screens/Register/RegisterScreen';
import { ForgotPasswordScreen } from '@/screens/Auth/screens/ForgotPassword/ForgotPasswordScreen';
import { OtpScreen } from '@/screens/Auth/screens/Otp/OtpScreen';
import { ResetPasswordScreen } from '@/screens/Auth/screens/ResetPassword/ResetPasswordScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="Otp" component={OtpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

