import { RELAX_TYPE_ID, type RelaxTypeId } from '@/api/relax/relax';

export type RelaxTopic = {
  id: RelaxTypeId;
  label: string;
};

export const RELAX_TOPICS: RelaxTopic[] = [
  { id: RELAX_TYPE_ID.ExerciseSnack, label: 'Exercise\nSnack' },
  { id: RELAX_TYPE_ID.MusicSnack, label: 'Music\nSnack' },
  { id: RELAX_TYPE_ID.MindfulBreathing, label: 'Mindful\nBreathing' },
  { id: RELAX_TYPE_ID.PositiveReflection, label: 'Positive\nReflection' },
  { id: RELAX_TYPE_ID.SensoryGrounding, label: 'Sensory\nGrounding' },
  { id: RELAX_TYPE_ID.MuscleRelaxation, label: 'Muscle\nRelaxation' },
];
