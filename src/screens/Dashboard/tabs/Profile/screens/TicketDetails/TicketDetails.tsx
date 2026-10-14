import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Svg, { Path } from 'react-native-svg';
import ClockIcon from '@assets/icons/clock.svg';
import CloseIcon from '@assets/icons/close.svg';
import LeftArrowIcon from '@assets/icons/left_arrow_white.svg';
import SaveIcon from '@assets/icons/save_white.svg';
import {
  TICKET_STATUS_IDS,
  type TicketDetail,
  type TicketDetailAttachment,
  type TicketDetails as TicketDetailsData,
} from '@/api/ticket/ticket';
import { fetchTicketDetailsApi } from '@/api/ticket/ticketEndpoints';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PrimaryButtonLeft } from '@/components/PrimaryButtonLeft';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import {
  VideoPlayer,
  type VideoPlayerHandle,
} from '@/components/VideoPlayer/VideoPlayer';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import { styles as actionStyles } from '@/screens/Dashboard/tabs/Fasting/FastingTab.styles';
import type { ProfileStackParamList } from '@/screens/Dashboard/tabs/Profile/navigation/types';
import { styles as profileStyles } from '@/screens/Dashboard/tabs/Profile/ProfileTab.styles';
import { styles } from '@/screens/Dashboard/tabs/Profile/screens/TicketDetails/TicketDetails.style';
import type { RootState } from '@/store';
import { Colors } from '@/theme/colors';
import { MEDIA_BASE_URL, resolveMediaUrl } from '@/utils/constant';

type Props = NativeStackScreenProps<ProfileStackParamList, 'TicketDetails'>;
type AttachmentKind = 'image' | 'video' | 'unknown';
type MediaPreview = {
  kind: 'image' | 'video';
  uri: string;
};


const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif']);
const VIDEO_EXTENSIONS = new Set(['mp4', 'mov']);
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function formatTicketDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');

  return `${day} ${month} ${year}, ${displayHours}:${minutes} ${period}`;
}

