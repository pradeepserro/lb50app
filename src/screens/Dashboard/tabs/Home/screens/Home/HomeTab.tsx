import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CompositeNavigationProp } from '@react-navigation/native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Linking, Pressable, ScrollView, Text, View } from 'react-native';
import BookGreenIcon from '@assets/icons/book_green.svg';
import CalendarGreenIcon from '@assets/icons/calendar_green.svg';
import LineIcon from '@assets/icons/line.svg';
import LogoPng from '@assets/icons/logo.png';
import EatTabIcon from '@assets/icons/reserve.svg';
import ShopIcon from '@assets/icons/shop.svg';
import StatusUpGreenIcon from '@assets/icons/statusup_green.svg';
import TimerYellowIcon from '@assets/icons/timer_yellow.svg';
import RelaxIcon from '@assets/icons/relax.svg';
import { fetchHomeApi } from '@/api/home/homeEndpoints';
import { ActionRing } from '@/components/ActionRing/ActionRing';
import {
  formatFastCurrentTime,
  parseApiDateTime,
} from '@/components/DateTimePickerFlow/dateTimeUtils';
import {
  useRingStyles,
  type RingBubblePlacement,
} from '@/components/ActionRing/ActionRing.styles';
import { PrimaryButtonLeft } from '@/components/PrimaryButtonLeft';
import { StatusCard } from '@/components/StatusCard/StatusCard';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { useDashboardTabBarInset } from '@/components/screenLayout/dashboardLayout';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import type { DashboardTabParamList } from '@/screens/Dashboard/DashboardTabs';
import type { HomeStackParamList } from '@/screens/Dashboard/tabs/Home/navigation/types';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import { styles } from '@/screens/Dashboard/tabs/Home/screens/Home/HomeTab.styles';

const EMPTY_FAST_TIME = { time: '', period: '' };

function FastTimeValue({
  date,
  period = '--:--',
}: {
  date?: string;
  period?: string;
}) {
  console.log('🚀 ~ FastTimeValue ~ date:', date);

  const displayValue =
    !period || period === '--' || period === '--:--' ? '--:--' : period;

  const match = displayValue.match(/^(.+?)\s*([AP]M)$/i);

  const time = match?.[1] ?? displayValue;
  const meridiem = match?.[2] ?? '';

  return (
    <Text>
      <Text style={styles.fastCurrentValue}>{time}</Text>

      {meridiem ? (
        <Text style={styles.fastCurrentPeriod}> {meridiem}</Text>
      ) : null}
    </Text>
  );
}

type HomeTabNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'HomeMain'>,
  BottomTabNavigationProp<DashboardTabParamList>
>;

