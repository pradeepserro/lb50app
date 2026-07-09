import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { SplashScreen } from '@/screens/Splash/SplashScreen';
import { AuthNavigator } from '@/screens/Auth/navigation/AuthNavigator';
import { IntroScreen } from '@/screens/Intro/IntroScreen';
import { QuestionnaireNavigator } from '@/screens/Questionnaire/navigation/QuestionnaireNavigator';
import { DashboardTabs } from '@/screens/Dashboard/DashboardTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Intro" component={IntroScreen} />
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="Questionnaire" component={QuestionnaireNavigator} />
      <Stack.Screen name="Dashboard" component={DashboardTabs} />
    </Stack.Navigator>
  );
}