function getAttachmentKind(url: string): AttachmentKind {
  const cleanUrl = url.split(/[?#]/)[0];
  const extension = cleanUrl.split('.').pop()?.toLowerCase() ?? '';

  if (IMAGE_EXTENSIONS.has(extension)) {
    return 'image';
  }

  if (VIDEO_EXTENSIONS.has(extension)) {
    return 'video';
  }

  return 'unknown';
}

function resolveTicketImageUrl(url: string): string {
  const resolvedUrl = resolveMediaUrl(url);
  const ticketMediaRoot = `${MEDIA_BASE_URL}/tickets/`;

  if (!resolvedUrl.startsWith(ticketMediaRoot)) {
    return resolvedUrl;
  }

  const fileName = resolvedUrl.slice(ticketMediaRoot.length);
  return resolveMediaUrl(`storage/tickets/${fileName}`);
}

function NotificationIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
        stroke={Colors.darkBlue}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 21h4"
        stroke={Colors.darkBlue}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}
function MediaPreviewModal({
  preview,
  onClose,
}: {
  preview: MediaPreview | null;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  const previewVideoRef = useRef<VideoPlayerHandle | null>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const [naturalImageSize, setNaturalImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const animatedScale = useRef(new Animated.Value(1)).current;
  const animatedTranslateX = useRef(new Animated.Value(0)).current;
  const animatedTranslateY = useRef(new Animated.Value(0)).current;
  const scaleRef = useRef(1);
  const pinchStartScaleRef = useRef(1);
  const translateXRef = useRef(0);
  const translateYRef = useRef(0);
  const panStartXRef = useRef(0);
  const panStartYRef = useRef(0);

  const resetImageTransform = useCallback(() => {
    scaleRef.current = 1;
    translateXRef.current = 0;
    translateYRef.current = 0;
    animatedScale.setValue(1);
    animatedTranslateX.setValue(0);
    animatedTranslateY.setValue(0);
  }, [animatedScale, animatedTranslateX, animatedTranslateY]);

  useEffect(() => {
    resetImageTransform();
    setNaturalImageSize(null);
  }, [preview, resetImageTransform]);

  useEffect(() => {
    if (preview?.kind === 'video') {
      previewVideoRef.current?.seekToStartAndPlay();
    }
  }, [preview]);

  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .runOnJS(true)
        .onStart(() => {
          pinchStartScaleRef.current = scaleRef.current;
        })
        .onUpdate(event => {
          const nextScale = Math.min(
            4,
            Math.max(1, pinchStartScaleRef.current * event.scale),
          );
          scaleRef.current = nextScale;
          animatedScale.setValue(nextScale);
        })
        .onEnd(() => {
          if (scaleRef.current <= 1) {
            resetImageTransform();
          }
        }),
    [animatedScale, resetImageTransform],
  );

  const panGesture = useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .onStart(() => {
          panStartXRef.current = translateXRef.current;
          panStartYRef.current = translateYRef.current;
        })
        .onUpdate(event => {
          if (scaleRef.current <= 1) {
            return;
          }

          const nextX = panStartXRef.current + event.translationX;
          const nextY = panStartYRef.current + event.translationY;
          translateXRef.current = nextX;
          translateYRef.current = nextY;
          animatedTranslateX.setValue(nextX);
          animatedTranslateY.setValue(nextY);
        }),
    [animatedTranslateX, animatedTranslateY],
  );

  const imageGesture = useMemo(
    () => Gesture.Simultaneous(pinchGesture, panGesture),
    [panGesture, pinchGesture],
  );

  const imageDisplaySize = useMemo(() => {
    const availableHeight = windowHeight * 0.9;

    if (
      !naturalImageSize ||
      naturalImageSize.width <= 0 ||
      naturalImageSize.height <= 0
    ) {
      return {
        width: windowWidth,
        height: Math.min(windowWidth, availableHeight),
      };
    }

    const fitScale = Math.min(
      windowWidth / naturalImageSize.width,
      availableHeight / naturalImageSize.height,
    );

    return {
      width: naturalImageSize.width * fitScale,
      height: naturalImageSize.height * fitScale,
    };
  }, [naturalImageSize, windowHeight, windowWidth]);

  const videoHeight = Math.min(windowWidth * (9 / 16), windowHeight * 0.75);

  return (
    <Modal
      visible={preview !== null}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      hardwareAccelerated
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.previewRoot} accessibilityViewIsModal>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close attachment preview"
          onPress={onClose}
          style={styles.previewBackdrop}
        />

        {preview?.kind === 'image' ? (
          <GestureDetector gesture={imageGesture}>
            <Animated.View
              style={[
                styles.previewImageFrame,
                imageDisplaySize,
                {
                  transform: [
                    { translateX: animatedTranslateX },
                    { translateY: animatedTranslateY },
                    { scale: animatedScale },
                  ],
                },
              ]}
            >
              <Pressable style={styles.previewMediaPressable} onPress={() => {}}>
                <Image
                  key={preview.uri}
                  source={{ uri: preview.uri }}
                  resizeMode="contain"
                  style={styles.previewImage}
                  onLoad={({ nativeEvent }) => {
                    setNaturalImageSize({
                      width: nativeEvent.source.width,
                      height: nativeEvent.source.height,
                    });
                  }}
                />
              </Pressable>
            </Animated.View>
          </GestureDetector>
        ) : null}

        {preview?.kind === 'video' ? (
          <View style={[styles.previewVideoFrame, { height: videoHeight }]}>
            <VideoPlayer
              key={preview.uri}
              source={{ uri: preview.uri }}
              ref={previewVideoRef}
              previewPositionSeconds={0.1}
              containerStyle={styles.previewVideo}
              videoStyle={styles.previewVideo}
              progressTrackStyle={styles.previewVideoProgressTrack}
            />
          </View>
        ) : null}

        {preview ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close attachment preview"
            hitSlop={8}
            onPress={onClose}
            style={[styles.previewCloseButton, { top: insets.top + 12 }]}
          >
            <CloseIcon width={18} height={18} />
          </Pressable>
        ) : null}
      </GestureHandlerRootView>
    </Modal>
  );
}

