import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/screens/Dashboard/tabs/Home/navigation/types';
import { HomeTab } from '@/screens/Dashboard/tabs/Home/screens/Home/HomeTab';
import { LearnScreen } from '@/screens/Dashboard/tabs/Home/screens/Learn/LearnScreen';
import { MetabolicSyndromeQuizScreen } from '@/screens/Dashboard/tabs/Home/screens/Quiz/MetabolicSyndromeQuizScreen';
import { DailyHealthLogScreen } from '@/screens/Dashboard/tabs/Home/screens/Log/DailyHealthLogScreen';
import { AnalyzeScreen } from '@/screens/Dashboard/tabs/Home/screens/Analyze/AnalyzeScreen';
import { FunQuiz } from '@/screens/Dashboard/tabs/Home/screens/FunQuiz/FunQuiz';

const Stack = createNativeStackNavigator<HomeStackParamList>();

export function HomeNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeTab} />
      <Stack.Screen name="Learn" component={LearnScreen} />
      <Stack.Screen name="MetabolicSyndromeQuiz" component={MetabolicSyndromeQuizScreen} />
      <Stack.Screen name="DailyHealthLog" component={DailyHealthLogScreen} />
      <Stack.Screen name="Analyze" component={AnalyzeScreen} />
      <Stack.Screen name="FunQuiz" component={FunQuiz} />
    </Stack.Navigator>
  );
}

