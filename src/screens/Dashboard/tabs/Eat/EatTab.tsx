import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Image, Keyboard, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import CameraBlackIcon from '@assets/icons/camera_black.svg';
import CheckGreen from '@assets/icons/check_green.svg';
import ClockRedIcon from '@assets/icons/clock_red.svg';
import DeleteWhiteIcon from '@assets/icons/delete_white.svg';
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
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PrimaryButtonLeft } from '@/components/PrimaryButtonLeft';
import { styles as baseStyles } from '@/screens/Dashboard/tabs/Eat/EatTab.styles';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '@/theme/colors';
import { saveEatApi } from '@/api/eat/eatEndpoints';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DashboardTabParamList } from '@/screens/Dashboard/DashboardTabs';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';

type MealType = 'Breakfast' | 'Lunch' | 'Dinner';
type AddOn = 'Snacks' | 'Drinks';
type CarbLevel = 'High Carb' | 'Medium Carb' | 'Low Carb' | 'No Carb';

const mealTypeMap = {
  Breakfast: 1,
  Lunch: 2,
  Dinner: 3,
};

const addOnMap = {
  Snacks: 1,
  Drinks: 2,
};

function encodeAddonType(selected: AddOn[]): number {
  return selected.reduce((value, addon) => value | addOnMap[addon], 0);
}

const carbMap = {
  'High Carb': 1,
  'Medium Carb': 2,
  'Low Carb': 3,
  'No Carb': 4,
};

const styles = baseStyles as any;

