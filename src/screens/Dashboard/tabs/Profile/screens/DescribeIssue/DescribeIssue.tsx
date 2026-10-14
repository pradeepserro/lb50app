import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {
  launchCamera,
  launchImageLibrary,
  type Asset,
} from 'react-native-image-picker';
import { Snackbar } from 'react-native-snackbar';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import CloseIcon from '@assets/icons/close.svg';
import LeftArrowIcon from '@assets/icons/left_arrow_white.svg';
import RightArrowIcon from '@assets/icons/right_arrow_white.svg';
import type { TicketAttachmentFile } from '@/api/ticket/ticket';
import {
  fetchTicketTypesApi,
  saveTicketApi,
} from '@/api/ticket/ticketEndpoints';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PrimaryButtonLeft } from '@/components/PrimaryButtonLeft';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { useDashboardTabBarInset } from '@/components/screenLayout/dashboardLayout';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import { styles as actionStyles } from '@/screens/Dashboard/tabs/Fasting/FastingTab.styles';
import type { ProfileStackParamList } from '@/screens/Dashboard/tabs/Profile/navigation/types';
import { styles } from '@/screens/Dashboard/tabs/Profile/screens/DescribeIssue/DescribeIssue.style';
import { Colors } from '@/theme/colors';

const DESCRIPTION_LIMIT = 500;
const MAX_ATTACHMENTS = 5;
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;

const IMAGE_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'gif']);
const IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
]);

type MediaSource = 'camera' | 'library';
type DisplayAttachment = {
  attachment: TicketAttachmentFile;
  index: number;
};

type Props = NativeStackScreenProps<ProfileStackParamList, 'DescribeIssue'>;

function showValidationMessage(message: string) {
  Snackbar.show({
    text: message,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: Colors.red,
    textColor: Colors.white,
  });
}