export function HomeTab() {
  const navigation = useNavigation<HomeTabNavigationProp>();
  const tabBarInset = useDashboardTabBarInset();
  const { getPlacementStyle, metrics } = useRingStyles();
  const [startFastTime, setStartFastTime] = useState(EMPTY_FAST_TIME);
  const [endFastTime, setEndFastTime] = useState(EMPTY_FAST_TIME);

  const loadHomeData = useCallback(async () => {
    try {
      const data = await fetchHomeApi();
      const startDate = parseApiDateTime(data.start_datetime);
      const endDate = parseApiDateTime(data.end_datetime);

      setStartFastTime(startDate ? formatFastCurrentTime(startDate) : EMPTY_FAST_TIME);
      setEndFastTime(endDate ? formatFastCurrentTime(endDate) : EMPTY_FAST_TIME);
    } catch (error) {
      showApiErrorAlert(error, 'Failed to load home data');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadHomeData();
    }, [loadHomeData]),
  );

  const bubbles = useMemo(
    () =>
      [
        {
          placement: 'top' as RingBubblePlacement,
          label: 'Log',
          icon: (
            <CalendarGreenIcon
              width={metrics.bubbleIconSize}
              height={metrics.bubbleIconSize}
            />
          ),
          isPressable: true,
          onPress: () => navigation.navigate('DailyHealthLog'),
        },
        {
          placement: 'left' as RingBubblePlacement,
          label: 'Analyse',
          icon: (
            <StatusUpGreenIcon
              width={metrics.bubbleIconSize}
              height={metrics.bubbleIconSize}
            />
          ),
          isPressable: true,
          onPress: () => navigation.navigate('Analyze'),
        },
        {
          placement: 'right' as RingBubblePlacement,
          label: 'Learn',
          icon: (
            <BookGreenIcon
              width={metrics.bubbleIconSize}
              height={metrics.bubbleIconSize}
            />
          ),
          isPressable: true,
          onPress: () => navigation.navigate('Learn'),
        },
        {
          placement: 'bottom' as RingBubblePlacement,
          label: 'Relax',
          icon: (
            <RelaxIcon
              width={metrics.bubbleIconSize}
              height={metrics.bubbleIconSize}
            />
          ),
          isPressable: true,
          onPress: () => navigation.navigate('Relax'),
        },
      ],
    [metrics.bubbleIconSize, navigation],
  );

  return (
    <DashboardScreenLayout
      header={
        <View style={[screenHeaderStyles.bar, screenHeaderStyles.header]}>
          <View style={screenHeaderStyles.headerSide}>
            <Image source={LogoPng} style={screenHeaderStyles.headerLogo} resizeMode="contain" />
          </View>
          <Text style={[screenHeaderStyles.headerTitle]}>LB50 Health</Text>
          <Text style={[screenHeaderStyles.headerRight]} />
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: tabBarInset },
        ]}
      >
        {/* Fast current status (top card) */}
        <View style={styles.topSection}>
          <StatusCard
            title='FAST STATUS'
            leftLabel='Start of Fast'
            leftValue={<FastTimeValue date={startFastTime.time} period={startFastTime.period} />}
            rightLabel='End of Fast'
            rightValue={<FastTimeValue date={endFastTime.time} period={endFastTime.period} />}
          />
        </View>

        {/* Ring + action bubbles */}
        <ActionRing
          bubbles={bubbles?.map((b, index) => ({
            key: `${index}`,
            label: b.label,
            icon: b.icon,
            onPress: b.onPress,
            isPressable: b.isPressable,
            style: getPlacementStyle(b.placement, 'home'),
            labelNumberOfLines: 1
          }))}
        >
          <View style={styles.centerColumn}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fast"
              style={[styles.centerHalf, { gap: 6 * metrics.scale }]}
              onPress={() => navigation.navigate('Fast')}
            >
              <TimerYellowIcon
                width={metrics.centerIconSize}
                height={metrics.centerIconSize}
              />
              <Text
                style={[
                  styles.centerTitle,
                  { fontSize: metrics.centerTitleFontSize },
                ]}
              >
                FAST
              </Text>
            </Pressable>

            <LineIcon style={styles.centerDivider} />

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Eat"
              style={[styles.centerHalf, { gap: 6 * metrics.scale }]}
              onPress={() => navigation.navigate('Eat')}
            >
              <EatTabIcon
                width={metrics.centerIconSize}
                height={metrics.centerIconSize}
              />
              <Text
                style={[
                  styles.centerSubtitle,
                  {
                    fontSize: metrics.centerSubtitleFontSize
                  },
                ]}
              >
                EAT
              </Text>
            </Pressable>
          </View>
        </ActionRing>

        {/* Shop button */}
        <View style={styles.shopBtn}>
          <PrimaryButtonLeft
            title={'Shop Now'}
            onPress={() => Linking.openURL('https://lb50.com/#products')}
            // disabled={currentStep === 0 ? true : submitting}
            // loading={submitting}
            style={styles.prevBtn}
            titleStyle={styles.prevBtnText}
            renderLeftAccessory={() => (
              <View style={styles.continueArrowCircleLeft}>
                <ShopIcon width={15} height={15} />
              </View>
            )}
          />
        </View>
      </ScrollView>
    </DashboardScreenLayout>
  );
}
