import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type QuestionType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'MULTIPLE_TEXT'
  | 'RADIO'
  | 'CHECKBOX'
  | 'SCALE';

type QuestionnaireAnswers = Record<string, any>;

type QuestionnaireState = {
  currentStep: number;
  answers: QuestionnaireAnswers;
};

const initialState: QuestionnaireState = {
  currentStep: 0,
  answers: {},
};

type InitDefaultsPayload = {
  questions: Array<{ id: string; type: QuestionType }>;
};

const questionnaireSlice = createSlice({
  name: 'questionnaire',
  initialState,
  reducers: {
    initDefaults: (state, action: PayloadAction<InitDefaultsPayload>) => {
      for (const q of action.payload.questions) {
        if (Object.prototype.hasOwnProperty.call(state.answers, q.id)) continue;
        if (q.type === 'CHECKBOX') state.answers[q.id] = [];
        else if (q.type === 'MULTIPLE_TEXT') state.answers[q.id] = {};
        else state.answers[q.id] = '';
      }
    },
    setAnswer: (
      state,
      action: PayloadAction<{ questionId: string; value: any }>,
    ) => {
      state.answers[action.payload.questionId] = action.payload.value;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    resetQuestionnaire: () => initialState,
  },
});

export const {
  initDefaults,
  setAnswer,
  setCurrentStep,
  resetQuestionnaire,
} = questionnaireSlice.actions;

export default questionnaireSlice.reducer;
