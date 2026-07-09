import React, { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  type ImageSourcePropType,
  Pressable,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { styles } from '@/screens/Intro/IntroScreen.styles';
import IconNext from '@assets/icons/right_arrow_white.svg';
import introOne from '@assets/images/intro_one.png';
import introTwo from '@assets/images/intro_two.png';
import introThree from '@assets/images/intro_three.png';
import { PrimaryButton } from '@/components/PrimaryButton';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { setHasOnboarded } from '@/utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Intro'>;

type Slide = {
  key: string;
  title: { text: string; tone: 'primary' | 'dark' }[];
  description: string;
  image: ImageSourcePropType;
};

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export function IntroScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Slide> | null>(null);
  const [index, setIndex] = useState(0);
  const [bottomCardHeight, setBottomCardHeight] = useState(0);

  const slides = useMemo<Slide[]>(
    () => [
      {
        key: '1',
        title: [
          { text: 'Start Your', tone: 'primary' },
          { text: 'Health Journey', tone: 'dark' },
        ],
        description:
          'Track your daily nutrition, understand your body, and take the first step toward a healthier lifestyle.',
        image: introOne,
      },
      {
        key: '2',
        title: [
          { text: 'Eat Smart.', tone: 'primary' },
          { text: 'Live Better', tone: 'dark' },
        ],
        description:
          'Manage your meals, monitor calories, and follow personalized fasting plans designed for your goals.',
        image: introTwo,
      },
      {
        key: '3',
        title: [
          { text: 'Your Wellness,', tone: 'primary' },
          { text: 'Your Way', tone: 'dark' },
        ],
        description:
          'Get tailored insights, activity tracking, and expert guidance to improve your overall health every day.',
        image: introThree,
      },
    ],
    [],
  );

  const finishIntro = async () => {
    await setHasOnboarded(true);
    navigation.replace('Auth', { screen: 'Register' });
  };

  const goNext = async () => {
    if (index >= slides.length - 1) {
      await finishIntro();
      return;
    }

    const next = index + 1;
    setIndex(next);
    listRef.current?.scrollToIndex({ index: next, animated: true });
  };

  const onSkip = async () => {
    await finishIntro();
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={r => {
          listRef.current = r;
        }}
        data={slides}
        keyExtractor={item => item.key}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        getItemLayout={(_, i) => ({
          length: SCREEN_W,
          offset: SCREEN_W * i,
          index: i,
        })}
        onMomentumScrollEnd={e => {
          const nextIndex = Math.round(
            e.nativeEvent.contentOffset.x / SCREEN_W,
          );
          setIndex(nextIndex);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: SCREEN_W, height: SCREEN_H }]}>
            <View style={styles.hero}>
              <Image source={item.image} style={styles.heroImage} resizeMode='cover' />
              <View style={styles.safeOverlay} />

              <View style={styles.skipWrap}>
                <SafeAreaView style={styles.safe} edges={['top']}>
                  <Pressable onPress={onSkip} style={styles.skipPill}>
                    <Text style={styles.skipText}>Skip</Text>
                  </Pressable>
                </SafeAreaView>
              </View>
            </View>

            <View
              style={[
                styles.bottomCard,
                { paddingBottom: Math.max(insets.bottom, 20) + 12 },
              ]}
              onLayout={e => setBottomCardHeight(e.nativeEvent.layout.height)}
            >
              <View style={styles.bottomCardBackground} pointerEvents="none">
                <Image
                  source={item.image}
                  blurRadius={16}
                  resizeMode="cover"
                  style={[
                    styles.bottomCardBlurImage,
                    {
                      width: SCREEN_W,
                      height: SCREEN_H,
                      top: -(SCREEN_H - bottomCardHeight),
                    },
                  ]}
                />
                <View style={styles.bottomCardOverlay} />
              </View>

              <View style={styles.bottomCardContent}>
                <View style={styles.dotsRow}>
                  {slides.map((s, i) => (
                    <View
                      key={`${s.key}-${i}`}
                      style={[styles.dot, i === index ? styles.dotActive : null]}
                    />
                  ))}
                </View>

                <View style={styles.titleRow}>
                  {item.title.map((w, i) => (
                    <Text
                      key={`${item.key}-t-${i}`}
                      style={[
                        styles.titleWord,
                        w.tone === 'primary'
                          ? styles.titlePrimary
                          : styles.titleDark,
                      ]}
                    >
                      {w.text}
                    </Text>
                  ))}
                </View>

                <Text style={styles.desc}>{item.description}</Text>

                <View style={styles.ctaRow}>
                  <PrimaryButton
                    title="Next"
                    onPress={goNext}
                    style={styles.cta}
                    titleStyle={styles.ctaText}
                    renderRightAccessory={() => (
                      <View style={styles.ctaIcon}>
                        <IconNext />
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}
