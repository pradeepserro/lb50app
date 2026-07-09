import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import ActivityGreenIcon from '@assets/icons/activity_green.svg';
import LogoPng from '@assets/icons/logo.png';
import PersonActiveIcon from '@assets/icons/person_active.svg';
import HappyEmojiIcon from '@assets/icons/emoji_happy.svg';
import HeartCircleIcon from '@assets/icons/heart_circle.svg';
import UnionIcon from '@assets/icons/Union.svg';
import MusicPlayIcon from '@assets/icons/music_play.svg';
import WindIcon from '@assets/icons/wind.svg';
import type { RelaxTypeId } from '@/api/relax/relax';
import { fetchRelaxApi, saveRelaxApi } from '@/api/relax/relaxEndpoints';
import { ActionRing, type ActionRingBubble } from '@/components/ActionRing/ActionRing';
import { useRingStyles } from '@/components/ActionRing/ActionRing.styles';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { StatusCard } from '@/components/StatusCard/StatusCard';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import { styles } from '@/screens/Dashboard/tabs/Relax/screens/RelaxTab.styles';
import { RELAX_TOPICS } from '@/screens/Dashboard/tabs/Relax/screens/relaxTopics';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';

const TOPIC_ICONS = [
  ActivityGreenIcon,
  MusicPlayIcon,
  WindIcon,
  HappyEmojiIcon,
  HeartCircleIcon,
  UnionIcon,
] as const;

export function RelaxTab({ navigation }: { navigation: any }) {
  const isFocused = useIsFocused();
  const { getSixBubblePlacementStyle, metrics } = useRingStyles();
  const BREAK_TIMES: number[] = [10, 15, 20];
  const [selectedBreakIndex, setSelectedBreakIndex] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(BREAK_TIMES[0] * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [relaxScore, setRelaxScore] = useState<string>('--');
  const [savingRelax, setSavingRelax] = useState(false);
  const savingRelaxRef = useRef(false);

  const loadRelaxData = useCallback(async () => {
    try {
      const data = await fetchRelaxApi();
      setRelaxScore(data.relax_score);
    } catch (error) {
      showApiErrorAlert(error, 'Failed to load relax data');
    }
  }, []);

  const formattedTime = useMemo<string>(() => {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      seconds,
    ).padStart(2, '0')}`;
  }, [remainingSeconds]);

  const currentBreakTime: number = BREAK_TIMES[selectedBreakIndex] ?? 10;

  useFocusEffect(
    useCallback(() => {
      loadRelaxData();
    }, [loadRelaxData]),
  );

  useEffect(() => {
    setRemainingSeconds(currentBreakTime * 60);
    setIsTimerRunning(false);
  }, [currentBreakTime]);

  useEffect(() => {
    if (!isFocused || !isTimerRunning) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((prev: number) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocused, isTimerRunning]);

  const handleChangeBreakTime = () => {
    setSelectedBreakIndex((prev) => {
      if (prev === BREAK_TIMES.length - 1) {
        return 0;
      }

      return prev + 1;
    });
  };
  const handleTopicSelect = useCallback(
    async (typeId: RelaxTypeId) => {
      if (savingRelaxRef.current) {
        return;
      }

      savingRelaxRef.current = true;
      setSavingRelax(true);
      try {
        await saveRelaxApi({ type_id: typeId, duration: currentBreakTime });
        await loadRelaxData();
        setRemainingSeconds(currentBreakTime * 60);
        setIsTimerRunning(true);
      } catch (error) {
        showApiErrorAlert(error, 'Failed to save relax details');
      } finally {
        savingRelaxRef.current = false;
        setSavingRelax(false);
      }
    },
    [currentBreakTime, loadRelaxData],
  );

  const actionRingBubbles: ActionRingBubble[] = useMemo(
    () =>
      RELAX_TOPICS.map((topic, index) => {
        const Icon = TOPIC_ICONS[index];

        return {
          key: `relax-ring-${topic.id}-${topic.label}`,
          label: topic.label,
          icon: (
            <Icon
              width={metrics.bubbleIconSize}
              height={metrics.bubbleIconSize}
            />
          ),
          onPress: () => handleTopicSelect(topic.id),
          isPressable: true,
          style: getSixBubblePlacementStyle(index),
        };
      }),
    [getSixBubblePlacementStyle, handleTopicSelect, metrics.bubbleIconSize],
  );

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
          <View style={screenHeaderStyles.headerCenter}>
            <Text style={screenHeaderStyles.headerTitle}>Relax</Text>
            {/* <Text style={screenHeaderStyles.headerDescription}>{formattedTime}</Text> */}
          </View>
          <View style={[screenHeaderStyles.headerSide, styles.headerSideRight]}>
            {/* <Pressable accessibilityRole="button" style={styles.headerPlus} onPress={() => { }}>
              <Text style={styles.headerPlusText}>+</Text>
            </Pressable> */}
          </View>
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.scrollBody}>
          <View style={styles.topSection}>
            <StatusCard
              title='RELAX STATUS'
              leftLabel='Relax Score'
              leftValue={relaxScore}
              rightLabel='Relax Duration'
              rightValue={
                <Text style={styles.durationTimer}>{formattedTime}</Text>
              }
            />
          </View>

          <View style={styles.ringSection}>
            <ActionRing bubbles={actionRingBubbles}>
              <PersonActiveIcon
                width={Math.round(24 * metrics.scale)}
                height={Math.round(32 * metrics.scale)}
              />

              <Text
                style={[
                  styles.centerTitle,
                  {
                    fontSize: metrics.centerTitleFontSize,
                    marginTop: 4 * metrics.scale,
                  },
                ]}
              >
                BREAK TIME
              </Text>

              <Text
                style={[
                  styles.centerSub,
                  {
                    fontSize: metrics.centerSubtitleFontSize,
                    marginTop: 4 * metrics.scale,
                  },
                ]}
              >
                {currentBreakTime} MIN
              </Text>

              <Pressable
                accessibilityRole="button"
                onPress={handleChangeBreakTime}
                style={[
                  styles.changeButton,
                  {
                    marginTop: 8 * metrics.scale,
                    paddingHorizontal: 12 * metrics.scale,
                    paddingVertical: 6 * metrics.scale,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.changeButtonText,
                    { fontSize: 9 * metrics.scale, letterSpacing: metrics.scale },
                  ]}
                >
                  Tap to change
                </Text>
              </Pressable>
            </ActionRing>
          </View>
        </View>
      </ScrollView>

      <LoadingOverlay visible={savingRelax} />
    </DashboardScreenLayout>
  );
}
