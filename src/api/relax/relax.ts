export const RELAX_TYPE_ID = {
  ExerciseSnack: 1,
  MusicSnack: 2,
  MindfulBreathing: 3,
  PositiveReflection: 4,
  SensoryGrounding: 5,
  MuscleRelaxation: 6,
} as const;

export type RelaxTypeId = (typeof RELAX_TYPE_ID)[keyof typeof RELAX_TYPE_ID];

export interface RelaxResponse {
  relax_score: string;
  relax_duration: string;
  relax_insight: string;
}

export interface SaveRelaxParams {
  type_id: RelaxTypeId;
  duration: number;
}

export interface SaveRelaxResponse {
  message: string;
}
