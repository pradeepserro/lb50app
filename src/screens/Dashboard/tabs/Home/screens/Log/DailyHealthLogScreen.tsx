import { CommonTab } from '@/components/CommonTab/CommonTab';
import { LogHistoryDatePicker } from '@/components/LogHistoryDatePicker/LogHistoryDatePicker';
import { InsightCard } from '@/components/InsightCard/InsightCard';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import type { HomeStackParamList } from '@/screens/Dashboard/tabs/Home/navigation/types';
import { styles } from '@/screens/Dashboard/tabs/Home/screens/Log/DailyHealthLogScreen.styles';
import { Colors } from '@/theme/colors';
import CalendarRedIcon from '@assets/icons/calendar_edit_red.svg';
import CheckGreenIcon from '@assets/icons/check_green.svg';
import CoffeeIcon from '@assets/icons/coffee.svg';
import SadEmojiIcon from '@assets/icons/emoji-sad.svg';
import LogoPng from '@assets/icons/logo.png';
import MoonIcon from '@assets/icons/moon.svg';
import SaveWhiteIcon from '@assets/icons/save_white.svg';
import StarsIcon from '@assets/icons/stars.svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  KeyboardTypeOptions,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Snackbar } from 'react-native-snackbar';
import {
  formatLogApiDate,
  LOG_OTHERS_TYPE_ID,
  normalizeHistoryDates,
  type Log6PillarMaster,
  type Log6PillarsResponse,
  type LogAnswerOption,
  type LogOthersMaster,
  type LogOthersResponse,
} from '@/api/log/log';
import {
  fetchLog6PillarsApi,
  fetchLogOthersApi,
  saveLog6PillarsApi,
  saveLogOthersApi,
} from '@/api/log/logEndpoints';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import {
  filterTextInput,
  parseFieldValidation,
  validateTextField,
} from '@/utils/fieldValidation';

type Props = NativeStackScreenProps<HomeStackParamList, 'DailyHealthLog'>;

type OthersFieldKey = number;

type MetricInputCardProps = {
  label: string;
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  containerRef?: React.Ref<View>;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
};

function formatTodayHeading(d: Date) {
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}


const formatHeaderDate = (date: Date | string) => {
  const d = new Date(date);

  return `Created on ${d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })}`;
};

function pillarIcon(description: string) {
  const key = description.trim().toUpperCase();
  if (key.includes('SLEEP')) {
    return <MoonIcon width={20} height={20} />;
  }
  if (key.includes('STRESS')) {
    return <SadEmojiIcon width={20} height={20} />;
  }
  return <CoffeeIcon width={20} height={20} />;
}

function buildPillarSelections(masters: Log6PillarMaster[]): Record<number, number[]> {
  const selections: Record<number, number[]> = {};
  for (const master of masters) {
    const answerIds = master.user_answers
      .map((answer) => answer.log_answer_id)
      .filter((id): id is number => typeof id === 'number');
    selections[master.id] = answerIds;
  }
  return selections;
}

function buildOtherValues(masters: LogOthersMaster[]): Record<number, string> {
  const values: Record<number, string> = {};
  for (const master of masters) {
    const existing = master.user_answers[0];
    values[master.id] =
      existing?.value != null && !Number.isNaN(existing.value) ? String(existing.value) : '';
  }
  return values;
}

function MetricInputCard({
  label,
  value,
  onChange,
  placeholder,
  onFocus,
  containerRef,
  keyboardType = 'default',
  maxLength,
}: MetricInputCardProps) {
  return (
    <View ref={containerRef} style={styles.sectionCard} collapsable={false}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeadeIcon}>
          <CoffeeIcon width={20} height={20} />
        </View>
        <Text style={styles.sectionTitle}>{label}</Text>
      </View>
      <TextInput
        style={[styles.metricInput, !value.trim() && styles.metricInputPlaceholder]}
        value={value}
        onChangeText={onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        placeholderTextColor={Colors.titleTextColorGray}
        keyboardType={keyboardType}
        maxLength={maxLength}
      />
    </View>
  );
}