function getFileExtension(fileName: string): string {
  const extensionMatch = fileName.match(/\.([^.?#/]+)(?:[?#].*)?$/);
  return extensionMatch?.[1]?.toLowerCase() ?? '';
}

function getFileName(asset: Asset): string {
  if (asset.fileName) {
    return asset.fileName;
  }

  const uriFileName = asset.uri?.split('/').pop()?.split(/[?#]/)[0];
  if (uriFileName && getFileExtension(uriFileName)) {
    return decodeURIComponent(uriFileName);
  }

  const mimeType = asset.type?.toLowerCase();
  const fallbackExtension =
    mimeType === 'image/png' ? 'png' : mimeType === 'image/gif' ? 'gif' : 'jpg';

  return `image-${Date.now()}.${fallbackExtension}`;
}

function getMimeType(extension: string): string {
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return 'image/jpeg';
  }
}

async function getFileSize(asset: Asset): Promise<number | null> {
  if (typeof asset.fileSize === 'number') {
    return asset.fileSize;
  }

  if (!asset.uri) {
    return null;
  }

  try {
    const stat = await ReactNativeBlobUtil.fs.stat(asset.uri);
    const size = Number(stat.size);
    return Number.isFinite(size) ? size : null;
  } catch {
    return null;
  }
}

async function validateAttachment(
  asset: Asset,
): Promise<TicketAttachmentFile | null> {
  if (!asset.uri) {
    showValidationMessage('Unable to read the selected file.');
    return null;
  }

  const name = getFileName(asset);
  const extension = getFileExtension(name);
  const suppliedMimeType = asset.type?.toLowerCase();

  if (!IMAGE_EXTENSIONS.has(extension)) {
    showValidationMessage('Only JPG, JPEG, PNG, or GIF images are allowed.');
    return null;
  }

  if (suppliedMimeType && !IMAGE_MIME_TYPES.has(suppliedMimeType)) {
    showValidationMessage('Only JPG, JPEG, PNG, or GIF images are allowed.');
    return null;
  }

  const size = await getFileSize(asset);
  if (size === null) {
    showValidationMessage(
      'Unable to check the file size. Please choose another file.',
    );
    return null;
  }

  if (size > MAX_FILE_SIZE_BYTES) {
    showValidationMessage('File size must be 2 MB or less.');
    return null;
  }

  return {
    uri: asset.uri,
    name,
    type: suppliedMimeType ?? getMimeType(extension),
    size,
  };
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

function ImagePlaceholderIcon() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Rect
        x={3.5}
        y={3.5}
        width={17}
        height={17}
        rx={1.5}
        stroke={Colors.titleTextColorGray}
        strokeWidth={1.5}
      />
      <Circle
        cx={9}
        cy={9}
        r={1.5}
        stroke={Colors.titleTextColorGray}
        strokeWidth={1.5}
      />
      <Path
        d="m5.5 18 4.2-4.2 2.8 2.8 2.1-2.1 3.9 3.5"
        stroke={Colors.titleTextColorGray}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function DescribeIssue({ navigation, route }: Props) {
  const tabBarInset = useDashboardTabBarInset();
  const routeTicketId = route.params?.ticketId ?? 0;
  const ticketTypeGroupId = route.params?.ticketTypeGroupId ?? 1;
  const isExistingTicket = routeTicketId > 0;
  const title =
    route.params?.title ??
    (!isExistingTicket ? route.params?.ticketTypeName : undefined) ??
    '';
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<
    number | null
  >(route.params?.ticketTypeId ?? null);
  const [ticketTypesLoading, setTicketTypesLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState('');
  const [imageAttachments, setImageAttachments] = useState<
    Array<TicketAttachmentFile | null>
  >([null, null, null, null, null]);
  const loadTicketTypes = useCallback(async () => {
    setTicketTypesLoading(true);

    try {
      const data = await fetchTicketTypesApi(ticketTypeGroupId);
      setSelectedTicketTypeId(currentId => {
        if (
          currentId !== null &&
          data.ticket_types.some(ticketType => ticketType.id === currentId)
        ) {
          return currentId;
        }

        return data.ticket_types[0]?.id ?? null;
      });
    } catch (error) {
      showApiErrorAlert(error, 'Ticket Types Unavailable');
    } finally {
      setTicketTypesLoading(false);
    }
  }, [ticketTypeGroupId]);

  useFocusEffect(
    useCallback(() => {
      loadTicketTypes();
    }, [loadTicketTypes]),
  );

  const attachmentCount = imageAttachments.filter(Boolean).length;
  const displayAttachments: DisplayAttachment[] = imageAttachments.flatMap(
    (attachment, index) => (attachment ? [{ attachment, index }] : []),
  );

  const handleBack = useCallback(() => {
    if (isExistingTicket) {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
      return;
    }

    navigation.popTo('Tickets');
  }, [isExistingTicket, navigation]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handleBack();
          return true;
        },
      );

      return () => subscription.remove();
    }, [handleBack]),
  );

  const pickMedia = useCallback(
    async (index: number, source: MediaSource) => {
      const currentAttachment = imageAttachments[index];

      if (!currentAttachment && attachmentCount >= MAX_ATTACHMENTS) {
        showValidationMessage('You can add up to 5 attachments only.');
        return;
      }

      try {
        const response =
          source === 'camera'
            ? await launchCamera({
                mediaType: 'photo',
                quality: 0.8,
                includeBase64: false,
                saveToPhotos: true,
              })
            : await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.8,
                includeBase64: false,
                selectionLimit: 1,
              });

        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert(
            'Image error',
            response.errorMessage || response.errorCode,
          );
          return;
        }

        const asset = response.assets?.[0];
        if (!asset) {
          return;
        }

        const attachment = await validateAttachment(asset);
        if (!attachment) {
          return;
        }

        setImageAttachments(current =>
          current.map((item, itemIndex) =>
            itemIndex === index ? attachment : item,
          ),
        );
      } catch (error) {
        showApiErrorAlert(error, 'Image error');
      }
    },
    [attachmentCount, imageAttachments],
  );

  const chooseMediaSource = useCallback(
    (index: number) => {
      const currentAttachment = imageAttachments[index];

      if (!currentAttachment && attachmentCount >= MAX_ATTACHMENTS) {
        showValidationMessage('You can add up to 5 attachments only.');
        return;
      }

      Alert.alert('Add image', 'Choose an option', [
        {
          text: 'Camera',
          onPress: () => pickMedia(index, 'camera'),
        },
        {
          text: 'Gallery',
          onPress: () => pickMedia(index, 'library'),
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
    },
    [attachmentCount, imageAttachments, pickMedia],
  );

  const chooseAttachment = useCallback(() => {
    if (attachmentCount >= MAX_ATTACHMENTS) {
      showValidationMessage('You can add up to 5 attachments only.');
      return;
    }

    const nextImageIndex = imageAttachments.findIndex(
      attachment => attachment === null,
    );

    if (nextImageIndex >= 0) {
      chooseMediaSource(nextImageIndex);
    }
  }, [attachmentCount, chooseMediaSource, imageAttachments]);

  const removeImage = useCallback((index: number) => {
    setImageAttachments(current =>
      current.map((item, itemIndex) => (itemIndex === index ? null : item)),
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (saving) {
      return;
    }

    const comments = description.trim();
    const attachments = imageAttachments.filter(
      (attachment): attachment is TicketAttachmentFile => attachment !== null,
    );

    if (!isExistingTicket && selectedTicketTypeId === null) {
      showValidationMessage('Please select an issue type.');
      return;
    }

    if (!comments && (!isExistingTicket || attachments.length === 0)) {
      showValidationMessage(
        isExistingTicket
          ? 'Please enter a comment or add an attachment.'
          : 'Please enter a description.',
      );
      return;
    }

    const enteredTitle = route.params?.title?.trim();
    const ticketTitle = isExistingTicket
      ? ''
      : enteredTitle || comments.split(/\r?\n/, 1)[0];

    setSaving(true);
    try {
      await saveTicketApi({
        ticket_id: isExistingTicket ? routeTicketId : 0,
        title: ticketTitle,
        comments,
        type_id: isExistingTicket
          ? undefined
          : selectedTicketTypeId ?? undefined,
        attachments,
      });

      Snackbar.show({
        text: 'Ticket has been saved.',
        duration: Snackbar.LENGTH_LONG,
      });
      navigation.popTo('Tickets');
    } catch (error) {
      showApiErrorAlert(error, 'Failed to save ticket');
    } finally {
      setSaving(false);
    }
  }, [
    description,
    imageAttachments,
    isExistingTicket,
    navigation,
    route.params?.title,
    routeTicketId,
    saving,
    selectedTicketTypeId,
  ]);

  return (
    <DashboardScreenLayout
      header={
        <View style={[screenHeaderStyles.bar, screenHeaderStyles.header]}>
          <View style={screenHeaderStyles.headerSide}>
            <ScreenHeaderBackButton onPress={handleBack} />
          </View>

          <View style={screenHeaderStyles.headerCenter}>
            <Text style={screenHeaderStyles.headerTitle}>Describe Issue</Text>
          </View>

          <View style={[screenHeaderStyles.headerSide, styles.headerSideRight]}>
            <View style={styles.notificationIcon}>
              <NotificationIcon />
            </View>
          </View>
        </View>
      }
    >
      <View style={[styles.rootContent, { paddingBottom: tabBarInset }]}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.ticketNumberBadge}>
              <Text style={styles.ticketNumberText}>
                Ticket No: {isExistingTicket ? routeTicketId : 'New Ticket'}
              </Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Title</Text>
              <TextInput
                value={title}
                editable={false}
                placeholder="Enter title"
                placeholderTextColor={Colors.darkBlue}
                style={styles.titleInput}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.fieldLabel}>Comments</Text>
              <View style={styles.descriptionControl}>
                <TextInput
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  maxLength={DESCRIPTION_LIMIT}
                  placeholder="Add your comment"
                  placeholderTextColor={Colors.darkBlue}
                  style={styles.descriptionInput}
                  textAlignVertical="top"
                />
                <Text style={styles.characterCounter}>
                  {description.length}/{DESCRIPTION_LIMIT}
                </Text>
              </View>
            </View>

            <View style={styles.mediaSection}>
              <Text style={styles.sectionTitle}>Attachments</Text>
              <View style={styles.imageGrid}>
                {displayAttachments.map(({ attachment, index }) => (
                  <View key={`image-${index}`} style={styles.imageCell}>
                    <Image
                      source={{ uri: attachment.uri }}
                      resizeMode="cover"
                      style={styles.selectedImage}
                    />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel={`Remove image ${index + 1}`}
                      onPress={() => removeImage(index)}
                      hitSlop={6}
                      style={styles.removeButton}
                    >
                      <CloseIcon width={8} height={8} />
                    </Pressable>
                  </View>
                ))}

                {Array.from(
                  { length: Math.max(2 - attachmentCount, 0) },
                  (_, index) => (
                    <Pressable
                      key={`empty-${index}`}
                      accessibilityRole="button"
                      accessibilityLabel={`Upload attachment ${
                        displayAttachments.length + index + 1
                      }`}
                      onPress={chooseAttachment}
                      style={styles.imageCell}
                    >
                      <ImagePlaceholderIcon />
                    </Pressable>
                  ),
                )}

                {attachmentCount < MAX_ATTACHMENTS ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Add another attachment"
                    onPress={chooseAttachment}
                    style={styles.imageCell}
                  >
                    <Text style={styles.addAttachmentText}>+1</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </ScrollView>

          <View style={[actionStyles.footer, styles.actionsFooter]}>
            <PrimaryButtonLeft
              title="Back"
              onPress={handleBack}
              disabled={saving}
              style={actionStyles.prevBtn}
              titleStyle={actionStyles.prevBtnText}
              renderLeftAccessory={() => (
                <View style={actionStyles.continueArrowCircleLeft}>
                  <LeftArrowIcon width={14} height={14} />
                </View>
              )}
            />

            <PrimaryButton
              title="Save"
              onPress={handleSave}
              disabled={saving}
              style={actionStyles.continueBtn}
              titleStyle={actionStyles.continueText}
              renderRightAccessory={() => (
                <View style={actionStyles.continueArrowCircle}>
                  <RightArrowIcon width={14} height={14} />
                </View>
              )}
            />
          </View>
        </KeyboardAvoidingView>

        <LoadingOverlay visible={ticketTypesLoading || saving} />
      </View>
    </DashboardScreenLayout>
  );
}