function AttachmentMedia({
  attachment,
  onPreview,
  onOpenUnknown,
}: {
  attachment: TicketDetailAttachment;
  onPreview: (preview: MediaPreview) => void;
  onOpenUnknown: () => void;
}) {
  const kind = getAttachmentKind(attachment.attachment_url);

  if (kind === 'image') {
    const imageUrl = resolveTicketImageUrl(attachment.attachment_url);

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`View attachment ${attachment.id}`}
        onPress={() => onPreview({ kind: 'image', uri: imageUrl })}
        style={styles.attachmentCell}
      >
        <Image
          source={{ uri: imageUrl }}
          resizeMode="cover"
          style={styles.attachmentImage}
        />
      </Pressable>
    );
  }

  if (kind === 'video') {
    const videoUrl = resolveTicketImageUrl(attachment.attachment_url);

    return (
      <View
        accessibilityRole="button"
        accessibilityLabel={`Video attachment ${attachment.id}`}
        style={styles.attachmentCell}
      >
        <VideoPlayer
          source={{ uri: videoUrl }}
          previewPositionSeconds={1}
          onPress={() => onPreview({ kind: 'video', uri: videoUrl })}
          containerStyle={styles.attachmentVideo}
          videoStyle={styles.attachmentVideo}
          playCircleStyle={styles.videoPlayCircle}
          playTriangleStyle={styles.videoPlayTriangle}
          progressTrackStyle={styles.videoProgressTrack}
        />
      </View>
    );
  }

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`Open attachment ${attachment.id}`}
      onPress={onOpenUnknown}
      style={styles.attachmentCell}
    >
      <View style={styles.unknownAttachment}>
        <Text style={styles.unknownAttachmentText}>View attachment</Text>
      </View>
    </Pressable>
  );
}

function MessageCard({
  detail,
  currentUserId,
  onPreviewAttachment,
  onOpenAttachment,
}: {
  detail: TicketDetail;
  currentUserId: string | null;
  onPreviewAttachment: (preview: MediaPreview) => void;
  onOpenAttachment: (url: string) => void;
}) {
  const isCurrentUser =
    currentUserId !== null && String(detail.user_id) === currentUserId;

  return (
    <View style={styles.messageRow}>
      <View
        style={[
          styles.messageCard,
          isCurrentUser
            ? styles.userMessageCard
            : styles.supportMessageCard,
        ]}
      >
        <View style={styles.messageHeader}>
          <Text
            style={[
              styles.messageAuthor,
              !isCurrentUser && styles.supportMessageAuthor,
            ]}
          >
            {isCurrentUser ? 'YOU' : 'SUPPORT TEAM'}
          </Text>
        </View>

        {detail.comments ? (
          <Text
            style={[
              styles.messageText,
              !isCurrentUser && styles.supportMessageText,
            ]}
          >
            {detail.comments}
          </Text>
        ) : null}

        {detail.attachments.length > 0 ? (
          <View style={styles.attachmentGrid}>
            {detail.attachments.map(attachment => (
              <AttachmentMedia
                key={attachment.id}
                attachment={attachment}
                onPreview={onPreviewAttachment}
                onOpenUnknown={() => onOpenAttachment(attachment.attachment_url)}
              />
            ))}
          </View>
        ) : null}

        <Text
          style={[
            styles.messageDate,
            !isCurrentUser && styles.supportMessageDate,
          ]}
        >
          {formatTicketDateTime(detail.created_at)}
        </Text>
      </View>
    </View>
  );
}

