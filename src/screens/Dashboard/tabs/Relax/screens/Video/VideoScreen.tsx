import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useRef } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import UserGreenIcon from '@assets/icons/user_green.svg';
import InfoGreenIcon from '@assets/icons/info_green.svg';
import LogoPng from '@assets/icons/logo.png';
import NextWhiteIcon from '@assets/icons/next.svg';
import TimerBlueIcon from '@assets/icons/timer_blue.svg';
import IntensityIcon from '@assets/icons/intensity.svg';
import RepeatIcon from '@assets/icons/repeat.svg';
import {
  VideoPlayer,
  type VideoPlayerHandle,
} from '@/components/VideoPlayer/VideoPlayer';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import type { RelaxStackParamList } from '@/screens/Dashboard/tabs/Relax/navigation/types';
import { styles } from '@/screens/Dashboard/tabs/Relax/screens/Video/VideoScreen.styles';
import { PrimaryButtonLeft } from '@/components/PrimaryButtonLeft';
import { PrimaryButton } from '@/components/PrimaryButton';

type Props = NativeStackScreenProps<RelaxStackParamList, 'Video'>;

const DEFAULT_RELAX_VIDEO_URI =
  'https://www.w3schools.com/html/mov_bbb.mp4';

const BENEFITS = [
  'Increases capillary dilation for improved oxygen delivery.',
  'Optimizes insulin sensitivity through gentle glycogen mobilization.',
  'Reduces cortisol production via parasympathetic activation.',
];

export function VideoScreen({ navigation, route }: Props) {
  const videoPlayerRef = useRef<VideoPlayerHandle>(null);
  const screenEnteredAtRef = useRef(Date.now());
  const uri = route.params?.videoUrl ?? DEFAULT_RELAX_VIDEO_URI;

  const onRepeat = useCallback(() => {
    videoPlayerRef.current?.seekToStartAndPlay();
  }, []);

  const onNext = useCallback(() => {
    const elapsedSeconds = Math.max(
      1,
      Math.floor((Date.now() - screenEnteredAtRef.current) / 1000),
    );

    navigation.navigate({
      name: 'Relax',
      params: { relaxTimeReductionSeconds: elapsedSeconds },
      merge: true,
    });
  }, [navigation]);

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

          <Text style={screenHeaderStyles.headerTitle}>Video</Text>
          <Text style={screenHeaderStyles.headerRight} />
        </View>
      }
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.scrollBody}>
          <VideoPlayer
            ref={videoPlayerRef}
            source={{ uri }}
          />

          <View style={styles.infoSection}>
            <Text style={styles.partLabel}>PART 01: WARM UP</Text>
            <Text style={styles.sequenceTitle}>Stretching Sequence 1</Text>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <TimerBlueIcon width={12} height={12} />
                <Text style={styles.statText}>5:30 mins</Text>
              </View>
              <View style={styles.statItem}>
                <IntensityIcon width={12} height={12} />
                <Text style={styles.statText}>Medium Intensity</Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <PrimaryButtonLeft
                title={'Repeat'}
                onPress={onRepeat}
                style={styles.prevBtn}
                titleStyle={styles.prevBtnText}
                renderLeftAccessory={() => (
                  <View style={styles.continueArrowCircleLeft}>
                    <RepeatIcon width={18} height={18} />
                  </View>
                )}
              />

              <PrimaryButton
                title={'Next'}
                onPress={onNext}
                style={styles.continueBtn}
                titleStyle={styles.continueText}
                renderRightAccessory={() => (
                  <View style={styles.continueArrowCircle}>
                    <NextWhiteIcon width={18} height={18} />
                  </View>
                )}
              />
            </View>
          </View>

          <View style={styles.cardsBlock}>
            <View style={styles.overviewCard}>
              <View style={styles.cardHeaderRow}>
                <InfoGreenIcon width={15} height={15} />
                <Text style={styles.cardHeaderTitle}>Exercise Overview</Text>
              </View>
              <Text style={styles.overviewBody}>
                A focused mobility flow designed to lengthen muscle fibers and improve joint range of motion. This
                sequence targets the posterior chain, essential for stabilizing the core before high-intensity
                segments.
              </Text>
            </View>

            <View style={styles.benefitsCard}>
              <View style={styles.cardHeaderRow}>
                <UserGreenIcon width={16} height={16} />
                <Text style={styles.benefitsHeaderTitle}>Metabolic Benefits</Text>
              </View>
              {BENEFITS.map(line => (
                <View key={line} style={styles.benefitLine}>
                  <View style={styles.benefitBullet} />
                  <Text style={styles.benefitText}>{line}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </DashboardScreenLayout>
  );
}
