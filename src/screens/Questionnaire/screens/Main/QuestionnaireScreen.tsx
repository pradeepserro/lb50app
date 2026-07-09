import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import Video from 'react-native-video';
import { Snackbar } from 'react-native-snackbar';
import type { QuestionnaireStackParamList } from '@/screens/Questionnaire/navigation/types';
import { styles } from '@/screens/Questionnaire/screens/Main/QuestionnaireScreen.styles';
import { CommonActions } from '@react-navigation/native';
import { Colors } from '@/theme/colors';
import LogoPng from '@assets/icons/logo.png';
import RightArrow from '@assets/icons/right_arrow_white.svg';
import LeftArrow from '@assets/icons/left_arrow_white.svg';
import QuestionIcon from '@assets/icons/questionIcon.svg';
import INfoGreenIcon from '@assets/icons/info_green.svg';
import QuestionHeaderIcon from '@assets/icons/question.svg';
import WarningIcon from '@assets/icons/warning.svg';
import MedicalProtocolIcon from '@assets/icons/medical_protocol.svg';
import WellbeingIcon from '@assets/icons/wellbeing.svg';
import CloseIcon from '@assets/icons/close.svg';
import ExitIcon from '@assets/icons/exit.svg';
import SadEmojiIcon from '@assets/icons/sad_emoji.svg';
import HappyEmojiIcon from '@assets/icons/happy_emoji.svg';
import ModalBackgroundIcon from '@assets/icons/background_ghost_icon.svg';
import AdditionalInfoIcon from '@assets/icons/additional_info.svg';
import ClinicalIcon from '@assets/icons/clinical.svg';
import PDFIcon from '@assets/icons/pdf.svg';
import DocumentDownloadIcon from '@assets/icons/document-download.svg';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PrimaryButtonLeft } from '@/components/PrimaryButtonLeft';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import {
  getQuestionnaireRestartPending,
  removeAuthToken,
  removeProfilePhotoUri,
  setQuestionnaireCompleted,
  setQuestionnaireRestartPending,
} from '@/utils/storage';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import {
  fetchQuestionsApi,
  resetQuestionnaireProgressApi,
  submitQuestionsApi,
} from '@/api/questionnaire/questionnaireEndpoints';
import type {
  ApiAnswerOption,
  ApiQuestionItem,
  QuestionsResponse,
  SubmitQuestionsParams,
} from '@/api/questionnaire/questionnaire';
import {
  QUESTIONNAIRE_PREVIOUS_NEXT,
} from '@/utils/constant';
import { downloadDoctorForm } from '@/utils/downloadDoctorForm';
import { logout } from '@/store/authSlice';
import { useDispatch } from 'react-redux';

type QuestionType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'MULTIPLE_TEXT'
  | 'RADIO'
  | 'CHECKBOX'
  | 'SCALE';

interface Option {
  id: string;
  label: string;
  questionId?: number;
  note?: string;
  tags?: string[];
}

interface QuestionValidation {
  keyboardType?: KeyboardTypeOptions;
  regex?: RegExp;
  minLength?: number;
  maxLength?: number;
}

interface BaseQuestion {
  id: string;
  apiQuestionId: number;
  title: string;
  type: QuestionType;
  required: number;
  description?: string;
  helperNote?: string;
  videoUrl?: string;
  validation?: QuestionValidation;
  oldAnswerIds: number[];
}

interface TextQuestion extends BaseQuestion {
  type: 'TEXT';
  placeholder?: string;
}

interface TextAreaQuestion extends BaseQuestion {
  type: 'TEXTAREA';
  placeholder?: string;
}

interface MultipleTextQuestion extends BaseQuestion {
  type: 'MULTIPLE_TEXT';
  fields: { id: string; label: string; placeholder?: string; unit?: string }[];
}

interface RadioQuestion extends BaseQuestion {
  type: 'RADIO';
  options: Option[];
}

interface CheckboxQuestion extends BaseQuestion {
  type: 'CHECKBOX';
  options: Option[];
}

interface ScaleQuestion extends BaseQuestion {
  type: 'SCALE';
  min?: number;
  max?: number;
}

type Question =
  | TextQuestion
  | TextAreaQuestion
  | MultipleTextQuestion
  | RadioQuestion
  | CheckboxQuestion
  | ScaleQuestion;

function parseQuestionValidation(
  validation: ApiQuestionItem['validation'],
): QuestionValidation | undefined {
  if (!validation) return undefined;

  const result: QuestionValidation = {};
  if (validation.keyboard_type === 'numeric') {
    result.keyboardType = 'numeric';
  } else if (validation.keyboard_type === 'alphabetic') {
    result.keyboardType = 'default';
  }

  const rules = validation.validation;
  if (rules?.regex) {
    try {
      result.regex = new RegExp(rules.regex);
    } catch {
      // ignore invalid regex from API
    }
  }
  if (rules?.min_length != null) {
    result.minLength = rules.min_length;
  }
  if (rules?.max_length != null) {
    result.maxLength = rules.max_length;
  }

  return Object.keys(result).length > 0 ? result : undefined;
}

function getKeyboardTypeForQuestion(
  question: Pick<BaseQuestion, 'validation'>,
): KeyboardTypeOptions | undefined {
  return question.validation?.keyboardType;
}

function mapApiOptions(apiAnswers: ApiAnswerOption[]): Option[] {
  return apiAnswers.map((item, index) => {
    const label =
      item.answer?.trim() ||
      item.option?.trim() ||
      item.label?.trim() ||
      `Option ${index + 1}`;
    const optionId = item.id;
    return {
      id: String(optionId ?? `${index}-${label}`),
      label,
      questionId: item.question_id,
    };
  });
}

