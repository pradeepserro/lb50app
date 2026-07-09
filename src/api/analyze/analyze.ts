export const ANALYZE_TAB_TYPE_IDS = {
  SIX_PILLARS: 1,
  BMI: 2,
  WEEKLY: 3,
} as const;

export type AnalyzeTabTypeId =
  (typeof ANALYZE_TAB_TYPE_IDS)[keyof typeof ANALYZE_TAB_TYPE_IDS];

export const ANALYZE_GRAPH_TYPE_IDS = {
  RADIAL: 1,
  METER: 2,
  LINE: 3,
  BAR: 4,
} as const;

export type AnalyzeGraphTypeId =
  (typeof ANALYZE_GRAPH_TYPE_IDS)[keyof typeof ANALYZE_GRAPH_TYPE_IDS];

export function sortGraphsById(graphs: AnalyzeGraph[]): AnalyzeGraph[] {
  return [...graphs].sort((a, b) => a.id - b.id);
}

export interface AnalyzeDataset {
  labels: string;
  values: number[];
  colors: string;
}

export interface AnalyzeGaugeStep {
  range: string;
  color: string;
  label: string;
}

export interface AnalyzeGauge {
  range: string;
  steps: AnalyzeGaugeStep[];
}

export interface AnalyzeGraph {
  id: number;
  type_id: number;
  header: string;
  sub_header: string;
  labels?: string[];
  dataset: AnalyzeDataset[];
  gauge?: AnalyzeGauge[];
}

export interface AnalyzeResponse {
  graphs: AnalyzeGraph[];
}

export function parseAnalyzeRange(range: string): { min: number; max: number } {
  const parts = range.split('-').map((part) => Number(part.trim()));
  const min = parts[0] ?? 0;
  const max = parts[1] ?? min;
  return { min, max };
}

export function getAnalyzeMaxValue(values: number[], floor = 10): number {
  const peak = values.length ? Math.max(...values) : 0;
  if (peak <= floor) {
    return floor;
  }
  return Math.ceil(peak / 2) * 2;
}
