import React from 'react';
import { Text as SvgText } from 'react-native-svg';
import {
  CHART_X_AXIS_FONT_SIZE,
  CHART_X_AXIS_LINE_HEIGHT,
  getChartXLabelLines,
} from '@/components/chartUtils';
import { Colors } from '@/theme/colors';

type Props = {
  x: number;
  baseY: number;
  label: string;
};

export function ChartXAxisLabel({ x, baseY, label }: Props) {
  const { line1, line2 } = getChartXLabelLines(label);

  if (!line2) {
    return (
      <SvgText
        x={x}
        y={baseY}
        fontSize={CHART_X_AXIS_FONT_SIZE}
        fill={Colors.titleTextColorGray}
        textAnchor="middle"
      >
        {line1}
      </SvgText>
    );
  }

  return (
    <>
      <SvgText
        x={x}
        y={baseY}
        fontSize={CHART_X_AXIS_FONT_SIZE}
        fill={Colors.titleTextColorGray}
        textAnchor="middle"
      >
        {line1}
      </SvgText>
      <SvgText
        x={x}
        y={baseY + CHART_X_AXIS_LINE_HEIGHT}
        fontSize={CHART_X_AXIS_FONT_SIZE}
        fill={Colors.titleTextColorGray}
        textAnchor="middle"
      >
        {line2}
      </SvgText>
    </>
  );
}
