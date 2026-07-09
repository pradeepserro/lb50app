import { formatLogApiDate, normalizeHistoryDates } from '@/api/log/log';
import { MONTHS } from '@/components/DateTimePickerFlow/dateTimeUtils';
import {
  buildCalendarGrid,
  buildYearRange,
  formatPickerHeaderDate,
  getPickerMaxYear,
  isSameDay,
  PICKER_MIN_YEAR,
  WEEKDAY_LABELS,
  withYear,
} from '@/components/LogHistoryDatePicker/calendarUtils';
import { styles } from '@/components/LogHistoryDatePicker/LogHistoryDatePicker.styles';
import BackLeftIcon from '@assets/icons/back_left.svg';
import RightArrowNavIcon from '@assets/icons/right_arrow_nav.svg';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

type PickerViewMode = 'calendar' | 'year';

const YEAR_ROW_HEIGHT = 48;

type Props = {
  visible: boolean;
  value: Date;
  historyDates?: string[];
  onChange: (date: Date) => void;
  onClose: () => void;
};

export function LogHistoryDatePicker({
  visible,
  value,
  historyDates,
  onChange,
  onClose,
}: Props) {
  const wasVisibleRef = useRef(false);
  const yearListRef = useRef<ScrollView>(null);
  const [draftDate, setDraftDate] = useState(value);
  const [viewMode, setViewMode] = useState<PickerViewMode>('calendar');
  const [viewMonth, setViewMonth] = useState(
    () => new Date(value.getFullYear(), value.getMonth(), 1),
  );

  const pickerMaxYear = useMemo(() => getPickerMaxYear(), []);
  const years = useMemo(
    () => buildYearRange(PICKER_MIN_YEAR, pickerMaxYear),
    [pickerMaxYear],
  );

  const historyDateSet = useMemo(
    () => new Set(normalizeHistoryDates(historyDates)),
    [historyDates],
  );

  useEffect(() => {
    if (!visible) {
      wasVisibleRef.current = false;
      return;
    }

    if (!wasVisibleRef.current) {
      wasVisibleRef.current = true;
      setDraftDate(value);
      setViewMode('calendar');
      setViewMonth(new Date(value.getFullYear(), value.getMonth(), 1));
    }
  }, [visible, value]);

  useEffect(() => {
    if (viewMode !== 'year') {
      return;
    }

    const selectedYearIndex = draftDate.getFullYear() - PICKER_MIN_YEAR;
    requestAnimationFrame(() => {
      yearListRef.current?.scrollTo({
        y: Math.max(0, selectedYearIndex * YEAR_ROW_HEIGHT - YEAR_ROW_HEIGHT * 2),
        animated: false,
      });
    });
  }, [viewMode, draftDate]);

  if (!visible) {
    return null;
  }

  const calendarDays = buildCalendarGrid(viewMonth.getFullYear(), viewMonth.getMonth());
  const monthLabel = `${MONTHS[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

  const goToPreviousMonth = () => {
    setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setViewMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const onConfirm = () => {
    onChange(draftDate);
    onClose();
  };

  const selectYear = (year: number) => {
    const nextDate = withYear(draftDate, year);
    setDraftDate(nextDate);
    setViewMonth(new Date(year, nextDate.getMonth(), 1));
    setViewMode('calendar');
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss date picker"
        />
        <View style={styles.dialog} accessibilityViewIsModal>
          <View style={styles.headerBanner}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Select year"
              onPress={() => setViewMode('year')}
              style={({ pressed }) => [
                styles.headerYearButton,
                pressed && styles.headerYearButtonPressed,
              ]}
            >
              <Text style={[styles.headerYear, viewMode === 'year' && styles.headerYearActive]}>
                {draftDate.getFullYear()}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Select date"
              onPress={() => setViewMode('calendar')}
              style={({ pressed }) => [
                styles.headerDateButton,
                pressed && styles.headerDateButtonPressed,
              ]}
            >
              <Text
                style={[
                  styles.headerDate,
                  viewMode === 'year' && styles.headerDateInactive,
                ]}
              >
                {formatPickerHeaderDate(draftDate)}
              </Text>
            </Pressable>
          </View>

          {viewMode === 'year' ? (
            <ScrollView
              ref={yearListRef}
              style={styles.yearList}
              contentContainerStyle={styles.yearListContent}
              showsVerticalScrollIndicator={false}
            >
              {years.map((year) => {
                const selected = year === draftDate.getFullYear();

                return (
                  <Pressable
                    key={year}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => selectYear(year)}
                    style={({ pressed }) => [styles.yearRow, pressed && styles.yearRowPressed]}
                  >
                    <Text style={[styles.yearLabel, selected && styles.yearLabelSelected]}>
                      {year}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.calendarBody}>
              <View style={styles.monthNavRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Previous month"
                  onPress={goToPreviousMonth}
                  style={({ pressed }) => [
                    styles.monthNavButton,
                    pressed && styles.monthNavButtonPressed,
                  ]}
                >
                  <BackLeftIcon width={10} height={21} />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Select year"
                  onPress={() => setViewMode('year')}
                  style={({ pressed }) => [
                    styles.monthNavLabelButton,
                    pressed && styles.monthNavLabelButtonPressed,
                  ]}
                >
                  <Text style={styles.monthNavLabel}>{monthLabel}</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Next month"
                  onPress={goToNextMonth}
                  style={({ pressed }) => [
                    styles.monthNavButton,
                    pressed && styles.monthNavButtonPressed,
                  ]}
                >
                  <RightArrowNavIcon width={10} height={21} />
                </Pressable>
              </View>

              <View style={styles.weekdayRow}>
                {WEEKDAY_LABELS.map((label, index) => (
                  <View key={`${label}-${index}`} style={styles.weekdayCell}>
                    <Text style={styles.weekdayLabel}>{label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <View key={`empty-${index}`} style={styles.dayCell} />;
                  }

                  const dateKey = formatLogApiDate(day);
                  const selected = isSameDay(day, draftDate);
                  const hasHistory = historyDateSet.has(dateKey);

                  return (
                    <View key={dateKey} style={styles.dayCell}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ selected }}
                        accessibilityLabel={
                          hasHistory
                            ? `${day.getDate()}, existing log entry`
                            : String(day.getDate())
                        }
                        onPress={() => setDraftDate(day)}
                        style={({ pressed }) => [
                          styles.dayButton,
                          hasHistory && !selected && styles.dayButtonHistory,
                          selected && styles.dayButtonSelected,
                          pressed && styles.dayButtonPressed,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayLabel,
                            hasHistory && !selected && styles.dayLabelHistory,
                            selected && styles.dayLabelSelected,
                          ]}
                        >
                          {day.getDate()}
                        </Text>
                      </Pressable>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          <View style={styles.footerRow}>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              style={({ pressed }) => [styles.footerButton, pressed && styles.footerButtonPressed]}
            >
              <Text style={styles.footerButtonLabel}>CANCEL</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              onPress={onConfirm}
              style={({ pressed }) => [styles.footerButton, pressed && styles.footerButtonPressed]}
            >
              <Text style={styles.footerButtonLabel}>OK</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
