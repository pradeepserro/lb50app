import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { fetchFastHoursApi, saveFastApi } from '@/api/fast/fastEndpoints';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import ClockRedIcon from '@assets/icons/clock_red.svg';
import EditWhiteIcon from '@assets/icons/edit_white.svg';
import LeftArrow from '@assets/icons/left_arrow_white.svg';
import LogoPng from '@assets/icons/logo.png';
import SaveIcon from '@assets/icons/save_white.svg';
import { DateTimePickerFlow } from '@/components/DateTimePickerFlow/DateTimePickerFlow';
import {
  createDefaultStartTime,
  formatApiDateTime,
  formatStartDate,
  formatStartTime,
} from '@/components/DateTimePickerFlow/dateTimeUtils';
import type { DashboardTabParamList } from '@/screens/Dashboard/DashboardTabs';
import { PrimaryButtonLeft } from '@/components/PrimaryButtonLeft';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { styles, useFastingTabMetrics } from '@/screens/Dashboard/tabs/Fasting/FastingTab.styles';
import { Colors } from '@/theme/colors';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';

function parseFastHours(hours: string): number[] {
  return hours
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value) && value > 0);
}

export function FastingTab() {
  const navigation = useNavigation<BottomTabNavigationProp<DashboardTabParamList>>();
  const metrics = useFastingTabMetrics();
  const [protocols, setProtocols] = useState<number[]>([14, 16, 18, 20, 24, 36]);
  const [selected, setSelected] = useState<number>(16);
  const [startTime, setStartTime] = useState(createDefaultStartTime);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadFastHours = useCallback(async () => {
    try {
      const data = await fetchFastHoursApi();
      const hours = parseFastHours(data.hours);
      if (hours.length > 0) {
        setProtocols(hours);
        setSelected((current) => (hours.includes(current) ? current : hours[0]));
      }
    } catch (error) {
      showApiErrorAlert(error, 'Failed to load fast hours');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setStartTime(createDefaultStartTime());
      loadFastHours();
    }, [loadFastHours]),
  );

  const handleCancel = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await saveFastApi({
        start_datetime: formatApiDateTime(startTime),
        hours: selected,
      });
      navigation.navigate('Home');
    } catch (error) {
      showApiErrorAlert(error, 'Failed to save fast');
    } finally {
      setSaving(false);
    }
  }, [navigation, selected, startTime]);

  return (
    <DashboardScreenLayout
      header={
        <View style={[screenHeaderStyles.bar, screenHeaderStyles.header]}>
          <View style={screenHeaderStyles.headerSide}>
            <ScreenHeaderBackButton
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
            />
            <Image source={LogoPng} style={screenHeaderStyles.headerLogo} resizeMode="contain" />
          </View>

          <Text style={[screenHeaderStyles.headerTitle]}>Fast Info</Text>
          <Text style={[screenHeaderStyles.headerRight]} />
        </View>
      }
    >
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          {
            minHeight: metrics.scrollMinHeight,
            paddingBottom: metrics.tabBarInset,
          },
        ]}
      >
        <View style={styles.scrollBody}>
          <Text style={styles.sectionLabel}>START TIME</Text>

          <View style={styles.startCard}>
            <View style={styles.startIconWrap}>
              <ClockRedIcon width={18} height={18} />
            </View>

            <View style={styles.startInfo}>
              <Text style={styles.startDate}>{formatStartDate(startTime)}</Text>
              <Text style={styles.startTime}>{formatStartTime(startTime)}</Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Edit start date and time"
              style={styles.editBtn}
              onPress={() => setPickerVisible(true)}
            >
              <EditWhiteIcon width={14} height={14} />
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>SELECT PROTOCOL</Text>

          <View style={styles.protocolGrid}>
            {protocols.map(p => {
              const active = p === selected;
              return (
                <Pressable
                  key={p}
                  accessibilityRole="button"
                  onPress={() => setSelected(p)}
                  style={[
                    styles.protocolCard,
                    active ? styles.protocolCardActive : null,
                  ]}
                >
                  {active ? (
                    <View style={styles.protocolCheck}>
                      <Text style={styles.protocolCheckText}>✓</Text>
                    </View>
                  ) : null}
                  <Text
                    style={[
                      styles.protocolHours,
                      active ? styles.protocolHoursActive : null,
                    ]}
                  >
                    {p}
                  </Text>
                  <Text
                    style={[
                      styles.protocolHrs,
                      active ? styles.protocolHrsActive : null,
                    ]}
                  >
                    HRS
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View
            style={[
              styles.footer,
              {
                gap: metrics.footerGap,
                paddingTop: metrics.footerPaddingTop,
              },
            ]}
          >
            <PrimaryButtonLeft
              title={'Cancel'}
              onPress={handleCancel}
              disabled={saving}
              style={styles.prevBtn}
              titleStyle={styles.prevBtnText}
              renderLeftAccessory={() => (
                <View style={styles.continueArrowCircleLeft}>
                  <LeftArrow width={14} height={14} />
                </View>
              )}
            />

            <PrimaryButton
              title={'Save'}
              onPress={handleSave}
              loading={saving}
              style={styles.continueBtn}
              titleStyle={styles.continueText}
              renderRightAccessory={({ loading }) => (
                <View style={styles.continueArrowCircle}>
                  {loading ? (
                    <ActivityIndicator size="small" color={Colors.white} />
                  ) : (
                    <SaveIcon width={14} height={14} />
                  )}
                </View>
              )}
            />
          </View>
        </View>
      </ScrollView>

      <DateTimePickerFlow
        visible={pickerVisible}
        value={startTime}
        flow="date-time"
        onChange={setStartTime}
        onClose={() => setPickerVisible(false)}
      />
    </DashboardScreenLayout>
  );
}
