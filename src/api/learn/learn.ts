export const LEARN_TOPIC_ID = {
  MetabolicSyndrome: 1,
  Nutrition: 2,
  IntermittentFasting: 3,
  Mobility: 4,
  MentalHealth: 5,
  Habits: 6,
} as const;

export type LearnTopicId = (typeof LEARN_TOPIC_ID)[keyof typeof LEARN_TOPIC_ID];

export interface LearnItem {
  header: string;
  description: string;
  url: string;
  order_no: number;
}

export interface LearnResponse {
  learn: LearnItem[];
  count: number;
}

export interface LearnStatusResponse {
  learn_score: string;
  quiz_completed: string;
}

