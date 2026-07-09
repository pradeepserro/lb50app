import { LEARN_TOPIC_ID, type LearnTopicId } from '@/api/learn/learn';

export type LearnTopic = {
  id: LearnTopicId;
  label: string;
  title: string;
};

export const LEARN_TOPICS: LearnTopic[] = [
  {
    id: LEARN_TOPIC_ID.MetabolicSyndrome,
    label: 'Metabolic\nSyndrome',
    title: 'Metabolic Syndrome',
  },
  { id: LEARN_TOPIC_ID.Nutrition, label: 'Nutrition', title: 'Nutrition' },
  {
    id: LEARN_TOPIC_ID.IntermittentFasting,
    label: 'Intermittent\nFasting',
    title: 'Intermittent Fasting',
  },
  { id: LEARN_TOPIC_ID.Mobility, label: 'Mobility', title: 'Mobility' },
  {
    id: LEARN_TOPIC_ID.MentalHealth,
    label: 'Stress\nResilience',
    title: 'Stress Resilience',
  },
  { id: LEARN_TOPIC_ID.Habits, label: 'Habits', title: 'Habits' },
];
