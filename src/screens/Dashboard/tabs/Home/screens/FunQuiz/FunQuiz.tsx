import type { QuizAnswer, QuizQuestion } from '@/api/quiz/quiz';
import { fetchQuizApi, saveQuizApi } from '@/api/quiz/quizEndpoints';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { PrimaryButton } from '@/components/PrimaryButton';
import { PrimaryButtonLeft } from '@/components/PrimaryButtonLeft';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import type { HomeStackParamList } from '@/screens/Dashboard/tabs/Home/navigation/types';
import { styles } from '@/screens/Dashboard/tabs/Home/screens/FunQuiz/FunQuiz.styles';
import CheckWhiteIcon from '@assets/icons/check_white.svg';
import CloseIcon from '@assets/icons/close.svg';
import EmptyStateIcon from '@assets/icons/empty_state.png';
import FirstAidIcon from '@assets/icons/first_aid.svg';
import LeftArrow from '@assets/icons/left_arrow_white.svg';
import LogoPng from '@assets/icons/logo.png';
import BulbIcon from '@assets/icons/quiz_bulb.svg';
import RightArrow from '@assets/icons/right_arrow_white.svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';

type QuestionAnswerState = {
    answerId: number;
    isCorrect: boolean;
    feedbackTitle: string | null;
    feedbackBody: string | null;
    showFeedback: boolean;
};

type Props = NativeStackScreenProps<HomeStackParamList, 'FunQuiz'>;

function sortQuizQuestions(questions: QuizQuestion[]): QuizQuestion[] {
    return [...questions].sort((a, b) => a.id - b.id);
}

function pickIncorrectMessage(messages: string[]): string {
    const index = Math.floor(Math.random() * messages.length);
    return messages[index] ?? messages[0]!;
}

function buildAnswerState(
    answer: QuizAnswer,
    incorrectMessages: string[],
): QuestionAnswerState {
    const isCorrect = answer.correct === 1;

    if (isCorrect) {
        const description = answer.correct_description?.trim();
        if (!description) {
            return {
                answerId: answer.id,
                isCorrect,
                feedbackTitle: null,
                feedbackBody: null,
                showFeedback: false,
            };
        }

        return {
            answerId: answer.id,
            isCorrect,
            feedbackTitle: 'Correct!',
            feedbackBody: description,
            showFeedback: true,
        };
    }

    const messages = incorrectMessages
        .map(message => message?.trim())
        .filter((message): message is string => Boolean(message));

    if (!messages.length) {
        return {
            answerId: answer.id,
            isCorrect,
            feedbackTitle: null,
            feedbackBody: null,
            showFeedback: false,
        };
    }

    return {
        answerId: answer.id,
        isCorrect,
        feedbackTitle: pickIncorrectMessage(messages),
        feedbackBody: null,
        showFeedback: true,
    };
}

