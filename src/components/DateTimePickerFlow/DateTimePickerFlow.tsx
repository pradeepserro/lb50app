import DateTimePicker, { DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import { Appearance, Modal, Platform, Pressable, Text, View } from 'react-native';
import { Colors } from '@/theme/colors';
import { mergeDate, mergeTime } from '@/components/DateTimePickerFlow/dateTimeUtils';
import { styles } from '@/components/DateTimePickerFlow/DateTimePickerFlow.styles';

type PickerMode = 'date' | 'time';
export type DateTimePickerFlowMode = 'date-time' | 'time' | 'date';

const IOS_PICKER_THEME_PROPS = {
  themeVariant: 'light' as const,
  accentColor: Colors.green,
  textColor: Colors.darkBlue,
};

type Props = {
  visible: boolean;
  value: Date;
  onChange: (date: Date) => void;
  onClose: () => void;
  flow?: DateTimePickerFlowMode;
};

export function DateTimePickerFlow({
  visible,
  value,
  onChange,
  onClose,
  flow = 'date-time',
}: Props) {
  const [pickerMode, setPickerMode] = useState<PickerMode | null>(null);
  const [pickerDraft, setPickerDraft] = useState(value);
  const [workingValue, setWorkingValue] = useState(value);
  const advancingToTimeRef = useRef(false);
  const wasVisibleRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      setPickerMode(null);
      advancingToTimeRef.current = false;
      wasVisibleRef.current = false;
      return;
    }

    if (!wasVisibleRef.current) {
      wasVisibleRef.current = true;
      setWorkingValue(value);
      setPickerDraft(value);
      setPickerMode(flow === 'time' ? 'time' : 'date');
    }
  }, [visible, flow, value]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    const previousScheme = Appearance.getColorScheme();
    Appearance.setColorScheme('light');

    return () => {
      Appearance.setColorScheme(previousScheme ?? 'unspecified');
    };
  }, [visible]);

  const closePicker = () => {
    advancingToTimeRef.current = false;
    setPickerMode(null);
    onClose();
  };

  const onAndroidDismiss = () => {
    if (advancingToTimeRef.current) {
      advancingToTimeRef.current = false;
      return;
    }

    closePicker();
  };

  const onAndroidPickerValueChange = (_event: DateTimePickerChangeEvent, date: Date) => {
    if (pickerMode === 'date') {
      const merged = mergeDate(workingValue, date);
      setWorkingValue(merged);
      onChange(merged);
      setPickerDraft(merged);
      if (flow === 'date') {
        closePicker();
        return;
      }
      advancingToTimeRef.current = true;
      setPickerMode('time');
      return;
    }

    const merged = mergeTime(workingValue, date);
    onChange(merged);
    closePicker();
  };

  const onIosPickerValueChange = (_event: DateTimePickerChangeEvent, date: Date) => {
    setPickerDraft(date);
  };

  const onIosPickerDone = () => {
    if (pickerMode === 'date') {
      const merged = mergeDate(workingValue, pickerDraft);
      setWorkingValue(merged);
      onChange(merged);
      if (flow === 'date') {
        closePicker();
        return;
      }
      setPickerDraft(merged);
      setPickerMode('time');
      return;
    }

    if (pickerMode === 'time') {
      const merged = mergeTime(workingValue, pickerDraft);
      onChange(merged);
      closePicker();
    }
  };

  if (!visible || pickerMode === null) {
    return null;
  }

  return (
    <>
      {Platform.OS === 'android' ? (
        <DateTimePicker
          key={pickerMode}
          value={workingValue}
          mode={pickerMode}
          display={pickerMode === 'date' ? 'calendar' : 'clock'}
          onValueChange={onAndroidPickerValueChange}
          onDismiss={onAndroidDismiss}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal transparent animationType="slide" visible onRequestClose={closePicker}>
          <Pressable style={styles.pickerBackdrop} onPress={closePicker} />
          <View style={styles.pickerSheet}>
            <View style={styles.pickerHeader}>
              <Pressable accessibilityRole="button" onPress={closePicker}>
                <Text style={[styles.pickerHeaderAction, styles.pickerHeaderActionMuted]}>
                  Cancel
                </Text>
              </Pressable>
              <Text style={styles.pickerHeaderTitle}>
                {pickerMode === 'date' ? 'Select date' : 'Select time'}
              </Text>
              <Pressable accessibilityRole="button" onPress={onIosPickerDone}>
                <Text style={[styles.pickerHeaderAction, styles.pickerHeaderActionDone]}>
                  {pickerMode === 'date' && flow !== 'date' ? 'Next' : 'Done'}
                </Text>
              </Pressable>
            </View>
            <DateTimePicker
              value={pickerDraft}
              mode={pickerMode}
              display={pickerMode === 'date' ? 'inline' : 'spinner'}
              onValueChange={onIosPickerValueChange}
              {...IOS_PICKER_THEME_PROPS}
            />
          </View>
        </Modal>
      ) : null}
    </>
  );
}
