import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DASHBOARD_TAB_BAR_HEIGHT } from '@/components/screenLayout/dashboardLayout';
import { Colors } from '@/theme/colors';
import { HomeNavigator } from '@/screens/Dashboard/tabs/Home/navigation/HomeNavigator';
import { FastingTab } from '@/screens/Dashboard/tabs/Fasting/FastingTab';
import { EatTab } from '@/screens/Dashboard/tabs/Eat/EatTab';
import HomeIcon from '@assets/icons/home_tab.svg';
import FastingIcon from '@assets/icons/tasting_tab.svg';
import EatIcon from '@assets/icons/eat_tab.svg';
import RelaxIcon from '@assets/icons/relax_tab.svg';
import ProfileIcon from '@assets/icons/profile_tab.svg';
import { RelaxNavigator } from '@/screens/Dashboard/tabs/Relax/navigation/RelaxNavigator';
import { ProfileTab } from '@/screens/Dashboard/tabs/Profile/ProfileTab';
import { Fonts } from '@/utils/fonts';

export type DashboardTabParamList = {
  Home: undefined;
  Fast: undefined;
  Eat: undefined;
  Relax: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<DashboardTabParamList>();

const styles = StyleSheet.create({
  root: { flex: 1 },
  tabBarButton: {
    flex: 1,
    marginHorizontal: 6,
    marginVertical: 0,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

const getTabBarIcon = (routeName: string, color: string) => {
  const props = { width: 22, height: 22, color };
  switch (routeName) {
    case 'Home':
      return <HomeIcon {...props} />;
    case 'Fast':
      return <FastingIcon {...props} />;
    case 'Eat':
      return <EatIcon {...props} />;
    case 'Relax':
      return <RelaxIcon {...props} />;
    case 'Profile':
      return <ProfileIcon {...props} />;
    default:
      return null;
  }
};

type TabBarButtonProps = {
  children: React.ReactNode;
  onPress: () => void;
  focused: boolean;
};

const TabBarButton = React.memo(
  ({ children, onPress, focused }: TabBarButtonProps) => (
    <Pressable
      onPress={onPress}
      style={[styles.tabBarButton, focused && { backgroundColor: Colors.gray }]}
    >
      {children}
    </Pressable>
  ),
);

TabBarButton.displayName = 'TabBarButton';

export function DashboardTabs() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <Image
        source={require('@assets/images/splash_bg.png')}
        style={StyleSheet.absoluteFill}
        resizeMode="contain"
      />

      <Tab.Navigator
        detachInactiveScreens={false}
        screenOptions={({ route, navigation }) => {
          const state = navigation.getState();
          const activeRoute = state.routes[state.index].name;
          const focused = activeRoute === route.name;

          return {
            headerShown: false,
            lazy: false,
            freezeOnBlur: false,
            tabBarActiveTintColor: Colors.darkBlue,
            tabBarInactiveTintColor: Colors.titleTextColorGray,
            // tabBarActiveBackgroundColor: Colors.black,
            // tabBarInactiveBackgroundColor: 'transparent',

            tabBarButton: (buttonProps: any) => (
              <TabBarButton onPress={buttonProps.onPress} focused={focused}>
                {buttonProps.children}
              </TabBarButton>
            ),

            tabBarIcon: ({ color }) => getTabBarIcon(route.name, color),
            tabBarStyle: {
              backgroundColor: Colors.white,
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
              height: DASHBOARD_TAB_BAR_HEIGHT + insets.bottom,
              paddingTop: 8,
              paddingBottom: 10 + insets.bottom,
              position: 'absolute',
              borderTopWidth: 0,
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 10 },
              elevation: 10,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '400',
              fontFamily: Fonts.PoppinsRegular
            },
          };
        }}
      >
        <Tab.Screen name="Home" component={HomeNavigator} />
        <Tab.Screen name="Fast" component={FastingTab} />
        <Tab.Screen name="Eat" component={EatTab} />
        <Tab.Screen name="Relax" component={RelaxNavigator} />
        <Tab.Screen name="Profile" component={ProfileTab} />
      </Tab.Navigator>
    </View>
  );
}