export function FunQuiz({ navigation }: Props) {
    const [loading, setLoading] = useState(true);
    const [savingAnswer, setSavingAnswer] = useState(false);
    const [questions, setQuestions] = useState<QuizQuestion[]>(() => []);
    const [incorrectMessages, setIncorrectMessages] = useState<string[]>(
        () => [],
    );
    const [questionIndex, setQuestionIndex] = useState(0);
    const [answersByQuestionId, setAnswersByQuestionId] = useState<
        Record<number, QuestionAnswerState>
    >({});

    const total = questions.length;
    const currentQuestion = questions[questionIndex];
    const currentAnswer = currentQuestion
        ? answersByQuestionId[currentQuestion.id]
        : undefined;
    const isEmptyState = !loading && !currentQuestion;

    const loadQuizData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchQuizApi();
            setQuestions(sortQuizQuestions(data.quizzes ?? []));
            setIncorrectMessages(data.incorrect_answer ?? []);
            setQuestionIndex(0);
            setAnswersByQuestionId({});
        } catch (error) {
            showApiErrorAlert(error, 'Failed to load quiz');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadQuizData();
    }, [loadQuizData]);

    const percentComplete = useMemo(() => {
        if (!total) {
            return 0;
        }
        const pct = Math.round(((questionIndex + 1) / total) * 100);
        return Math.min(100, Math.max(0, pct));
    }, [questionIndex, total]);

    const goToQuestion = (nextIndex: number) => {
        const clamped = Math.min(total - 1, Math.max(0, nextIndex));
        setQuestionIndex(clamped);
    };

    const isLastQuestion = total > 0 && questionIndex === total - 1;

    const onPrev = () => goToQuestion(questionIndex - 1);

    const onNext = async () => {
        if (!currentQuestion || !currentAnswer || savingAnswer) {
            return;
        }

        setSavingAnswer(true);
        try {
            await saveQuizApi({
                question_id: currentQuestion.id,
                answer_id: currentAnswer.answerId,
                correct: currentAnswer.isCorrect ? 1 : 0,
            });

            if (isLastQuestion) {
                if (navigation.canGoBack()) {
                    navigation.goBack();
                }
                return;
            }

            goToQuestion(questionIndex + 1);
        } catch (error) {
            showApiErrorAlert(error, 'Failed to save answer');
        } finally {
            setSavingAnswer(false);
        }
    };

    const onSelectAnswer = (answer: QuizAnswer) => {
        if (!currentQuestion || currentAnswer || savingAnswer) {
            return;
        }

        const nextAnswerState = buildAnswerState(answer, incorrectMessages);
        setAnswersByQuestionId(prev => ({
            ...prev,
            [currentQuestion.id]: nextAnswerState,
        }));
    };

    const renderOption = (answer: QuizAnswer) => {
        const isSelected = currentAnswer?.answerId === answer.id;
        const hasAnswered = Boolean(currentAnswer);
        const isCorrect = answer.correct === 1;

        const rowStyle = [
            styles.optionRow,
            isSelected && currentAnswer?.isCorrect && styles.optionRowSelectedCorrect,
            isSelected && currentAnswer && !currentAnswer.isCorrect && styles.optionRowSelectedIncorrect,
        ];

        const radioStyle = [
            styles.optionRadioOuter,
            isSelected && isCorrect && styles.optionRadioOuterCorrect,
            isSelected && !isCorrect && styles.optionRadioOuterIncorrect,
        ];

        const textStyle = [
            styles.optionText,
            isSelected && isCorrect && styles.optionTextSelected,
            isSelected && !isCorrect && styles.optionTextIncorrect,
        ];

        return (
            <Pressable
                key={answer.id}
                accessibilityRole="button"
                style={rowStyle}
                disabled={hasAnswered}
                onPress={() => onSelectAnswer(answer)}
            >
                <View style={radioStyle}>
                    {isSelected && isCorrect ? (
                        <CheckWhiteIcon width={10} height={10} />
                    ) : isSelected && !isCorrect ? (
                        <CloseIcon width={10} height={10} />
                    ) : null}
                </View>
                <Text style={textStyle}>{answer.answer}</Text>
            </Pressable>
        );
    };

    const renderFeedback = () => {
        if (!currentAnswer?.showFeedback) {
            return null;
        }

        return (
            <View style={styles.feedbackCard}>
                <View style={styles.feedbackHeader}>
                    {currentAnswer.isCorrect ? (
                        <BulbIcon width={18} height={18} />
                    ) : null}
                    <Text
                        style={
                            currentAnswer.isCorrect
                                ? styles.feedbackTitleCorrect
                                : styles.feedbackTitleIncorrect
                        }
                    >
                        {currentAnswer.feedbackTitle}
                    </Text>
                </View>
                {currentAnswer.feedbackBody ? (
                    <Text style={styles.feedbackBody}>{currentAnswer.feedbackBody}</Text>
                ) : null}
            </View>
        );
    };

    const renderContent = () => {
        if (loading) {
            return <LoadingOverlay visible={true} />;
        }

        if (!currentQuestion) {
            return (
                <View style={styles.emptyStateContainer}>
                    <Image
                        source={EmptyStateIcon}
                        style={styles.emptyStateImage}
                        resizeMode="contain"
                    />
                </View>
            );
        }

        return (
            <>
                <Text style={styles.funQuizLabel}>Fun quiz</Text>
                <View style={styles.stepRow}>
                    <Text style={styles.stepText}>
                        Step {questionIndex + 1} of {total}
                    </Text>
                    <View style={styles.percentPill}>
                        <Text style={styles.percentText}>{percentComplete}% Complete</Text>
                    </View>
                </View>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${percentComplete}%` }]} />
                </View>

                <View style={styles.cardArea}>
                    <View style={styles.questionCard}>
                        <View style={styles.questionIconCircle}>
                            <FirstAidIcon width={25} height={25} />
                        </View>
                        <Text style={styles.questionTitle}>{currentQuestion.question}</Text>
                        <Text style={styles.questionHint}>
                            Select the best option based on common clinical diagnostic criteria.
                        </Text>
                    </View>

                    <View style={styles.optionsList}>
                        {currentQuestion.answers.map(renderOption)}
                    </View>

                    {renderFeedback()}

                    <View style={styles.footer}>
                        <PrimaryButtonLeft
                            title="Previous"
                            onPress={onPrev}
                            disabled={questionIndex === 0}
                            style={styles.prevBtn}
                            titleStyle={styles.prevBtnText}
                            renderLeftAccessory={() => (
                                <View style={styles.continueArrowCircleLeft}>
                                    <LeftArrow width={14} height={14} />
                                </View>
                            )}
                        />

                        <PrimaryButton
                            title={isLastQuestion ? 'Finish' : 'Next'}
                            onPress={onNext}
                            disabled={!currentAnswer || savingAnswer}
                            loading={savingAnswer}
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
            </>
        );
    };

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

                    <Text style={screenHeaderStyles.headerTitle}>Metabolic Syndrome</Text>

                    <View style={[screenHeaderStyles.headerSide, styles.headerSideRight]} />
                </View>
            }
        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[
                    styles.scrollContent,
                    isEmptyState && styles.scrollContentCentered,
                ]}
            >
                <View>{renderContent()}</View>
            </ScrollView>
        </DashboardScreenLayout>
    );
};
