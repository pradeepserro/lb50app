import type { NavigatorScreenParams } from '@react-navigation/native';
import type { AuthStackParamList } from '@/screens/Auth/navigation/types';

export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList> | undefined;
  Questionnaire: undefined;
  Dashboard: undefined;
};

