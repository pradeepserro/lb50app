import React, { type ReactNode } from 'react';
import { Image, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets, type Edge } from 'react-native-safe-area-context';
import { dashboardScreenLayoutStyles } from '@/components/screenLayout/DashboardScreenLayout.styles';

const SPLASH_BG = require('@assets/images/splash_bg.png');

type Props = {
  header: ReactNode;
  children: ReactNode;
  bgResizeMode?: 'contain' | 'cover';
  containerStyle?: StyleProp<ViewStyle>;
  safeAreaEdges?: Edge[];
};

export function DashboardScreenLayout({
  header,
  children,
  bgResizeMode = 'cover',
  containerStyle,
  safeAreaEdges = ['top'],
}: Props) {
  const insets = useSafeAreaInsets();
  const paddingTop = safeAreaEdges.includes('top') ? insets.top : 0;
  const paddingBottom = safeAreaEdges.includes('bottom') ? insets.bottom : 0;

  return (
    <View style={dashboardScreenLayoutStyles.root}>
      <View style={dashboardScreenLayoutStyles.bgWrap} pointerEvents="none">
        <Image
          source={SPLASH_BG}
          style={dashboardScreenLayoutStyles.bg}
          resizeMode={bgResizeMode}
        />
      </View>
      <View
        style={[
          dashboardScreenLayoutStyles.container,
          { paddingTop, paddingBottom },
          containerStyle,
        ]}
      >
        <View style={dashboardScreenLayoutStyles.header}>{header}</View>
        <View style={dashboardScreenLayoutStyles.content}>{children}</View>
      </View>
    </View>
  );
}
