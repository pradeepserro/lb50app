import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { LogoutModal } from '@/components/LogoutModal/LogoutModal';
import { CommonActions, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import CheckWhiteIcon from '@assets/icons/check_white.svg';
import EditGreenIcon from '@assets/icons/edit_green.svg';
import EmailIcon from '@assets/icons/email.svg';
import ChevronDownGreenIcon from '@assets/icons/chevron_down_blue.svg';
import GenderIcon from '@assets/icons/gender.svg';
import LocationWhiteIcon from '@assets/icons/location_white.svg';
import LogoPng from '@assets/icons/logo.png';
import CameraBlackIcon from '@assets/icons/camera_black.svg';
import { PhoneNumberField } from '@/components/PhoneNumberField/PhoneNumberField';
import ProfileOutlineIcon from '@assets/icons/profile_tab.svg';
import LogoutIcon from '@assets/icons/logout.svg';
import SaveIcon from '@assets/icons/save_white.svg';
import UserIcon from '@assets/icons/user.svg';
import UserFrameIcon from '@assets/icons/frame.svg';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Colors } from '@/theme/colors';
import {
  GENDER_LABELS,
  genderFromApiValue,
  genderToApiValue,
  type UploadFile,
} from '@/api/profile/profile';
import { fetchProfileApi, updateProfileApi } from '@/api/profile/profileEndpoints';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import { logout } from '@/store/authSlice';
import { removeAuthToken, removeProfilePhotoUri } from '@/utils/storage';
import { styles } from '@/screens/Dashboard/tabs/Profile/ProfileTab.styles';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';

const PLACEHOLDER_COLOR = 'rgba(10,20,40,0.35)';

type ProfileFieldKey =
  | 'fullName'
  | 'email'
  | 'phone'
  | 'age'
  | 'gender'
  | 'address';

function CardEditToggle({
  editing,
  onPress,
  editLabel,
  doneLabel,
}: {
  editing: boolean;
  onPress: () => void;
  editLabel: string;
  doneLabel: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={editing ? doneLabel : editLabel}
      onPress={onPress}
      style={[styles.editToggleBtn, editing && styles.editToggleBtnActive]}
    >
      {editing ? (
        <CheckWhiteIcon width={14} height={14} />
      ) : (
        <EditGreenIcon width={14} height={14} />
      )}
    </Pressable>
  );
}

