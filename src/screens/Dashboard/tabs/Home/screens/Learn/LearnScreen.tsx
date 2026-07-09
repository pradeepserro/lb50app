import type { LearnTopicId } from '@/api/learn/learn';
import { fetchLearnStatusApi } from '@/api/learn/learnEndpoints';
import { ActionRing, type ActionRingBubble } from '@/components/ActionRing/ActionRing';
import { useRingStyles } from '@/components/ActionRing/ActionRing.styles';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { StatusCard } from '@/components/StatusCard/StatusCard';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import { styles } from '@/screens/Dashboard/tabs/Home/screens/Learn/LearnScreen.styles';
import { LEARN_TOPICS } from '@/screens/Dashboard/tabs/Home/screens/Learn/learnTopics';
import ExerciseIcon from '@assets/icons/exercise.svg';
import BulBIcon from '@assets/icons/bulb-icon.svg';
import DocumentIcon from '@assets/icons/plate_with_fork_and_knife.svg';
import HealthIcon from '@assets/icons/health.svg';
import LogoPng from '@assets/icons/logo.png';
import StatusUpGreenIcon from '@assets/icons/statusup_green.svg';
import HabitsIcon from '@assets/icons/task-square.svg';
import TimerIcon from '@assets/icons/timer.svg';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

const TOPIC_ICONS = [
  StatusUpGreenIcon,
  DocumentIcon,
  TimerIcon,
  ExerciseIcon,
  HealthIcon,
  HabitsIcon,
] as const;

export function LearnScreen({ navigation }: { navigation: any }) {
  const [learnScore, setLearnScore] = useState<string>('--');
  const [quizCompleted, setQuizCompleted] = useState<string>('--');
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const { getSixBubblePlacementStyle, metrics } = useRingStyles();

  const loadLearnStatus = useCallback(async () => {
    try {
      const data = await fetchLearnStatusApi();
      setLearnScore(data.learn_score);
      setQuizCompleted(data.quiz_completed);
    } catch (error) {
      showApiErrorAlert(error, 'Failed to load learn status');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLearnStatus();
    }, [loadLearnStatus]),
  );

  const openTopicQuiz = useCallback(
    (topicId: LearnTopicId, topicTitle: string) => {
      navigation.navigate('MetabolicSyndromeQuiz', { topicId, topicTitle });
    },
    [navigation],
  );

  const openFunQuiz = useCallback(async () => {
    setLoadingQuiz(true);
    try {
      navigation.navigate('FunQuiz');
    } catch (error) {
      showApiErrorAlert(error, 'Failed to load quiz');
    } finally {
      setLoadingQuiz(false);
    }
  }, [navigation]);

  const actionRingBubbles: ActionRingBubble[] = useMemo(
    () =>
      LEARN_TOPICS.map((topic, index) => {
        const Icon = TOPIC_ICONS[index];

        return {
          key: `learn-ring-${topic.id}-${topic.label}`,
          label: topic.label,
          icon: (
            <Icon
              width={metrics.bubbleIconSize}
              height={metrics.bubbleIconSize}
            />
          ),
          onPress: () => openTopicQuiz(topic.id, topic.title),
          isPressable: true,
          style: getSixBubblePlacementStyle(index),
        };
      }),
    [getSixBubblePlacementStyle, metrics.bubbleIconSize, openTopicQuiz],
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

          <Text style={[screenHeaderStyles.headerTitle]}>Learn</Text>
          <Text style={[screenHeaderStyles.headerRight]} />
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
              title='LEARN STATUS'
              leftLabel='Learn Score'
              leftValue={learnScore}
              rightLabel='Quizzes Completed'
              rightValue={quizCompleted}
            />
          </View>

          <View style={styles.ringSection}>
            <ActionRing
              bubbles={actionRingBubbles}
              onPress={openFunQuiz}
            >
              <BulBIcon
                width={Math.round(24 * metrics.scale)}
                height={Math.round(32 * metrics.scale)}
              />
              <Text
                style={[
                  styles.centerTitle,
                  {
                    fontSize: 10 * metrics.scale,
                    marginTop: 4 * metrics.scale,
                  },
                ]}
              >
                START A
              </Text>
              <Text
                style={[
                  styles.centerTitle,
                  {
                    fontSize: 10 * metrics.scale,
                    marginTop: 4 * metrics.scale,
                  },
                ]}
              >
                FUN QUIZ!
              </Text>
            </ActionRing>
          </View>
        </View >
      </ScrollView>
      <LoadingOverlay visible={loadingQuiz} />
    </DashboardScreenLayout >
  );
}
