import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { QuestionnaireStackParamList } from '@/screens/Questionnaire/navigation/types';
import { QuestionnaireScreen } from '@/screens/Questionnaire/screens/Main/QuestionnaireScreen';

const Stack = createNativeStackNavigator<QuestionnaireStackParamList>();

export function QuestionnaireNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={QuestionnaireScreen} />
    </Stack.Navigator>
  );
}