export function ProfileTab({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [genderPickerOpen, setGenderPickerOpen] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState<string | null>(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [pendingAvatar, setPendingAvatar] = useState<UploadFile | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardBottomInset, setKeyboardBottomInset] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<View>(null);
  const fieldRefs = useRef<Partial<Record<ProfileFieldKey, View | null>>>({});

  const pickProfilePhoto = useCallback(async (source: 'camera' | 'library') => {
    const picker = source === 'camera' ? launchCamera : launchImageLibrary;
    const res = await picker({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      saveToPhotos: source === 'camera',
    });

    if (res.didCancel) {
      return;
    }
    if (res.errorCode) {
      Alert.alert('Image error', res.errorMessage || res.errorCode);
      return;
    }
    const asset = res.assets?.[0];
    if (!asset?.uri) {
      return;
    }
    setPendingAvatar({
      uri: asset.uri,
      name: asset.fileName ?? 'avatar.jpg',
      type: asset.type ?? 'image/jpeg',
    });
  }, []);

  const onChangeProfilePhoto = useCallback(() => {
    Alert.alert('Profile photo', 'Choose an option', [
      { text: 'Camera', onPress: () => pickProfilePhoto('camera') },
      { text: 'Gallery', onPress: () => pickProfilePhoto('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [pickProfilePhoto]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, event => {
      setKeyboardVisible(true);
      setKeyboardBottomInset(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardVisible(false);
      setKeyboardBottomInset(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const setFieldRef = useCallback(
    (key: ProfileFieldKey) => (node: View | null) => {
      fieldRefs.current[key] = node;
    },
    [],
  );

  const scrollToField = useCallback((key: ProfileFieldKey) => {
    requestAnimationFrame(() => {
      const field = fieldRefs.current[key];
      const content = scrollContentRef.current;
      if (!field || !content) {
        return;
      }
      field.measureLayout(
        content,
        (_x, y) => {
          scrollRef.current?.scrollTo({ y: Math.max(0, y - 24), animated: true });
        },
        () => { },
      );
    });
  }, []);

  const applyProfileData = useCallback(
    (data: {
      name: string;
      email: string;
      phone: string;
      age: number;
      gender: number;
      address: string | null;
      profile_photo_url: string | null;
    }) => {
      setFullName(data.name ?? '');
      setEmail(data.email ?? '');
      setPhone(data.phone || null);
      setAge(data.age ? String(data.age) : '');
      setGender(genderFromApiValue(data.gender));
      setAddress(data.address ?? '');
      setProfilePhotoUrl(data.profile_photo_url || null);
      setPendingAvatar(null);
    },
    [],
  );

  const loadProfileData = useCallback(async () => {
    try {
      const data = await fetchProfileApi();
      applyProfileData(data);
    } catch (error) {
      showApiErrorAlert(error, 'Failed to load profile');
    }
  }, [applyProfileData]);

  useFocusEffect(
    useCallback(() => {
      loadProfileData();
    }, [loadProfileData]),
  );

  const handleSave = useCallback(async () => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedAddress = address.trim();
    const trimmedAge = age.trim();
    const genderValue = genderToApiValue(gender);

    if (!trimmedName) {
      showApiErrorAlert('Full name is required', 'Invalid Profile');
      return;
    }
    if (!trimmedEmail) {
      showApiErrorAlert('Email is required', 'Invalid Profile');
      return;
    }
    if (!phone) {
      showApiErrorAlert('Phone number is required', 'Invalid Profile');
      return;
    }
    if (!trimmedAge || Number.isNaN(Number(trimmedAge))) {
      showApiErrorAlert('Enter a valid age', 'Invalid Profile');
      return;
    }
    if (!genderValue) {
      showApiErrorAlert('Gender is required', 'Invalid Profile');
      return;
    }

    setSavingProfile(true);
    try {
      const data = await updateProfileApi({
        name: trimmedName,
        email: trimmedEmail,
        phone,
        age: Number(trimmedAge),
        gender: genderValue,
        address: trimmedAddress,
        avatar: pendingAvatar ?? undefined,
      });
      applyProfileData(data);
      setEditingDetails(false);
      setEditingAddress(false);
      Keyboard.dismiss();
    } catch (error) {
      showApiErrorAlert(error, 'Failed to save profile');
    } finally {
      setSavingProfile(false);
    }
  }, [
    address,
    age,
    applyProfileData,
    email,
    fullName,
    gender,
    pendingAvatar,
    phone,
  ]);

  const displayedProfilePhotoUri = pendingAvatar?.uri ?? profilePhotoUrl;

  const handleLogout = useCallback(async () => {
    try {
      setLogoutModalOpen(false);
      setEditingDetails(false);
      setEditingAddress(false);
      await removeAuthToken();
      await removeProfilePhotoUri();
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        }),
      );
    } catch (error) {
      console.log('Logout error', error);
    }
  }, [dispatch, navigation]);

  // const isEditing = editingDetails || editingAddress;

  return (
    <DashboardScreenLayout
      // containerStyle={{ paddingBottom: TAB_BAR_CLEARANCE + insets.bottom }}
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
            <Image
              source={LogoPng}
              style={screenHeaderStyles.headerLogo}
              resizeMode="contain"
            />
          </View>

          <Text style={screenHeaderStyles.headerTitle}>Profile</Text>

          <View style={[screenHeaderStyles.headerSide, styles.headerSideRight]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Log out"
              style={styles.logoutBtn}
              onPress={() => setLogoutModalOpen(true)}
            >
              <LogoutIcon width={20} height={20} />
            </Pressable>
          </View>
        </View>
      }
    >
      <View style={styles.rootContent}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            showsVerticalScrollIndicator={keyboardVisible}
            keyboardShouldPersistTaps="handled"
            // keyboardDismissMode="on-drag"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            nestedScrollEnabled
            contentContainerStyle={[
              styles.scrollContent,
              Platform.OS === 'android' && keyboardBottomInset > 0
                ? { paddingBottom: keyboardBottomInset + 16 }
                : null,
            ]}
          >
            <View ref={scrollContentRef} collapsable={false}>
              <View style={styles.avatarWrap}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Change profile photo"
                  style={styles.avatarPressable}
                  onPress={onChangeProfilePhoto}
                >
                  <View style={styles.avatarCircle}>
                    {displayedProfilePhotoUri ? (
                      <Image
                        source={{ uri: displayedProfilePhotoUri }}
                        style={styles.avatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <ProfileOutlineIcon width={40} height={40} color={Colors.white} />
                    )}
                  </View>
                  <View style={styles.avatarEditBtn}>
                    <CameraBlackIcon width={14} height={14} />
                  </View>
                </Pressable>
              </View>

              <View
                style={[
                  styles.card,
                  styles.firstCard,
                  editingDetails && styles.cardEditing,
                ]}
              >
                <View style={styles.cardTitleRow}>
                  <View style={styles.cardTitleLeadIcon}>
                    <UserFrameIcon width={20} height={20} />
                  </View>
                  <View style={styles.cardTitleMain}>
                    <Text style={styles.cardTitleText}>Edit Details</Text>
                    {editingDetails ? (
                      <View style={styles.editingBadge}>
                        <Text style={styles.editingBadgeText}>Editing</Text>
                      </View>
                    ) : null}
                  </View>
                  <CardEditToggle
                    editing={editingDetails}
                    editLabel="Edit personal details"
                    doneLabel="Done editing personal details"
                    onPress={() => setEditingDetails(v => !v)}
                  />
                </View>

                <View ref={setFieldRef('fullName')} style={styles.field} collapsable={false}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      editingDetails ? styles.fieldLabelEditing : styles.fieldLabelLocked,
                    ]}
                  >
                    Full Name
                  </Text>
                  <View
                    style={[
                      styles.fieldInputWrap,
                      editingDetails
                        ? styles.fieldInputWrapEditing
                        : styles.fieldInputWrapLocked,
                    ]}
                  >
                    <View style={styles.fieldIconCircle}>
                      <UserIcon width={20} height={20} />
                    </View>
                    <TextInput
                      value={fullName}
                      onChangeText={setFullName}
                      onFocus={() => scrollToField('fullName')}
                      editable={editingDetails}
                      style={[
                        styles.fieldInput,
                        !editingDetails && styles.fieldInputLocked,
                      ]}
                      placeholder="John Doe"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                    />
                  </View>
                </View>

                <View ref={setFieldRef('email')} style={styles.field} collapsable={false}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      editingDetails ? styles.fieldLabelEditing : styles.fieldLabelLocked,
                    ]}
                  >
                    Email Address
                  </Text>
                  <View
                    style={[
                      styles.fieldInputWrap,
                      editingDetails
                        ? styles.fieldInputWrapEditing
                        : styles.fieldInputWrapLocked,
                    ]}
                  >
                    <View style={styles.fieldIconCircle}>
                      <EmailIcon width={20} height={20} />
                    </View>
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => scrollToField('email')}
                      editable={editingDetails}
                      style={[
                        styles.fieldInput,
                        !editingDetails && styles.fieldInputLocked,
                      ]}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="name@example.com"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                    />
                  </View>
                </View>

                <View ref={setFieldRef('phone')} style={styles.field} collapsable={false}>
                  <Text
                    style={[
                      styles.fieldLabel,
                      editingDetails ? styles.fieldLabelEditing : styles.fieldLabelLocked,
                    ]}
                  >
                    Phone Number
                  </Text>
                  <PhoneNumberField
                    key={editingDetails ? 'phone-editing' : `phone-display-${phone ?? 'empty'}`}
                    variant="profile"
                    defaultPhoneE164={phone}
                    editable={editingDetails}
                    onFocus={() => scrollToField('phone')}
                    onPhoneChange={({ e164 }) => {
                      setPhone(e164);
                    }}
                  />
                </View>

                <View style={styles.halfRow}>
                  <View
                    ref={setFieldRef('age')}
                    style={[styles.halfCol, styles.field]}
                    collapsable={false}
                  >
                    <Text
                      style={[
                        styles.fieldLabel,
                        editingDetails ? styles.fieldLabelEditing : styles.fieldLabelLocked,
                      ]}
                    >
                      Age
                    </Text>
                    <View
                      style={[
                        styles.fieldInputWrap,
                        editingDetails
                          ? styles.fieldInputWrapEditing
                          : styles.fieldInputWrapLocked,
                      ]}
                    >
                      <View style={styles.fieldIconCircle}>
                        <UserIcon width={20} height={20} />
                      </View>
                      <TextInput
                        value={age}
                        onChangeText={setAge}
                        onFocus={() => scrollToField('age')}
                        editable={editingDetails}
                        style={[
                          styles.fieldInput,
                          !editingDetails && styles.fieldInputLocked,
                        ]}
                        keyboardType="number-pad"
                        placeholder="25"
                        placeholderTextColor={PLACEHOLDER_COLOR}
                      />
                    </View>
                  </View>
                  <View
                    ref={setFieldRef('gender')}
                    style={[styles.halfCol, styles.field]}
                    collapsable={false}
                  >
                    <Text
                      style={[
                        styles.fieldLabel,
                        editingDetails ? styles.fieldLabelEditing : styles.fieldLabelLocked,
                      ]}
                    >
                      Gender Identity
                    </Text>
                    <Pressable
                      accessibilityRole="button"
                      disabled={!editingDetails}
                      onPress={() => {
                        if (!editingDetails) {
                          return;
                        }
                        scrollToField('gender');
                        setGenderPickerOpen(true);
                      }}
                      style={[
                        styles.fieldInputWrap,
                        editingDetails
                          ? styles.fieldInputWrapEditing
                          : styles.fieldInputWrapLocked,
                      ]}
                    >
                      <View style={styles.fieldIconCircle}>
                        <GenderIcon width={20} height={20} />
                      </View>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.fieldInput,
                          gender ? styles.selectText : styles.selectPlaceholder,
                        ]}
                      >
                        {gender || 'Select Gender'}
                      </Text>
                      <ChevronDownGreenIcon style={styles.chevIcon} />
                    </Pressable>
                  </View>
                </View>
              </View>

              <View style={[styles.card, editingAddress && styles.cardEditing]}>
                <View style={styles.cardTitleRow}>
                  <View
                    style={[styles.cardTitleIconBox, styles.cardTitleIconBoxGreen]}
                  >
                    <LocationWhiteIcon width={20} height={20} />
                  </View>
                  <View style={styles.cardTitleMain}>
                    <Text style={styles.cardTitleText}>Address</Text>
                    {editingAddress ? (
                      <View style={styles.editingBadge}>
                        <Text style={styles.editingBadgeText}>Editing</Text>
                      </View>
                    ) : null}
                  </View>
                  <CardEditToggle
                    editing={editingAddress}
                    editLabel="Edit address"
                    doneLabel="Done editing address"
                    onPress={() => setEditingAddress(v => !v)}
                  />
                </View>
                <View ref={setFieldRef('address')} style={styles.field} collapsable={false}>
                  <View
                    style={[
                      styles.fieldInputWrapMultiline,
                      editingAddress
                        ? styles.fieldInputWrapEditing
                        : styles.fieldInputWrapLocked,
                    ]}
                  >
                    <TextInput
                      value={address}
                      onChangeText={setAddress}
                      onFocus={() => scrollToField('address')}
                      editable={editingAddress}
                      style={[
                        styles.fieldInput,
                        styles.fieldInputMultiline,
                        !editingAddress && styles.fieldInputLocked,
                      ]}
                      multiline
                      placeholder="100 Main St, New York, NY 10001."
                      placeholderTextColor={PLACEHOLDER_COLOR}
                    />
                  </View>
                </View>
              </View>

              {/* <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <View
                style={[styles.cardTitleIconBox, styles.cardTitleIconBoxRed]}
              >
                <MoneyWhiteIcon width={20} height={20} />
              </View>
              <Text style={styles.cardTitleText}>Payment Methods</Text>
              <Pressable accessibilityRole="button" onPress={() => { }}>
                <Text style={styles.manageLink}>Manage</Text>
              </Pressable>
            </View>

            <View style={styles.paymentCard}>
              <Text style={styles.visaMark}>VISA</Text>
              <View style={styles.paymentMid}>
                <Text style={styles.maskedPan}>•••• 4242</Text>
                <Text style={styles.expiresLabel}>EXPIRES 12/26</Text>
              </View>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="button"
              style={styles.addPaymentBox}
              onPress={() => { }}
            >
              <AddBlueIcon width={15} height={15} />
              <Text style={styles.addPaymentLabel}>Add New Payment Method</Text>
            </Pressable>
          </View> */}
              <View
                style={[
                  styles.saveWrap,
                  { paddingBottom: Math.max(insets.bottom, 8) },
                ]}
              >
                <PrimaryButton
                  title="Save"
                  onPress={handleSave}
                  loading={savingProfile}
                  disabled={savingProfile}
                  style={styles.saveBtn}
                  titleStyle={styles.saveTitle}
                  renderRightAccessory={() => (
                    <View style={styles.saveAccessory}>
                      <SaveIcon width={14} height={14} />
                    </View>
                  )}
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <LogoutModal
          visible={logoutModalOpen}
          onClose={() => setLogoutModalOpen(false)}
          onConfirm={handleLogout}
        />

        <Modal
          transparent
          visible={genderPickerOpen}
          animationType="fade"
          onRequestClose={() => setGenderPickerOpen(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setGenderPickerOpen(false)}
          >
            <Pressable style={styles.modalSheet} onPress={() => { }}>
              <Text style={styles.modalTitle}>Select Gender</Text>
              {GENDER_LABELS.map(option => (
                <Pressable
                  key={option}
                  accessibilityRole="button"
                  style={styles.modalOption}
                  onPress={() => {
                    setGender(option);
                    setGenderPickerOpen(false);
                  }}
                >
                  <Text style={styles.modalOptionText}>{option}</Text>
                </Pressable>
              ))}
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </DashboardScreenLayout>
  );
}