function TodayEntryCard({
  day,
  date,
  year,
  onPressCalendar,
}: {
  day: string;
  date: string | undefined;
  year: string | undefined;
  onPressCalendar: () => void;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.todayTopRow}>
        <View>
          <Text style={styles.todayTitle}>Today's Entry</Text>
          <Text style={styles.todayDate}>
            {day},{' '}
            <Text style={styles.todayDateBold}>
              {date}
              {year ? ` ${year}` : ''}
            </Text>
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select log date"
          style={styles.todayDateActions}
          onPress={onPressCalendar}
        >
          <CalendarRedIcon width={20} height={20} />
        </Pressable>
      </View>
    </View>
  );
}

type SinglePillRowProps = {
  options: LogAnswerOption[];
  selectedId: number | null;
  onChange: (answerId: number) => void;
};

function SinglePillRow({ options, selectedId, onChange }: SinglePillRowProps) {
  return (
    <View style={styles.pillRow}>
      {options.map((opt) => {
        const selected = opt.id === selectedId;
        return (
          <Pressable
            key={opt.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => onChange(opt.id)}
            style={[styles.pill, selected && styles.pillSelected]}
          >
            <View style={styles.pillInner}>
              {selected ? (
                <View style={styles.pillCheckmark}>
                  <CheckGreenIcon width={7} height={7} />
                </View>
              ) : null}
              <Text
                style={[styles.pillLabel, selected && styles.pillLabelSelected]}
                numberOfLines={2}
              >
                {opt.description}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

type MultiPillRowProps = {
  options: LogAnswerOption[];
  selectedIds: number[];
  onChange: (answerIds: number[]) => void;
};

function MultiPillRow({ options, selectedIds, onChange }: MultiPillRowProps) {
  const toggle = useCallback(
    (answerId: number) => {
      if (selectedIds.includes(answerId)) {
        onChange(selectedIds.filter((id) => id !== answerId));
        return;
      }
      onChange([...selectedIds, answerId]);
    },
    [onChange, selectedIds],
  );

  return (
    <View style={styles.pillRow}>
      {options.map((opt) => {
        const selected = selectedIds.includes(opt.id);
        return (
          <Pressable
            key={opt.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            onPress={() => toggle(opt.id)}
            style={[styles.pill, selected && styles.pillSelected]}
          >
            <View style={styles.pillInner}>
              {selected ? (
                <View style={styles.pillCheckmark}>
                  <CheckGreenIcon width={7} height={7} />
                </View>
              ) : null}
              <Text
                style={[styles.pillLabel, selected && styles.pillLabelSelected]}
                numberOfLines={2}
              >
                {opt.description}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

export function DailyHealthLogScreen({ navigation }: Props) {
  const [tab, setTab] = useState(0);
  const [pillarsData, setPillarsData] = useState<Log6PillarsResponse | null>(null);
  const [othersData, setOthersData] = useState<LogOthersResponse | null>(null);
  const [pillarSelections, setPillarSelections] = useState<Record<number, number[]>>({});
  const [otherValues, setOtherValues] = useState<Record<number, string>>({});
  const [loadingPillars, setLoadingPillars] = useState(false);
  const [loadingOthers, setLoadingOthers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [entryDate, setEntryDate] = useState(() => new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardBottomInset, setKeyboardBottomInset] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollContentRef = useRef<View>(null);
  const fieldRefs = useRef<Partial<Record<OthersFieldKey, View | null>>>({});
  const todayLine = useMemo(() => formatTodayHeading(entryDate), [entryDate]);
  const [day, date, year] = todayLine.split(', ');
  const entryApiDate = useMemo(() => formatLogApiDate(entryDate), [entryDate]);
  const othersTypeId = useMemo(() => {
    if (tab === 1) {
      return LOG_OTHERS_TYPE_ID.WEEKLY;
    }
    if (tab === 2) {
      return LOG_OTHERS_TYPE_ID.ANNUAL;
    }
    return null;
  }, [tab]);

  const headerDate = useMemo(
    () => formatHeaderDate(entryDate),
    [entryDate]
  );

  const historyDates = useMemo(() => {
    if (tab === 0) {
      return normalizeHistoryDates(pillarsData?.history_dates);
    }
    return normalizeHistoryDates(othersData?.history_dates);
  }, [tab, pillarsData?.history_dates, othersData?.history_dates]);

  useEffect(() => {
    setShowThankYou(false);
  }, [tab, entryApiDate]);

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

  const loadPillars = useCallback(async () => {
    setLoadingPillars(true);
    try {
      const data = await fetchLog6PillarsApi(entryApiDate);
      setPillarsData(data);
      setPillarSelections(buildPillarSelections(data.log_masters ?? []));
    } catch (error) {
      showApiErrorAlert(error, 'Failed to load 6-pillar log');
    } finally {
      setLoadingPillars(false);
    }
  }, [entryApiDate]);

  const loadOthers = useCallback(
    async (typeId: number) => {
      setLoadingOthers(true);
      try {
        const data = await fetchLogOthersApi(entryApiDate, typeId);
        setOthersData(data);
        setOtherValues(buildOtherValues(data.log_masters ?? []));
      } catch (error) {
        showApiErrorAlert(error, 'Failed to load log');
      } finally {
        setLoadingOthers(false);
      }
    },
    [entryApiDate],
  );

  useEffect(() => {
    if (tab === 0) {
      loadPillars();
      return;
    }
    if (othersTypeId != null) {
      loadOthers(othersTypeId);
    }
  }, [tab, othersTypeId, loadPillars, loadOthers]);

  const setFieldRef = useCallback(
    (key: OthersFieldKey) => (node: View | null) => {
      fieldRefs.current[key] = node;
    },
    [],
  );

  const scrollToField = useCallback((key: OthersFieldKey) => {
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

  const onSavePillars = useCallback(async () => {
    if (!pillarsData?.log_masters?.length) {
      return;
    }

    setSaving(true);
    try {
      await saveLog6PillarsApi({
        date: entryApiDate,
        log_masters: pillarsData.log_masters.map((master) => ({
          id: master.id,
          log_answers: pillarSelections[master.id] ?? [],
          user_old_log_answers: master.user_answers.map((answer) => answer.id),
        })),
      });
      setShowThankYou(true);
      await loadPillars();
    } catch (error) {
      showApiErrorAlert(error, 'Failed to save log');
    } finally {
      setSaving(false);
    }
  }, [entryApiDate, loadPillars, pillarSelections, pillarsData]);

  const onSaveOthers = useCallback(async () => {
    if (!othersData?.log_masters?.length || othersTypeId == null) {
      return;
    }

    for (const master of othersData.log_masters) {
      const validation = parseFieldValidation(master.validation);
      const validationError = validateTextField(
        master.description,
        otherValues[master.id] ?? '',
        validation,
        master.required === 1,
      );
      if (validationError) {
        Snackbar.show({
          text: validationError,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: Colors.red,
          textColor: Colors.white,
        });
        return;
      }
    }

    setSaving(true);
    try {
      await saveLogOthersApi({
        date: entryApiDate,
        type_id: othersTypeId,
        log_masters: othersData.log_masters.map((master) => {
          const raw = otherValues[master.id]?.trim() ?? '';
          const numeric = raw === '' ? [] : [Number(raw)];
          return {
            id: master.id,
            log_answers: numeric,
            user_old_log_answers: master.user_answers.map((answer) => answer.id),
          };
        }),
      });
      setShowThankYou(true);
      await loadOthers(othersTypeId);
    } catch (error) {
      showApiErrorAlert(error, 'Failed to save log');
    } finally {
      setSaving(false);
    }
  }, [entryApiDate, loadOthers, otherValues, othersData, othersTypeId]);

  const screenLoading = loadingPillars || loadingOthers || saving;

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
          <View style={screenHeaderStyles.headerCenter}>
            <Text style={screenHeaderStyles.headerTitle}>Log Entry</Text>
            <Text style={screenHeaderStyles.headerDescription}>{headerDate}</Text>
          </View>
          <Text style={screenHeaderStyles.headerRight} />
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
            contentContainerStyle={[
              styles.scrollContent,
              Platform.OS === 'android' && keyboardBottomInset > 0
                ? { paddingBottom: keyboardBottomInset + 16 }
                : null,
            ]}
            showsVerticalScrollIndicator={keyboardVisible && othersTypeId != null}
            keyboardShouldPersistTaps="handled"
            automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
            nestedScrollEnabled
          >
            <View ref={scrollContentRef} collapsable={false}>
              <View style={styles.segmentWrap}>
                <CommonTab
                  value={tab}
                  onChange={setTab}
                  tabs={[
                    { label: '6 Pillars', value: 0 },
                    { label: 'Weekly', value: 1 },
                    { label: 'Annual', value: 2 },
                  ]}
                />
              </View>

              {tab === 0 ? (
                <>
                  <TodayEntryCard
                    day={day}
                    date={date}
                    year={year}
                    onPressCalendar={() => setDatePickerVisible(true)}
                  />

                  {pillarsData?.log_masters?.map((master) => {
                    const selectedIds = pillarSelections[master.id] ?? [];
                    const selectedId = selectedIds[0] ?? null;
                    const isMultiSelect = master.answer_type === 4;

                    return (
                      <View key={master.id} style={styles.sectionCard}>
                        <View style={styles.sectionHeaderRow}>
                          <View style={styles.sectionHeadeIcon}>
                            {pillarIcon(master.description)}
                          </View>
                          <Text style={styles.sectionTitle}>{master.description}</Text>
                        </View>
                        {isMultiSelect ? (
                          <MultiPillRow
                            options={master.log_answers}
                            selectedIds={selectedIds}
                            onChange={(answerIds) =>
                              setPillarSelections((prev) => ({
                                ...prev,
                                [master.id]: answerIds,
                              }))
                            }
                          />
                        ) : (
                          <SinglePillRow
                            options={master.log_answers}
                            selectedId={selectedId}
                            onChange={(answerId) =>
                              setPillarSelections((prev) => ({
                                ...prev,
                                [master.id]: [answerId],
                              }))
                            }
                          />
                        )}
                      </View>
                    );
                  })}

                  {showThankYou ? (
                    <InsightCard
                      singleTitle='Thank you for logging your progress'
                      leftIcon={<StarsIcon width={22} height={22} />}
                      style={styles.insightCard}
                    />
                  ) : null}

                  <Pressable
                    accessibilityRole="button"
                    onPress={onSavePillars}
                    disabled={saving || loadingPillars}
                    style={({ pressed }) => [
                      styles.saveButton,
                      (pressed || saving) && styles.saveButtonPressed,
                    ]}
                  >
                    <View style={styles.saveLeadingSpacer} />
                    <Text style={styles.saveTitle}>{saving ? 'Saving...' : 'Save Log'}</Text>
                    <View style={styles.saveBookmark}>
                      {saving ? (
                        <ActivityIndicator color={Colors.white} size="small" />
                      ) : (
                        <SaveWhiteIcon width={16} height={16} />
                      )}
                    </View>
                  </Pressable>
                </>
              ) : (
                <>
                  <TodayEntryCard
                    day={day}
                    date={date}
                    year={year}
                    onPressCalendar={() => setDatePickerVisible(true)}
                  />

                  {othersData?.log_masters?.map((master) => {
                    const validation = parseFieldValidation(master.validation);
                    return (
                      <MetricInputCard
                        key={master.id}
                        label={master.description}
                        value={otherValues[master.id] ?? ''}
                        onChange={(text) =>
                          setOtherValues((prev) => ({
                            ...prev,
                            [master.id]: filterTextInput(text, master.validation),
                          }))
                        }
                        containerRef={setFieldRef(master.id)}
                        onFocus={() => scrollToField(master.id)}
                        keyboardType={validation?.keyboardType ?? 'default'}
                        maxLength={validation?.maxLength}
                      />
                    );
                  })}

                  {showThankYou ? (
                    <InsightCard
                      singleTitle='Thank you for logging your progress'
                      leftIcon={<StarsIcon width={22} height={22} />}
                      style={styles.insightCard}
                    />
                  ) : null}

                  <Pressable
                    accessibilityRole="button"
                    onPress={onSaveOthers}
                    disabled={saving || loadingOthers}
                    style={({ pressed }) => [
                      styles.saveButton,
                      (pressed || saving) && styles.saveButtonPressed,
                    ]}
                  >
                    <View style={styles.saveLeadingSpacer} />
                    <Text style={styles.saveTitle}>{saving ? 'Saving...' : 'Save Log'}</Text>
                    <View style={styles.saveBookmark}>
                      {saving ? (
                        <ActivityIndicator color={Colors.white} size="small" />
                      ) : (
                        <SaveWhiteIcon width={16} height={16} />
                      )}
                    </View>
                  </Pressable>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>

      <LoadingOverlay visible={screenLoading} />

      <LogHistoryDatePicker
        visible={datePickerVisible}
        value={entryDate}
        historyDates={historyDates}
        onChange={setEntryDate}
        onClose={() => setDatePickerVisible(false)}
      />
    </DashboardScreenLayout>
  );
}
