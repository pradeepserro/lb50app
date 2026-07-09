import type { LearnTopicId } from '@/api/learn/learn';

export type HomeStackParamList = {
  HomeMain: undefined;
  Learn: undefined;
  MetabolicSyndromeQuiz: {
    topicId: LearnTopicId;
    topicTitle: string;
  };
  DailyHealthLog: undefined;
  Analyze: undefined;
  FunQuiz: undefined;
};