export function TicketDetails({ navigation, route }: Props) {
  const { ticketId } = route.params;
  const currentUserId = useSelector((state: RootState) =>
    state.auth.user?.id == null ? null : String(state.auth.user.id),
  );
  const [ticket, setTicket] = useState<TicketDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mediaPreview, setMediaPreview] = useState<MediaPreview | null>(null);

  const loadTicket = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchTicketDetailsApi(ticketId);
      setTicket(data.ticket);
    } catch (error) {
      setTicket(null);
      showApiErrorAlert(error, 'Ticket Details Unavailable');
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useFocusEffect(
    useCallback(() => {
      loadTicket();
    }, [loadTicket]),
  );

  useFocusEffect(
    useCallback(() => {
      const parentNavigation = navigation.getParent();

      parentNavigation?.setOptions({ tabBarStyle: { display: 'none' } });

      return () => {
        parentNavigation?.setOptions({ tabBarStyle: undefined });
      };
    }, [navigation]),
  );

  const handleBack = useCallback(() => {
    navigation.popTo('Tickets');
  }, [navigation]);

  const handleAddComment = useCallback(() => {
    if (!ticket) {
      return;
    }

    navigation.navigate('DescribeIssue', {
      ticketId: ticket.id,
      title: ticket.title,
    });
  }, [navigation, ticket]);

  const handlePreviewAttachment = useCallback((preview: MediaPreview) => {
    setMediaPreview(preview);
  }, []);

  const handleClosePreview = useCallback(() => {
    setMediaPreview(null);
  }, []);

  const handleOpenAttachment = useCallback(async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      showApiErrorAlert(error, 'Unable to open attachment');
    }
  }, []);

  const isInProgress =
    ticket?.status_id === TICKET_STATUS_IDS.IN_PROGRESS;

  return (
    <DashboardScreenLayout
      safeAreaEdges={['top', 'bottom']}
      header={
        <View style={[screenHeaderStyles.bar, screenHeaderStyles.header]}>
          <View style={screenHeaderStyles.headerSide}>
            <ScreenHeaderBackButton onPress={handleBack} />
          </View>

          <View style={screenHeaderStyles.headerCenter}>
            <Text style={screenHeaderStyles.headerTitle}>Tickets</Text>
          </View>

          <View style={[screenHeaderStyles.headerSide, styles.headerSideRight]}>
            <View style={styles.notificationIcon}>
              <NotificationIcon />
            </View>
          </View>
        </View>
      }
    >
      <View style={styles.rootContent}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {ticket ? (
            <>
              <View style={[profileStyles.card, styles.ticketCard]}>
                <Text style={styles.ticketNumber}>Ticket No: {ticket.id}</Text>

                <View
                  style={[
                    styles.statusBadge,
                    isInProgress
                      ? styles.statusBadgeInProgress
                      : styles.statusBadgeClosed,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isInProgress
                        ? styles.statusTextInProgress
                        : styles.statusTextClosed,
                    ]}
                  >
                    {isInProgress ? 'In Progress' : 'Closed'}
                  </Text>
                </View>
              </View>

              <View style={styles.issueCard}>
                <View style={styles.issueHeaderRow}>
                  <Text style={styles.issueLabel}>ISSUE</Text>

                  <View style={styles.dateRow}>
                    <ClockIcon width={15} height={15} />
                    <Text style={styles.ticketDate}>
                      {formatTicketDateTime(ticket.created_at)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.ticketTitle}>{ticket.title}</Text>
              </View>

              {ticket.details.length > 0 ? (
                ticket.details.map(detail => (
                  <MessageCard
                    key={detail.id}
                    detail={detail}
                    currentUserId={currentUserId}
                    onOpenAttachment={handleOpenAttachment}
                    onPreviewAttachment={handlePreviewAttachment}
                  />
                ))
              ) : (
                <View style={styles.emptyCard}>
                  <Text style={styles.emptyText}>No comments available.</Text>
                </View>
              )}
            </>
          ) : !loading ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>
                Ticket details are unavailable.
              </Text>
            </View>
          ) : null}

          <View style={[actionStyles.footer, styles.actionsFooter]}>
            <PrimaryButtonLeft
              title="Back"
              onPress={handleBack}
              disabled={loading}
              style={actionStyles.prevBtn}
              titleStyle={actionStyles.prevBtnText}
              renderLeftAccessory={() => (
                <View style={actionStyles.continueArrowCircleLeft}>
                  <LeftArrowIcon width={14} height={14} />
                </View>
              )}
            />

            <PrimaryButton
              title="Add Comment"
              onPress={handleAddComment}
              disabled={!ticket || loading}
              style={actionStyles.continueBtn}
              titleStyle={actionStyles.continueText}
              renderRightAccessory={() => (
                <View style={actionStyles.continueArrowCircle}>
                  <SaveIcon width={14} height={14} />
                </View>
              )}
            />
          </View>
        </ScrollView>

        <LoadingOverlay visible={loading} />
      </View>
        <MediaPreviewModal
          preview={mediaPreview}
          onClose={handleClosePreview}
        />

    </DashboardScreenLayout>
  );
}