function mapTypeIdToQuestionType(typeId: number): QuestionType {
  switch (typeId) {
    case 1:
      return 'TEXT';
    case 2:
      return 'TEXTAREA';
    case 3:
      return 'RADIO';
    case 4:
      return 'CHECKBOX';
    default:
      return 'TEXT';
  }
}

function mapApiQuestionItemToUi(item: ApiQuestionItem): Question {
  const base: BaseQuestion = {
    id: String(item.question_id),
    apiQuestionId: item.question_id,
    title: item.question,
    type: mapTypeIdToQuestionType(item.type_id),
    description: item.description?.trim() || undefined,
    required: item.required,
    validation: parseQuestionValidation(item.validation),
    oldAnswerIds: (item.user_answers ?? [])
      .map(userAnswer => userAnswer.id)
      .filter(id => !Number.isNaN(id)),
  };
  const type = base.type;

  if (type === 'TEXTAREA') {
    return { ...base, type: 'TEXTAREA' };
  }
  if (type === 'RADIO') {
    return { ...base, type: 'RADIO', options: mapApiOptions(item.answers) };
  }
  if (type === 'CHECKBOX') {
    return { ...base, type: 'CHECKBOX', options: mapApiOptions(item.answers) };
  }
  return { ...base, type: 'TEXT' };
}

function isQuestionnaireComplete(data: QuestionsResponse | null): boolean {
  if (!data) return false;
  return !data.questions?.length || data.current_count === -1;
}

function getPrefilledAnswer(
  item: ApiQuestionItem,
  question: Question,
): string | string[] | Record<string, string> | number {
  const userAnswers = item.user_answers ?? [];
  if (!userAnswers.length) {
    if (question.type === 'CHECKBOX') return [];
    if (question.type === 'MULTIPLE_TEXT') return {};
    return '';
  }

  if (question.type === 'TEXT' || question.type === 'TEXTAREA') {
    return userAnswers[0]?.answer ?? '';
  }

  if (question.type === 'RADIO') {
    return userAnswers[0]?.answer ?? '';
  }

  if (question.type === 'CHECKBOX') {
    return userAnswers.map(userAnswer => userAnswer.answer);
  }

  return userAnswers[0]?.answer ?? '';
}

function formatCheckboxAnswerForApi(
  question: CheckboxQuestion,
  value: unknown,
): string {
  const selectedIds = Array.isArray(value) ? (value as string[]) : [];
  const numericOptionIds = selectedIds
    .map(selectedId => question.options.find(opt => opt.id === selectedId))
    .filter((opt): opt is Option => !!opt && /^\d+$/.test(opt.id))
    .map(opt => opt.id);
  return numericOptionIds.join(',');
}

function formatAnswerForApi(question: Question, value: unknown): string {
  if (question.type === 'CHECKBOX') {
    return formatCheckboxAnswerForApi(question as CheckboxQuestion, value);
  }

  if (question.type === 'RADIO') {
    const selectedId = typeof value === 'string' ? value : '';
    if (!selectedId) return '';
    return selectedId;
  }

  return typeof value === 'string' ? value.trim() : String(value ?? '').trim();
}

function buildSubmitQuestionsParams(
  questions: Question[],
  answersByQuestionId: Record<string, unknown>,
  previousNext: number,
): SubmitQuestionsParams {
  return {
    questions: questions.map(question => ({
      question_id: question.apiQuestionId,
      answers: formatAnswerForApi(question, answersByQuestionId[question.id]),
      old_answer_id: question.oldAnswerIds,
    })),
    previous_next: previousNext,
  };
}

function validateAnswer(question: Question, value: unknown): string | null {
  if (question.required === 1 && !isAnswerProvided(question, value)) {
    return `Please answer "${question.title}" before continuing.`;
  }

  if (
    (question.type === 'TEXT' || question.type === 'TEXTAREA') &&
    isAnswerProvided(question, value)
  ) {
    const text = String(value).trim();
    const rules = question.validation;
    if (rules?.minLength != null && text.length < rules.minLength) {
      return `"${question.title}" must be at least ${rules.minLength} characters.`;
    }
    if (rules?.maxLength != null && text.length > rules.maxLength) {
      return `"${question.title}" must be at most ${rules.maxLength} characters.`;
    }
    if (rules?.regex && !rules.regex.test(text)) {
      return `Please enter a valid value for "${question.title}".`;
    }
  }

  return null;
}

function isAnswerProvided(question: Question, value: unknown): boolean {
  if (question.type === 'CHECKBOX') {
    return Array.isArray(value) && value.length > 0;
  }
  if (question.type === 'MULTIPLE_TEXT') {
    const record = (value ?? {}) as Record<string, string>;
    return Object.values(record).some(entry => entry.trim().length > 0);
  }
  if (question.type === 'SCALE') {
    return typeof value === 'number';
  }
  return typeof value === 'string' && value.trim().length > 0;
}

function getInputPaddingRightForUnit(unit: string): number {
  return Math.min(Math.max(72, unit.length * 8 + 28), 176);
}

function renderFieldUnit(unit: string) {
  const orMatch = unit.match(/^(.+?)\s+or\s+(.+)$/i);
  if (orMatch) {
    return (
      <Text style={styles.inputSuffixText} numberOfLines={1}>
        {orMatch[1]}
        <Text style={styles.inputSuffixTextOr}> or </Text>
        {orMatch[2]}
      </Text>
    );
  }
  return (
    <Text style={styles.inputSuffixText} numberOfLines={1}>
      {unit}
    </Text>
  );
}

