import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '@/screens/Dashboard/tabs/Profile/navigation/types';
import { ProfileTab } from '@/screens/Dashboard/tabs/Profile/ProfileTab';
import { CreateTicket } from '@/screens/Dashboard/tabs/Profile/screens/CreateTicket/CreateTicket';
import { DescribeIssue } from '@/screens/Dashboard/tabs/Profile/screens/DescribeIssue/DescribeIssue';
import { TicketDetails } from '@/screens/Dashboard/tabs/Profile/screens/TicketDetails/TicketDetails';
import { Tickets } from '@/screens/Dashboard/tabs/Profile/screens/Tickets/Tickets';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileTab} />
      <Stack.Screen name="Tickets" component={Tickets} />
      <Stack.Screen name="TicketDetails" component={TicketDetails} />
      <Stack.Screen name="CreateTicket" component={CreateTicket} />
      <Stack.Screen name="DescribeIssue" component={DescribeIssue} />
    </Stack.Navigator>
  );
}
