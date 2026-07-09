export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Otp: { phone?: string; email?: string };
  ResetPassword: { email: string; otp: string };
};