export function EatTab() {
  const navigation = useNavigation<BottomTabNavigationProp<DashboardTabParamList>>();
  const mealTypes = useMemo<MealType[]>(() => ['Breakfast', 'Lunch', 'Dinner'], []);
  const addOns = useMemo<AddOn[]>(() => ['Snacks', 'Drinks'], []);
  const carbLevels = useMemo<CarbLevel[]>(
    () => ['High Carb', 'Medium Carb', 'Low Carb', 'No Carb'],
    [],
  );
  const [saving, setSaving] = useState(false);
  const [mealType, setMealType] = useState<MealType | null>('Breakfast');
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);
  const [carb, setCarb] = useState<CarbLevel>('High Carb');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [mealImageUri, setMealImageUri] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(createDefaultStartTime);
  const [pickerVisible, setPickerVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setStartTime(createDefaultStartTime());
    }, []),
  );

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvt as any, e => {
      setKeyboardHeight(e?.endCoordinates?.height ?? 0);
    });
    const onHide = Keyboard.addListener(hideEvt as any, () => setKeyboardHeight(0));
    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, []);

  const pickMealImage = async (source: 'camera' | 'library') => {
    const picker =
      source === 'camera'
        ? launchCamera
        : launchImageLibrary;

    const res = await picker({
      mediaType: 'photo',
      quality: 0.8,
      includeBase64: false,
      saveToPhotos: source === 'camera',
    });

    if (res.didCancel) return;
    if (res.errorCode) {
      Alert.alert('Image error', res.errorMessage || res.errorCode);
      return;
    }
    const uri = res.assets?.[0]?.uri;
    if (uri) setMealImageUri(uri);
  };

  const onCaptureMeal = () => {
    Alert.alert('Capture your meal', 'Choose an option', [
      { text: 'Camera', onPress: () => pickMealImage('camera') },
      { text: 'Gallery', onPress: () => pickMealImage('library') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const resetForm = useCallback(() => {
    setMealType('Breakfast');
    setSelectedAddOns([]);
    setCarb('High Carb');
    setMealImageUri(null);
    setStartTime(createDefaultStartTime());
  }, []);

  const handleCancel = useCallback(() => {
    navigation.navigate('Home');
  }, [navigation]);

  const handleSave = useCallback(async () => {
    if (!mealType && selectedAddOns.length === 0) {
      Alert.alert('Type of meal required', 'Please select at least one meal type or add-on.');
      return;
    }

    setSaving(true);
    try {
      await saveEatApi({
        start_datetime: formatApiDateTime(startTime),
        meal_type: mealType ? mealTypeMap[mealType] : 0,
        addon_type: encodeAddonType(selectedAddOns),
        carb_level: carbMap[carb],
        photo: mealImageUri
          ? {
            uri: mealImageUri,
            name: 'meal.jpg',
            type: 'image/jpeg',
          }
          : undefined,
      });
      resetForm();
      navigation.navigate('Home');
    } catch (error) {
      showApiErrorAlert(error, 'Failed to save meal');
    } finally {
      setSaving(false);
    }
  }, [carb, mealImageUri, mealType, navigation, resetForm, selectedAddOns, startTime]);

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

          <Text style={[screenHeaderStyles.headerTitle]}>Eat Info</Text>
          <Text style={[screenHeaderStyles.headerRight]} />
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        // keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={[styles.scrollContent, { paddingBottom: keyboardHeight + 120 }]}
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

          <Text style={styles.sectionLabel}>MEAL DETAILS</Text>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>TYPE OF MEAL</Text>
            <View style={styles.chipRow}>
              {mealTypes.map(t => {
                const active = t === mealType;
                return (
                  <Pressable
                    key={t}
                    accessibilityRole="button"
                    onPress={() => setMealType(prev => (prev === t ? null : t))}
                    style={[baseStyles.chip, active ? baseStyles.chipActive : null]}>
                    <View style={baseStyles.chipRowContainer}>
                      {active && <View style={baseStyles.chipCheckmark}>
                        <CheckGreen width={6} height={6} />
                      </View>}
                      <Text style={[baseStyles.chipText, active ? baseStyles.chipTextActive : null]}>{t}</Text>
                    </View>

                  </Pressable>
                );
              })}
            </View>

            <View style={{ height: 12 }} />
            <View style={styles.chipRow}>
              {addOns.map(t => {
                const active = selectedAddOns.includes(t);
                return (
                  <Pressable
                    key={t}
                    accessibilityRole="button"
                    onPress={() =>
                      setSelectedAddOns(prev =>
                        prev.includes(t) ? prev.filter(item => item !== t) : [...prev, t],
                      )
                    }
                    style={[baseStyles.chip, active ? baseStyles.chipActive : null]}>
                    <View style={baseStyles.chipRowContainer}>
                      {active && <View style={baseStyles.chipCheckmark}>
                        <CheckGreen width={6} height={6} />
                      </View>}
                      <Text style={[baseStyles.chipText, active ? baseStyles.chipTextActive : null]}>{t}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Text style={styles.sectionLabel}>CAPTURE YOUR MEAL</Text>
          <View style={styles.captureBox}>
            <Pressable accessibilityRole="button" style={styles.captureInner} onPress={onCaptureMeal}>
              {mealImageUri ? (
                <View style={styles.imageView}>
                  <Image source={{ uri: mealImageUri }} style={styles.capturedImage} resizeMode="cover" />
                  <Pressable
                    accessibilityRole="button"
                    style={styles.deleteImageIcon}
                    onPress={e => {
                      e.stopPropagation();
                      setMealImageUri(null);
                    }}>
                    <DeleteWhiteIcon width={14} height={14} />
                  </Pressable>
                </View>
              ) : (
                <>
                  <View style={styles.cameraCircle}>
                    <CameraBlackIcon width={18} height={18} />
                  </View>
                  <Text style={styles.captureText}>Click to take a pic</Text>
                </>
              )}
            </Pressable>
          </View>

          <Text style={styles.sectionLabel}>NUTRITIONAL INFO</Text>
          <View style={styles.card}>
            <Text style={styles.fieldLabel}>CARB LEVEL</Text>
            <View style={styles.chipRow}>
              {carbLevels.map(t => {
                const active = t === carb;
                return (
                  <Pressable
                    key={t}
                    accessibilityRole="button"
                    onPress={() => setCarb(t)}
                    style={[baseStyles.chip, active ? baseStyles.chipActive : null]}>
                    <View style={baseStyles.chipRowContainer}>
                      {active && <View style={baseStyles.chipCheckmark}>
                        <CheckGreen width={6} height={6} />
                      </View>}
                      <Text style={[baseStyles.chipText, active ? baseStyles.chipTextActive : null]}>{t}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.footer}>
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