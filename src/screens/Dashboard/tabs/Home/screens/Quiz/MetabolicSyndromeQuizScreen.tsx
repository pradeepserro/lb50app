import { LEARN_TOPIC_ID, type LearnItem } from '@/api/learn/learn';
import { fetchLearnApi } from '@/api/learn/learnEndpoints';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PrimaryButtonLeft } from '@/components/PrimaryButtonLeft';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import type { HomeStackParamList } from '@/screens/Dashboard/tabs/Home/navigation/types';
import { styles, useQuizCardMetrics } from '@/screens/Dashboard/tabs/Home/screens/Quiz/MetabolicSyndromeQuizScreen.styles';
import { resolveMediaUrl } from '@/utils/constant';
import EmptyStateIcon from '@assets/icons/empty_state.png';
import LeftArrow from '@assets/icons/left_arrow_white.svg';
import LogoPng from '@assets/icons/logo.png';
import RightArrow from '@assets/icons/right_arrow_white.svg';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

type QuizRoute = RouteProp<HomeStackParamList, 'MetabolicSyndromeQuiz'>;

function sortLearnItems(items: LearnItem[]): LearnItem[] {
  return [...items].sort((a, b) => a.order_no - b.order_no);
}

export function MetabolicSyndromeQuizScreen({ navigation }: { navigation: any }) {
  const route = useRoute<QuizRoute>();
  const topicId = route.params?.topicId ?? LEARN_TOPIC_ID.MetabolicSyndrome;
  const topicTitle = route.params?.topicTitle ?? 'Metabolic Syndrome';
  console.log("🚀 ~ MetabolicSyndromeQuizScreen ~ topicTitle:", topicTitle)

  const cardMetrics = useQuizCardMetrics();
  const [loading, setLoading] = useState(true);
  const [learnItems, setLearnItems] = useState<LearnItem[]>([]);
  const [topicIndex, setTopicIndex] = useState(0);

  const total = learnItems.length;
  const topic = learnItems[topicIndex];
  const isEmptyState = !loading && !topic;

  const loadLearnData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLearnApi(topicId);
      const sortedItems = sortLearnItems(data.learn ?? []);
      setLearnItems(sortedItems);
      setTopicIndex(0);
    } catch (error) {
      showApiErrorAlert(error, 'Failed to load learn content');
    } finally {
      setLoading(false);
    }
  }, [topicId]);

  useEffect(() => {
    loadLearnData();
  }, [loadLearnData]);

  const percentComplete = useMemo(() => {
    if (!total) {
      return 0;
    }
    const pct = Math.round(((topicIndex + 1) / total) * 100);
    return Math.min(100, Math.max(0, pct));
  }, [topicIndex, total]);

  const goTo = (nextIndex: number) => {
    const clamped = Math.min(total - 1, Math.max(0, nextIndex));
    setTopicIndex(clamped);
  };

  const onPrev = () => goTo(topicIndex - 1);
  const onNext = () => goTo(topicIndex + 1);
  const onSkipToLearn = () => navigation.navigate('Learn');

  const renderContent = () => {
    if (loading) {
      return (
        <LoadingOverlay visible={true} />
      );
    }

    if (!topic) {
      return (
        <View style={styles.emptyStateContainer}>
          <Image
            source={EmptyStateIcon}
            style={styles.emptyStateImage}
            resizeMode="contain"
          />
        </View>
      );
    }

    return (
      <>
        <Text style={styles.funQuizLabel}>Fun quiz</Text>
        <View style={styles.stepRow}>
          <Text style={styles.stepText}>
            Topic {topicIndex + 1} of {total}
          </Text>
          <View style={styles.percentPill}>
            <Text style={styles.percentText}>{percentComplete}% Complete</Text>
          </View>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percentComplete}%` }]} />
        </View>

        <View style={[styles.cardArea, { minHeight: cardMetrics.defaultCardHeight }]}>
          <View
            style={[
              styles.cardShadowWrap,
              {
                width: cardMetrics.cardWidth,
                minHeight: cardMetrics.defaultCardHeight,
              },
            ]}
          >
            <View
              style={[
                styles.cardFace,
                {
                  paddingHorizontal: cardMetrics.cardPaddingH,
                  paddingTop: cardMetrics.cardPaddingTop,
                  paddingBottom: cardMetrics.cardPaddingBottom,
                },
              ]}
            >
              <Text
                style={[
                  styles.cardTitle,
                  {
                    fontSize: cardMetrics.cardTitleFontSize,
                    lineHeight: cardMetrics.cardTitleLineHeight,
                  },
                ]}
              >
                {topic.header}
              </Text>

              {topic.description ? (
                <Text
                  style={[
                    styles.cardDescription,
                    {
                      fontSize: cardMetrics.cardDescriptionFontSize,
                      lineHeight: cardMetrics.cardDescriptionLineHeight,
                    },
                  ]}
                >
                  {topic.description}
                </Text>
              ) : null}

              {topic.url ? (
                <Image
                  source={{ uri: resolveMediaUrl(topic.url) }}
                  style={[
                    styles.cardImage,
                    {
                      width: cardMetrics.imageWidth,
                      height: cardMetrics.imageHeight,
                    },
                  ]}
                  resizeMode="cover"
                />
              ) : null}
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <PrimaryButtonLeft
            title={'Previous'}
            onPress={onPrev}
            disabled={topicIndex === 0}
            style={styles.prevBtn}
            titleStyle={styles.prevBtnText}
            renderLeftAccessory={() => (
              <View style={styles.continueArrowCircleLeft}>
                <LeftArrow width={14} height={14} />
              </View>
            )}
          />

          <PrimaryButton
            title={'Next'}
            onPress={onNext}
            disabled={topicIndex === total - 1}
            style={styles.continueBtn}
            titleStyle={styles.continueText}
            renderRightAccessory={() => (
              <View style={styles.continueArrowCircle}>
                <RightArrow width={14} height={14} />
              </View>
            )}
          />
        </View>
      </>
    );
  };

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

          <Text style={[screenHeaderStyles.headerTitle]}>
            Metabolic Syndrome
          </Text>

          <View style={[screenHeaderStyles.headerSide, styles.headerSideRight]}>
            {topicIndex >= 1 && total > 0 ? (
              <Pressable accessibilityRole="button" style={styles.skipButton} onPress={onSkipToLearn}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            ) : (
              <View style={styles.headerSideSpacer} />
            )}
          </View>
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isEmptyState && styles.scrollContentCentered,
        ]}
      >
        <View>{renderContent()}</View>
      </ScrollView>
    </DashboardScreenLayout>
  );
}
