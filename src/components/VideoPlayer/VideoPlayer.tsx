import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Video, {
  type OnLoadData,
  type OnProgressData,
  type ReactVideoSource,
  type VideoRef,
} from 'react-native-video';

export type VideoPlayerHandle = {
  seekToStartAndPlay: () => void;
};

export type VideoPlayerProps = {
  source: ReactVideoSource;
  containerStyle?: StyleProp<ViewStyle>;
  videoStyle?: StyleProp<ViewStyle>;
  playOverlayContainerStyle?: StyleProp<ViewStyle>;
  playCircleStyle?: StyleProp<ViewStyle>;
  playTriangleStyle?: StyleProp<ViewStyle>;
  progressTrackStyle?: StyleProp<ViewStyle>;
  progressFillStyle?: StyleProp<ViewStyle>;
  progressUpdateInterval?: number;
  previewPositionSeconds?: number;
  onPress?: () => void;
};

export const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  function VideoPlayers(
    {
      source,
      containerStyle,
      videoStyle,
      playOverlayContainerStyle,
      playCircleStyle,
      playTriangleStyle,
      progressTrackStyle,
      progressFillStyle,
      progressUpdateInterval = 250,
      previewPositionSeconds,
      onPress,
    },
    ref,
  ) {
    const playerRef = useRef<VideoRef | null>(null);

    const [paused, setPaused] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(1);

    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    const pauseVideo = useCallback(() => {
      setPaused(true);
    }, []);

    const pausedRef = useRef(paused);
    const currentTimeRef = useRef(currentTime);
    const durationRef = useRef(duration);
    const hasStartedPlaybackRef = useRef(false);
    pausedRef.current = paused;
    currentTimeRef.current = currentTime;
    durationRef.current = duration;

    const togglePlayPauseFromGesture = useCallback(() => {
      if (onPress) {
        onPress();
        return;
      }

      if (
        pausedRef.current &&
        previewPositionSeconds != null &&
        !hasStartedPlaybackRef.current
      ) {
        playerRef.current?.seek(0);
        setCurrentTime(0);
        hasStartedPlaybackRef.current = true;
      }

      if (
        pausedRef.current &&
        durationRef.current > 0 &&
        Math.floor(currentTimeRef.current) >= Math.floor(durationRef.current)
      ) {
        playerRef.current?.seek(0);
        setCurrentTime(0);
      }
      setPaused(prev => !prev);
    }, [onPress, previewPositionSeconds]);

    const singleTap = useMemo(
      () =>
        Gesture.Tap()
          .numberOfTaps(1)
          .onEnd((_e, success) => {
            if (success) {
              togglePlayPauseFromGesture();
            }
          }),
      [togglePlayPauseFromGesture],
    );

    const doubleTap = useMemo(
      () =>
        Gesture.Tap()
          .numberOfTaps(2)
          .onEnd((_e, success) => {
            if (success) {
              pauseVideo();
            }
          }),
      [pauseVideo],
    );

    const gesture = useMemo(() => Gesture.Exclusive(doubleTap, singleTap), [doubleTap, singleTap]);

    const handleLoad = useCallback(
      (data: OnLoadData) => {
        const videoDuration = data.duration ?? 1;
        setDuration(videoDuration);

        if (
          previewPositionSeconds != null &&
          !hasStartedPlaybackRef.current
        ) {
          const previewPosition = Math.min(
            previewPositionSeconds,
            Math.max(videoDuration - 0.1, 0),
          );
          playerRef.current?.seek(previewPosition);
          setCurrentTime(previewPosition);
        }
      },
      [previewPositionSeconds],
    );

    const handleProgress = useCallback((data: OnProgressData) => {
      setCurrentTime(data.currentTime);
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        seekToStartAndPlay: () => {
          hasStartedPlaybackRef.current = true;
          playerRef.current?.seek(0);
          setCurrentTime(0);
          setPaused(false);
        },
      }),
      [],
    );

    return (
      <GestureDetector gesture={gesture}>
        <View style={[styles.container, containerStyle]} collapsable={false}>
          <Video
            ref={playerRef}
            source={source}
            style={[styles.video, videoStyle]}
            paused={onPress ? false : paused}
            muted={onPress != null}
            repeat={onPress != null}
            hideShutterView={previewPositionSeconds != null}
            resizeMode="cover"
            progressUpdateInterval={progressUpdateInterval}
            onLoad={handleLoad}
            onProgress={handleProgress}
            onEnd={() => setPaused(true)}
            useTextureView={Platform.OS === 'android'}
            ignoreSilentSwitch="ignore"
            playInBackground={false}
            playWhenInactive={false}
          />
          <View style={[styles.progressMain]}>
            <View style={[styles.progressTrack, progressTrackStyle]} pointerEvents="none">
              <View style={[styles.progressFill, progressFillStyle, { width: `${progress}%` }]} />
            </View>
          </View>

          {paused ? (
            <View style={[styles.playOverlay, playOverlayContainerStyle]} pointerEvents="box-none">
              <View style={[styles.playCircle, playCircleStyle]}>
                <View style={[styles.playTriangle, playTriangleStyle]} />
              </View>
            </View>
          ) : null}
        </View>
      </GestureDetector>
    );
  },
);

const NAVY = '#1A234E';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 6,
  },
  playTriangle: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    borderTopWidth: 14,
    borderBottomWidth: 14,
    borderLeftWidth: 22,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    borderLeftColor: NAVY,
  },
  progressMain: {
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '5%',
    paddingHorizontal: 12,
    height: 4,
    zIndex: 99
  },
  progressTrack: {
    borderRadius: 50,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    margin: 'auto',
    width: '100%'
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6EBF62',
    borderRadius: 1,
  },
});
