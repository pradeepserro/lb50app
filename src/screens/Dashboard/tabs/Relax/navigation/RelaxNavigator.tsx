import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RelaxStackParamList } from '@/screens/Dashboard/tabs/Relax/navigation/types';
import { RelaxTab } from '@/screens/Dashboard/tabs/Relax/screens/RelaxTab';

const Stack = createNativeStackNavigator<RelaxStackParamList>();

export function RelaxNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Relax" component={RelaxTab} />
    </Stack.Navigator>
  );
}