function renderQuestionDescriptionText(description: string) {
  const noteIdx = description.indexOf('Note:');
  if (noteIdx === -1) {
    return <Text style={styles.questionDescription}>{description}</Text>;
  }
  const lead = description.slice(0, noteIdx).trimEnd();
  const note = description.slice(noteIdx);
  return (
    <Text style={styles.questionDescription}>
      {lead ? `${lead} ` : ''}
      <Text style={styles.questionDescriptionNote}>{note}</Text>
    </Text>
  );
}

type Props = NativeStackScreenProps<QuestionnaireStackParamList, 'Main'>;

export function QuestionnaireScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState<QuestionsResponse | null>(null);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [answersByQuestionId, setAnswersByQuestionId] = useState<
    Record<string, unknown>
  >({});
  const [submitting, setSubmitting] = useState(false);
  const [safetyNoticeVisible, setSafetyNoticeVisible] = useState(false);
  const [safetyNoticeBlocking, setSafetyNoticeBlocking] = useState(false);
  const [additionalInfoVisible, setAdditionalInfoVisible] = useState(false);
  const [pendingWarnResponse, setPendingWarnResponse] = useState<QuestionsResponse | null>(null);
  const [pendingWarnLink, setPendingWarnLink] = useState<string | undefined>(undefined);
  const [downloadingDoctorForm, setDownloadingDoctorForm] = useState(false);
  const [lastSelectedOptionId, setLastSelectedOptionId] = useState<string | null>(null);

  const getSelectedAnswerFlags = useCallback(() => {
    if (!apiData) {
      return { warn: false, stop: false, link: undefined as string | undefined };
    }

    const warnFromApi = (value: unknown) => Number(value) === 1;
    const stopFromApi = (value: unknown) => Number(value) === 1;
    const linkFromApi = (value: unknown) =>
      typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;

    for (const item of apiData.questions) {
      const questionId = String(item.question_id);
      const answer = answersByQuestionId[questionId];
      const apiAnswers = item.answers ?? [];

      const selectedIds: string[] =
        typeof answer === 'string'
          ? answer.trim()
            ? [answer.trim()]
            : []
          : Array.isArray(answer)
            ? (answer as unknown[])
              .map(v => (typeof v === 'string' ? v.trim() : String(v)))
              .filter(Boolean)
            : [];

      if (!selectedIds.length) continue;

      let selectedOptions = apiAnswers.filter(opt =>
        selectedIds.some(id => String(opt.id) === String(id)),
      );

      if (!selectedOptions.length && selectedIds.length === 1) {
        const needle = selectedIds[0].toLowerCase();
        const matched = apiAnswers.find(opt => {
          const candidates = [opt.answer, opt.option, opt.label]
            .filter((v): v is string => typeof v === 'string')
            .map(v => v.trim().toLowerCase())
            .filter(Boolean);
          return candidates.includes(needle);
        });
        if (matched) selectedOptions = [matched];
      }

      if (selectedOptions.length > 1 && lastSelectedOptionId) {
        const lastSelectedOption = selectedOptions.find(
          opt => String(opt.id) === lastSelectedOptionId,
        );
        if (lastSelectedOption) {
          return {
            warn: warnFromApi(lastSelectedOption.warn),
            stop: stopFromApi(lastSelectedOption.stop),
            link: linkFromApi(lastSelectedOption.link),
          };
        }
      }

      const firstLink = selectedOptions.map(opt => linkFromApi(opt.link)).find(Boolean);
      if (
        selectedOptions.some(opt => warnFromApi(opt.warn)) ||
        selectedOptions.some(opt => stopFromApi(opt.stop)) ||
        firstLink
      ) {
        return {
          warn: selectedOptions.some(opt => warnFromApi(opt.warn)),
          stop: selectedOptions.some(opt => stopFromApi(opt.stop)),
          link: firstLink,
        };
      }
    }

    return { warn: false, stop: false, link: undefined };
  }, [apiData, answersByQuestionId, lastSelectedOptionId]);

  const applyQuestionResponse = useCallback((data: QuestionsResponse) => {
    if (isQuestionnaireComplete(data)) {
      setApiData(data);
      setCurrentQuestions([]);
      return false;
    }

    const uiQuestions = data.questions.map(mapApiQuestionItemToUi);
    const newAnswers: Record<string, unknown> = {};
    data.questions.forEach((item, index) => {
      const uiQuestion = uiQuestions[index];
      if (uiQuestion) {
        newAnswers[uiQuestion.id] = getPrefilledAnswer(item, uiQuestion);
      }
    });

    setApiData(data);
    setCurrentQuestions(uiQuestions);
    setAnswersByQuestionId(newAnswers);
    setLastSelectedOptionId(null);
    return true;
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const needsRestart = await getQuestionnaireRestartPending();
      const data = needsRestart
        ? await resetQuestionnaireProgressApi()
        : await fetchQuestionsApi({
            previous_next: QUESTIONNAIRE_PREVIOUS_NEXT.NONE,
          });
      if (needsRestart) {
        await setQuestionnaireRestartPending(false);
      }
      if (isQuestionnaireComplete(data)) {
        await setQuestionnaireCompleted(true);
        const rootNav = navigation.getParent();
        rootNav?.reset({
          index: 0,
          routes: [{ name: 'Dashboard' as never }],
        });
        return;
      }
      applyQuestionResponse(data);
    } catch (error) {
      showApiErrorAlert(error, 'Failed to load questionnaire');
    } finally {
      setLoading(false);
    }
  }, [applyQuestionResponse, navigation]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAnswerChange = (questionId: string, value: unknown) => {
    const currentAnswer = answersByQuestionId[questionId];

    if (Array.isArray(value) && Array.isArray(currentAnswer)) {
      const oldIds = (currentAnswer as unknown[])
        .map(v => String(v))
        .sort();
      const newIds = (value as unknown[])
        .map(v => String(v))
        .sort();

      const added = newIds.find(id => !oldIds.includes(id));
      const removed = oldIds.find(id => !newIds.includes(id));

      if (added) {
        setLastSelectedOptionId(added);
      } else if (removed) {
        setLastSelectedOptionId(newIds.length > 0 ? newIds[0] : null);
      }
    } else if (Array.isArray(value)) {
      const firstId = (value as unknown[])[0];
      setLastSelectedOptionId(firstId ? String(firstId) : null);
    } else if (Array.isArray(currentAnswer)) {
      setLastSelectedOptionId(null);
    } else if (typeof value === 'string') {
      setLastSelectedOptionId(value);
    }

    setAnswersByQuestionId(prev => ({ ...prev, [questionId]: value }));
  };

  const displayStep = apiData?.current_count ?? 0;
  const displayTotal = apiData?.total_count ?? 0;
  const percentComplete =
    displayTotal > 0 ? Math.floor((displayStep / displayTotal) * 100) : 0;
  const isLastStep =
    !!apiData &&
    apiData.current_count === apiData.total_count &&
    apiData.total_count > 0;

  const submitQuestionnaire = useCallback(async () => {
    setSubmitting(true);
    try {
      await setQuestionnaireCompleted(true);
      const rootNav = navigation.getParent();
      rootNav?.reset({
        index: 0,
        routes: [{ name: 'Dashboard' as never }],
      });
    } finally {
      setSubmitting(false);
    }
  }, [navigation]);

  const submitCurrentQuestion = useCallback(
    async (previousNext: number) => {
      if (!apiData || !currentQuestions.length) return;

      const isMovingForward =
        previousNext === QUESTIONNAIRE_PREVIOUS_NEXT.NEXT ||
        previousNext === QUESTIONNAIRE_PREVIOUS_NEXT.FINISH;

      if (isMovingForward) {
        for (const question of currentQuestions) {
          const validationError = validateAnswer(
            question,
            answersByQuestionId[question.id],
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
      }

      setSubmitting(true);
      try {
        const selectedFlags = isMovingForward
          ? getSelectedAnswerFlags()
          : { warn: false, stop: false, link: undefined as string | undefined };

        const data = await submitQuestionsApi(
          buildSubmitQuestionsParams(
            currentQuestions,
            answersByQuestionId,
            previousNext,
          ),
        );

        if (isMovingForward && selectedFlags.stop) {
          setSafetyNoticeBlocking(true);
          setSafetyNoticeVisible(true);
          return;
        }

        if (isMovingForward && selectedFlags.warn) {
          setPendingWarnResponse(data);
          setPendingWarnLink(selectedFlags.link);
          setAdditionalInfoVisible(true);
          return;
        }

        if (isQuestionnaireComplete(data)) {
          if (isMovingForward) {
            await submitQuestionnaire();
          }
          return;
        }

        applyQuestionResponse(data);
      } catch (error) {
        showApiErrorAlert(error, 'Failed to save your answer');
      } finally {
        setSubmitting(false);
      }
    },
    [
      apiData,
      applyQuestionResponse,
      answersByQuestionId,
      currentQuestions,
      getSelectedAnswerFlags,
      submitQuestionnaire,
    ],
  );

  const onNext = async () => {
    await submitCurrentQuestion(
      isLastStep
        ? QUESTIONNAIRE_PREVIOUS_NEXT.FINISH
        : QUESTIONNAIRE_PREVIOUS_NEXT.NEXT,
    );
  };

  const onPrev = async () => {
    if (!apiData || apiData.current_count <= 1) return;
    await submitCurrentQuestion(QUESTIONNAIRE_PREVIOUS_NEXT.PREVIOUS);
  };

  const renderQuestion = (q: Question) => {
    const answerValue = answersByQuestionId[q.id];

    const renderHelperNote = (note?: string) => {
      if (!note) return null;
      return (
        <View style={styles.noteContainer}>
          <INfoGreenIcon width={16} height={16} style={styles.noteIcon} />
          <Text style={styles.noteText}>{note}</Text>
        </View>
      );
    };

    const renderTags = (tags?: string[]) => {
      if (!tags?.length) return null;
      return (
        <View style={styles.tagsWrap}>
          {tags.map(tag => (
            <View key={tag} style={styles.tagPill}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      );
    };

    const renderVideo = (videoUrl?: string) => {
      if (!videoUrl) return null;
      return (
        <View style={styles.videoContainer}>
          <Video
            source={{ uri: videoUrl }}
            style={styles.videoPlayer}
            controls
            paused
            resizeMode="cover"
            useTextureView={Platform.OS === 'android'}
          />
          <Pressable onPress={() => Linking.openURL(videoUrl)}>
            <Text style={styles.videoLinkText}>Open video in browser</Text>
          </Pressable>
        </View>
      );
    };

    const renderSafetyNote = (note?: string) => {
      if (!note) return null;
      return (
        <View style={styles.alertNoteContainer}>
          <Text style={styles.alertIcon}>▲</Text>
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Safety Protocol Initiated</Text>
            <Text style={styles.alertText}>{note}</Text>
          </View>
        </View>
      );
    };

    switch (q.type) {
      case 'TEXT':
        return (
          <>
            {renderVideo(q.videoUrl)}
            <TextInput
              style={[
                styles.textInput,
                !((answerValue as string) || '').trim() && styles.textInputPlaceholderFont,
              ]}
              placeholder={(q as TextQuestion).placeholder}
              placeholderTextColor={Colors.titleTextColorGray}
              value={(answerValue as string) || ''}
              onChangeText={text => handleAnswerChange(q.id, text)}
              keyboardType={getKeyboardTypeForQuestion(q)}
              maxLength={q.validation?.maxLength}
            />
            {renderHelperNote(q.helperNote)}
          </>
        );

      case 'TEXTAREA':
        return (
          <>
            {renderVideo(q.videoUrl)}
            <TextInput
              style={[
                styles.textInput,
                styles.textAreaInput,
                !((answerValue as string) || '').trim() && styles.textInputPlaceholderFont,
              ]}
              multiline
              textAlignVertical="top"
              placeholder={(q as TextAreaQuestion).placeholder}
              placeholderTextColor={Colors.titleTextColorGray}
              value={(answerValue as string) || ''}
              onChangeText={text => handleAnswerChange(q.id, text)}
              keyboardType={getKeyboardTypeForQuestion(q)}
              maxLength={q.validation?.maxLength}
            />
            {renderHelperNote(q.helperNote)}
          </>
        );

      case 'MULTIPLE_TEXT':
        const mtq = q as MultipleTextQuestion;
        const currentMultiAns = (answerValue as Record<string, string>) || {};
        return (
          <>
            {renderVideo(q.videoUrl)}
            {mtq.fields.map(field => (
              <View key={field.id} style={styles.multiTextInputWrap}>
                <Text style={styles.multiTextInputLabel}>{field.label}</Text>
                <View style={styles.inputWithSuffixWrap}>
                  <TextInput
                    style={[
                      styles.textInput,
                      field.unit ? styles.inputWithSuffixTextInput : null,
                      field.unit
                        ? { paddingRight: getInputPaddingRightForUnit(field.unit) }
                        : null,
                      !(currentMultiAns[field.id] || '').trim() &&
                      styles.textInputPlaceholderFont,
                    ]}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.titleTextColorGray}
                    value={currentMultiAns[field.id] || ''}
                    onChangeText={text =>
                      handleAnswerChange(q.id, {
                        ...currentMultiAns,
                        [field.id]: text,
                      })
                    }
                    keyboardType={getKeyboardTypeForQuestion(q)}
                  />
                  {field.unit ? renderFieldUnit(field.unit) : null}
                </View>
              </View>
            ))}
            {renderHelperNote(q.helperNote)}
          </>
        );

      case 'RADIO':
        const rq = q as RadioQuestion;
        return (
          <>
            {renderVideo(q.videoUrl)}
            {rq.options.map(opt => {
              const isSelected = answerValue === opt.id;
              return (
                <React.Fragment key={opt.id}>
                  <Pressable
                    style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                    onPress={() => handleAnswerChange(q.id, opt.id)}
                  >
                    <View
                      style={[
                        styles.radioOuter,
                        isSelected && styles.radioOuterSelected,
                      ]}
                    >
                      {isSelected && (
                        <Text style={styles.checkboxInnerSelected}>✓</Text>
                      )}
                    </View>
                    <View style={styles.optionContent}>
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {opt.label}
                      </Text>
                      {renderTags(opt.tags)}
                    </View>
                  </Pressable>
                  {isSelected ? renderSafetyNote(opt.note) : null}
                </React.Fragment>
              );
            })}
            {renderHelperNote(q.helperNote)}
          </>
        );

      case 'CHECKBOX':
        const cq = q as CheckboxQuestion;
        const selectedArr: string[] = (answerValue as string[]) || [];
        const selectedOptions = cq.options.filter(opt =>
          selectedArr.includes(opt.id),
        );
        return (
          <>
            {renderVideo(q.videoUrl)}
            {cq.options?.map(opt => {
              const isSelected = selectedArr.includes(opt.id);
              const toggle = () => {
                if (isSelected) {
                  handleAnswerChange(
                    q.id,
                    selectedArr.filter(id => id !== opt.id),
                  );
                } else {
                  handleAnswerChange(q.id, [...selectedArr, opt.id]);
                }
              };
              return (
                <Pressable
                  key={opt.id}
                  style={[styles.optionRow, isSelected && styles.optionRowSelected]}
                  onPress={toggle}
                >
                  <View
                    style={[
                      styles.checkboxOuter,
                      isSelected && styles.checkboxOuterSelected,
                    ]}
                  >
                    {isSelected && (
                      <Text style={styles.checkboxInnerSelected}>✓</Text>
                    )}
                  </View>
                  <View style={styles.optionContent}>
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {renderTags(opt.tags)}
                  </View>
                </Pressable>
              );
            })}
            {selectedOptions
              .filter(opt => !!opt.note)
              .map(opt => (
                <View key={opt.id}>{renderHelperNote(opt.note)}</View>
              ))}
            {renderHelperNote(q.helperNote)}
          </>
        );

      case 'SCALE':
        const sq = q as ScaleQuestion;
        const min = sq.min ?? 1;
        const max = sq.max ?? 10;
        const selectedScaleValue =
          typeof answerValue === 'number' ? (answerValue as number) : undefined;
        const midPoint = (min + max) / 2;
        const isLowSideActive =
          typeof selectedScaleValue === 'number' && selectedScaleValue <= midPoint;
        const isHighSideActive =
          typeof selectedScaleValue === 'number' && selectedScaleValue > midPoint;
        const scaleValues = Array.from(
          { length: max - min + 1 },
          (_, idx) => min + idx,
        );
        return (
          <>
            {renderVideo(q.videoUrl)}
            <View style={styles.scaleGrid}>
              {scaleValues.map(value => {
                const isSelected = answerValue === value;
                return (
                  <Pressable
                    key={value}
                    style={[
                      styles.scaleItem,
                      isSelected && styles.scaleItemSelected,
                    ]}
                    onPress={() => handleAnswerChange(q.id, value)}
                  >
                    <Text
                      style={[
                        styles.scaleItemText,
                        isSelected && styles.scaleItemTextSelected,
                      ]}
                    >
                      {value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={styles.scaleLabelsRow}>
              <View style={styles.scaleLabelSide}>
                <View
                  style={[
                    styles.scaleLabelIcon,
                  ]}
                >
                  <SadEmojiIcon
                    width={16}
                    height={16}
                    color={
                      isHighSideActive || selectedScaleValue == null
                        ? Colors.titleTextColorGray
                        : Colors.darkBlue
                    }
                  />
                </View>
                <Text
                  style={[
                    styles.scaleLowLabel,
                    !(isHighSideActive || selectedScaleValue == null) && styles.scaleLowLabelActive,
                  ]}
                >
                  Very difficult
                </Text>
              </View>

              <View style={[styles.scaleLabelSide, styles.scaleLabelSideRight]}>
                <Text
                  style={[
                    styles.scaleHighLabel,
                    !(isLowSideActive || selectedScaleValue == null) && styles.scaleHighLabelActive,
                  ]}
                >
                  Effortless
                </Text>
                <View
                  style={[
                    styles.scaleLabelIcon,
                  ]}
                >
                  <HappyEmojiIcon
                    width={16}
                    height={16}
                    color={
                      isLowSideActive || selectedScaleValue == null
                        ? Colors.titleTextColorGray
                        : Colors.green
                    }
                  />
                </View>
              </View>
            </View>
            {renderHelperNote(q.helperNote)}
          </>
        );

      default:
        return null;
    }
  };

  const renderScreenHeader = useCallback(
    () => (
      <View style={[screenHeaderStyles.bar, screenHeaderStyles.header]}>
        <View style={screenHeaderStyles.headerSide}>
          <Image source={LogoPng} style={screenHeaderStyles.headerLogo} resizeMode="contain" />
        </View>

        <Text style={screenHeaderStyles.headerTitle}>LB50 Health</Text>

        <View style={[screenHeaderStyles.headerSide, screenHeaderStyles.headerRight, styles.headerRightSlot]}>
          <QuestionHeaderIcon width={18} height={18} />
          {/* <Pressable
            accessibilityRole="button"
            onPress={() => setSafetyNoticeVisible(true)}
          >
            <QuestionHeaderIcon width={18} height={18} />
          </Pressable> */}
        </View>
      </View>
    ),
    [],
  );

  const handleSafetyExit = useCallback(async () => {
    setSafetyNoticeBlocking(false);
    setSafetyNoticeVisible(false);
    try {
      await setQuestionnaireCompleted(false);
      await setQuestionnaireRestartPending(true);
      try {
        await resetQuestionnaireProgressApi();
        await setQuestionnaireRestartPending(false);
      } catch {
        // Keep restart pending so the next launch resets from question 1.
      }
    } finally {
      await removeAuthToken();
      await removeProfilePhotoUri();
      dispatch(logout());
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Auth' }],
        }),
      );
    }
  }, [dispatch, navigation]);

  if (loading || !currentQuestions.length) {
    return (
      <DashboardScreenLayout header={renderScreenHeader()} safeAreaEdges={['top']}>
        <View style={[styles.container, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={Colors.green} />
        </View>
      </DashboardScreenLayout>
    );
  }

  const dismissSafetyNotice = () => {
    if (safetyNoticeBlocking) {
      return;
    }
    setSafetyNoticeVisible(false);
  };
  const dismissAdditionalInfo = () => {
    setAdditionalInfoVisible(false);
    setPendingWarnResponse(null);
    setPendingWarnLink(undefined);
  };

  const doctorFormLink = pendingWarnLink;
  const doctorFormDisplayName = doctorFormLink
    ? (() => {
      try {
        const base = new URL(doctorFormLink).pathname.split('/').filter(Boolean).pop();
        return base ? decodeURIComponent(base) : 'Physician_Approval_V2.pdf';
      } catch {
        return 'Physician_Approval_V2.pdf';
      }
    })()
    : 'Physician_Approval_V2.pdf';

  const onDownloadDoctorForm = async () => {
    if (downloadingDoctorForm) {
      return;
    }
    setDownloadingDoctorForm(true);
    try {
      const result = await downloadDoctorForm(doctorFormLink);
      if (result.success) {
        Snackbar.show({
          text: result.message,
          duration: Snackbar.LENGTH_LONG,
        });
      } else {
        showApiErrorAlert(result.message, 'Download failed');
      }
    } finally {
      setDownloadingDoctorForm(false);
    }
  };

  const onAdditionalInfoContinue = async () => {
    setAdditionalInfoVisible(false);
    if (pendingWarnResponse) {
      const data = pendingWarnResponse;
      setPendingWarnResponse(null);
      setPendingWarnLink(undefined);
      if (isQuestionnaireComplete(data)) {
        await submitQuestionnaire();
        return;
      }
      applyQuestionResponse(data);
      return;
    }
    await onNext();
  };

  const renderAdditionalInfoLayer = () => (
    <View style={styles.additionalInfoOverlay}>
      <Pressable
        style={styles.additionalInfoBackdrop}
        accessibilityRole="button"
        accessibilityLabel="Additional info modal backdrop"
      />

      <View style={styles.additionalInfoCard} accessibilityViewIsModal>
        <View style={styles.additionalInfoCardInner}>
          <ModalBackgroundIcon
            width={260}
            height={260}
            style={styles.additionalInfoWatermark}
          />

          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.additionalInfoScroll}
          >
            <View style={styles.additionalInfoTopIconOuter}>
              <AdditionalInfoIcon width={24} height={24} />
            </View>

            <Text style={styles.additionalInfoTitle}>Additional Info Required</Text>
            <Text style={styles.additionalInfoLead}>
              You need to ask your doctor to fill this form before you can continue
              to use our method.
            </Text>

            <View style={styles.additionalInfoSection}>
              <View style={styles.additionalInfoSectionIconBox}>
                <ClinicalIcon width={18} height={18} />
              </View>
              <View style={styles.additionalInfoSectionBody}>
                <Text style={styles.additionalInfoSectionHeading}>
                  Clinical Necessity
                </Text>
                <Text style={styles.additionalInfoSectionText}>
                  Based on your recent assessment, a medical practitioner must
                  validate your physiological parameters to ensure safety.
                </Text>
              </View>
            </View>

            <View style={styles.additionalInfoDocCard}>
              <View style={styles.additionalInfoDocRow}>
                <View style={styles.additionalInfoDocIconBox}>
                  <PDFIcon width={18} height={18} />
                </View>
                <View style={styles.additionalInfoDocBody}>
                  <Text style={styles.additionalInfoDocLabel}>Document</Text>
                  <Text style={styles.additionalInfoDocName}>
                    {doctorFormDisplayName}
                  </Text>
                </View>
              </View>

              <PrimaryButtonLeft
                title={downloadingDoctorForm ? 'Downloading…' : 'Download Doctor Form'}
                onPress={onDownloadDoctorForm}
                disabled={downloadingDoctorForm}
                style={styles.additionalInfoDownloadBtn}
                titleStyle={styles.additionalInfoDownloadBtnText}
                renderLeftAccessory={() => (
                  <View style={styles.additionalInfoDownloadIconCircle}>
                    {downloadingDoctorForm ? (
                      <ActivityIndicator size="small" color={Colors.darkBlue} />
                    ) : (
                      <DocumentDownloadIcon width={18} height={18} />
                    )}
                  </View>
                )}
              />
            </View>

            <Text style={styles.modalLine} />

            <Text style={styles.additionalInfoNextTitle}>What happens next?</Text>

            <View style={styles.additionalInfoNextRow}>
              <Text style={styles.additionalInfoNextIndex}>01.</Text>
              <Text style={styles.additionalInfoNextText}>
                Download and print the medical clearance document.
              </Text>
            </View>
            <View style={styles.additionalInfoNextRow}>
              <Text style={styles.additionalInfoNextIndex}>02.</Text>
              <Text style={styles.additionalInfoNextText}>
                Review it with your primary care physician during your next visit.
              </Text>
            </View>
            <View style={styles.additionalInfoNextRow}>
              <Text style={styles.additionalInfoNextIndex}>03.</Text>
              <Text style={styles.additionalInfoNextText}>
                Upload the signed copy in the 'Profile' section to unlock the full
                method.
              </Text>
            </View>

            <View style={styles.additionalInfoActions}>
              <PrimaryButtonLeft
                title="Close"
                onPress={dismissAdditionalInfo}
                style={styles.prevBtn}
                titleStyle={styles.prevBtnText}
                renderLeftAccessory={() => (
                  <View style={styles.continueArrowCircleLeft}>
                    <CloseIcon width={14} height={14} />
                  </View>
                )}
              />

              <PrimaryButton
                title="Continue"
                onPress={onAdditionalInfoContinue}
                disabled={submitting}
                loading={submitting}
                style={styles.continueBtn}
                titleStyle={styles.continueText}
                renderRightAccessory={() => (
                  <View style={styles.continueArrowCircle}>
                    <RightArrow width={14} height={14} />
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );

  const renderSafetyFirstNoticeLayer = () => (
    <View style={styles.safetyModalOverlay}
    >
      <Pressable
        style={styles.safetyModalBackdrop}
        onPress={dismissSafetyNotice}
        accessibilityRole="button"
        accessibilityLabel="Dismiss notice"
      />
      <Pressable
        style={styles.safetyModalCard}
        onPress={() => { }}
        accessibilityViewIsModal>
        <View style={styles.safetyModalCardInner}>
          <Text style={styles.safetyModalWatermark} pointerEvents="none">
            <ModalBackgroundIcon width={120} height={120} />
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            contentContainerStyle={styles.safetyModalScroll}>
            <View style={styles.safetyModalIconOuter}>
              <WarningIcon width={30} height={30} />
            </View>

            <Text style={styles.safetyModalTitle}>Safety First Notice</Text>
            <Text style={styles.safetyModalLead}>
              Sorry, due to the condition you specified, you should not use our
              method.
            </Text>

            <View style={styles.safetyModalSection}>
              <View style={styles.safetyModalSectionIconBox}>
                <MedicalProtocolIcon width={20} height={20} />
              </View>
              <View style={styles.safetyModalSectionBody}>
                <Text style={styles.safetyModalSectionHeading}>
                  Medical Protocol
                </Text>
                <Text style={styles.safetyModalSectionText}>
                  The LB50 Health methodology involves physiological adjustments
                  that may interfere with the management of chronic conditions like{' '}
                  <Text style={styles.safetyModalEmphasis}>Type 1 Diabetes</Text>.
                </Text>
              </View>
            </View>

            <View style={[styles.safetyModalSection, styles.safetyModalSectionMarginTop]}>
              <View style={styles.safetyModalSectionIconBox}>
                <WellbeingIcon width={20} height={20} />
              </View>
              <View style={styles.safetyModalSectionBody}>
                <Text style={styles.safetyModalSectionHeading}>
                  Your Wellbeing
                </Text>
                <Text style={styles.safetyModalSectionText}>
                  We prioritize your clinical safety above all. We recommend
                  consulting with your specialist physician before starting any
                  new metabolic programs.
                </Text>
              </View>
            </View>

            {/* <PrimaryButtonLeft
              title="Exit"
              onPress={handleSafetyExit}
              style={styles.safetyModalCloseBtn}
              titleStyle={styles.safetyModalCloseLabel}
              renderLeftAccessory={() => (
                <View style={styles.safetyModalCloseIconCircle}>
                  <ExitIcon width={20} height={20} />
                </View>
              )}
            /> */}
            <PrimaryButtonLeft
              title={'Exit'}
              onPress={handleSafetyExit}
              style={styles.safetyModalCloseBtn}
              titleStyle={styles.safetyModalCloseLabel}
              renderLeftAccessory={() => (
                <View style={styles.safetyModalCloseIconCircle}>
                  <ExitIcon width={20} height={20} />
                </View>
              )}
            />
          </ScrollView>
        </View>
      </Pressable>
    </View>
  );

  return (
    <>
      <DashboardScreenLayout header={renderScreenHeader()} safeAreaEdges={['top']}>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.keyboardDismissArea}>
              <View style={styles.progressSection}>
                <Text style={styles.vitalsText}>Vitals Check</Text>
                <View style={styles.stepRow}>
                  <Text style={styles.stepText}>
                    Step {displayStep} of {displayTotal}
                  </Text>
                  <View style={styles.percentPill}>
                    <Text style={styles.percentText}>
                      {percentComplete}% Complete
                    </Text>
                  </View>
                </View>
                <View style={styles.progressBarBg}>
                  <View
                    style={[
                      styles.progressBarFill,
                      { width: `${percentComplete}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.sheet}>
                <KeyboardAvoidingView
                  style={styles.keyboardAvoidArea}
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                  keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
                >
                  <View style={styles.card}>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      keyboardShouldPersistTaps="handled"
                      contentContainerStyle={styles.cardScrollContent}
                      automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
                    >
                      {currentQuestions.map((question, index) => (
                        <View
                          key={question.id}
                          style={index > 0 ? styles.questionBlock : undefined}
                        >
                          <View style={styles.questionHeader}>
                            <View style={styles.questionIconBox}>
                              <QuestionIcon width={16} height={16} />
                            </View>
                            <View style={styles.questionHeaderContent}>
                              <Text style={styles.questionTitle}>
                                {question.title}
                              </Text>
                            </View>
                          </View>

                          {!!question.description &&
                            renderQuestionDescriptionText(question.description)}

                          {renderQuestion(question)}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </KeyboardAvoidingView>

                <View
                  style={[
                    styles.footer,
                    {
                      paddingBottom: Math.max(insets.bottom + 20, 36),
                    },
                  ]}
                >
                  <PrimaryButtonLeft
                    title={'Previous'}
                    onPress={onPrev}
                    disabled={(apiData?.current_count ?? 1) <= 1 || submitting}
                    style={styles.prevBtn}
                    titleStyle={styles.prevBtnText}
                    renderLeftAccessory={() => (
                      <View style={styles.continueArrowCircleLeft}>
                        <LeftArrow width={14} height={14} />
                      </View>
                    )}
                  />

                  <PrimaryButton
                    title={isLastStep ? 'Finish' : 'Next'}
                    onPress={onNext}
                    disabled={submitting}
                    loading={submitting}
                    style={styles.continueBtn}
                    titleStyle={styles.continueText}
                    renderRightAccessory={() => (
                      <View style={styles.continueArrowCircle}>
                        <RightArrow width={14} height={14} />
                      </View>
                    )}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </DashboardScreenLayout>

      {Platform.OS === 'ios' && safetyNoticeVisible ? (
        <FullWindowOverlay unstable_accessibilityContainerViewIsModal>
          {renderSafetyFirstNoticeLayer()}
        </FullWindowOverlay>
      ) : null}

      {Platform.OS === 'android' ? (
        <Modal
          transparent
          visible={safetyNoticeVisible}
          animationType="fade"
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={dismissSafetyNotice}>
          {renderSafetyFirstNoticeLayer()}
        </Modal>
      ) : null}

      <Modal
        transparent
        visible={additionalInfoVisible}
        animationType="fade"
        statusBarTranslucent
        navigationBarTranslucent
        onRequestClose={dismissAdditionalInfo}
      >
        {renderAdditionalInfoLayer()}
      </Modal>
    </>
  );
}
