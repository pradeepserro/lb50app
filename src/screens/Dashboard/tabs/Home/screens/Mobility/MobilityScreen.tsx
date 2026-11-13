import React, { useMemo } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import LogoPng from '@assets/icons/logo.png';
import ExerciseIcon from '@assets/icons/exercise.svg';
import { ActionRing, type ActionRingBubble } from '@/components/ActionRing/ActionRing';
import { useRingStyles } from '@/components/ActionRing/ActionRing.styles';
import { StatusCard } from '@/components/StatusCard/StatusCard';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { styles } from './MobilityScreen.styles';

const sections = ['Joints', 'Upper Body', 'Core', 'Lower Body'] as const;
export function MobilityScreen({ navigation }: { navigation: any }) {
  const { getEvenBubblePlacementStyle, metrics } = useRingStyles();
  const bubbles: ActionRingBubble[] = useMemo(() => sections.map((label, index) => ({
    key: label,
    label: label === 'Upper Body' ? 'Upper\nBody' : label === 'Lower Body' ? 'Lower\nBody' : label,
    icon: <ExerciseIcon width={metrics.bubbleIconSize} height={metrics.bubbleIconSize} />,
    isPressable: true,
    onPress: () => navigation.navigate('MobilityCategory', { category: label }),
    style: getEvenBubblePlacementStyle(index, sections.length),
  })), [getEvenBubblePlacementStyle, metrics.bubbleIconSize, navigation]);
  return (
    <DashboardScreenLayout header={<View style={[screenHeaderStyles.bar, screenHeaderStyles.header]}>
      <View style={screenHeaderStyles.headerSide}>
        <ScreenHeaderBackButton onPress={() => navigation.goBack()} />
        <Image source={LogoPng} style={screenHeaderStyles.headerLogo} resizeMode="contain" />
      </View>
      <Text style={screenHeaderStyles.headerTitle}>Mobility</Text>
      <Text style={screenHeaderStyles.headerRight} />
    </View>}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <StatusCard title="MOBILITY STATUS" leftLabel="Mobility Score" leftValue="--" rightLabel="Exercises Completed" rightValue="--" />
        <View style={styles.ringSection}>
          <ActionRing bubbles={bubbles}>
            <View style={styles.center}>
              <ExerciseIcon width={Math.round(30 * metrics.scale)} height={Math.round(30 * metrics.scale)} />
              <Text style={styles.centerText}>MOBILITY</Text>
            </View>
          </ActionRing>
        </View>
      </ScrollView>
    </DashboardScreenLayout>
  );
}
