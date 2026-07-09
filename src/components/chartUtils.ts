import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CHART_HORIZONTAL_PADDING = 24;
export const CHART_WIDTH = SCREEN_WIDTH - CHART_HORIZONTAL_PADDING * 2 - 24;

export function getChartYMax(values: number[], floor = 10): number {
  const peak = values.length ? Math.max(...values) : 0;
  if (peak <= floor) {
    return floor;
  }
  return Math.ceil(peak / 10) * 10;
}

export function buildYAxisTicks(maxValue: number, steps = 4): number[] {
  const step = maxValue / steps;
  return Array.from({ length: steps + 1 }, (_, index) =>
    Math.round(maxValue - step * index),
  );
}

export type ChartXLabelLines = {
  line1: string;
  line2?: string;
};

export const CHART_X_AXIS_FONT_SIZE = 9;
export const CHART_X_AXIS_LINE_HEIGHT = 11;
export const CHART_X_AXIS_BOTTOM_PADDING = 40;

export function getChartXLabelLines(label: string): ChartXLabelLines {
  const trimmed = label.trim();
  const isoMatch = trimmed.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!isoMatch) {
    return { line1: trimmed };
  }

  const year = Number(isoMatch[1]);
  const month = Number(isoMatch[2]) - 1;
  const day = Number(isoMatch[3]);
  const parsed = new Date(year, month, day, 12, 0, 0);
  if (Number.isNaN(parsed.getTime())) {
    return { line1: trimmed };
  }

  return {
    line1: String(parsed.getDate()),
    line2: parsed.toLocaleDateString('en-GB', { month: 'short' }),
  };
}
