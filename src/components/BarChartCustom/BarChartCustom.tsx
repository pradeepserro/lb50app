import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Line, Rect, Text as SvgText } from 'react-native-svg';
import type { AnalyzeDataset } from '@/api/analyze/analyze';
import {
  CHART_WIDTH,
  CHART_X_AXIS_BOTTOM_PADDING,
  buildYAxisTicks,
  getChartYMax,
} from '@/components/chartUtils';
import { ChartXAxisLabel } from '@/components/ChartXAxisLabel/ChartXAxisLabel';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

type Props = {
  labels: string[];
  dataset: AnalyzeDataset[];
};

const CHART_HEIGHT = 220;
const PADDING_LEFT = 34;
const PADDING_RIGHT = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = CHART_X_AXIS_BOTTOM_PADDING;
const PLOT_WIDTH = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
const PLOT_HEIGHT = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

export function BarChartCustom({ labels, dataset }: Props) {
  const allValues = dataset.flatMap((item) => item.values);
  const maxValue = getChartYMax(allValues);
  const yTicks = buildYAxisTicks(maxValue);
  const groupWidth = labels.length > 0 ? PLOT_WIDTH / labels.length : PLOT_WIDTH;
  const barWidth = Math.min(18, (groupWidth - 8) / Math.max(dataset.length, 1));

  const getY = (value: number) =>
    PADDING_TOP + PLOT_HEIGHT - (value / maxValue) * PLOT_HEIGHT;

  return (
    <View style={styles.container}>
      <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
        <G>
          {yTicks.map((tick) => {
            const y = getY(tick);
            return (
              <G key={`grid-${tick}`}>
                <Line
                  x1={PADDING_LEFT}
                  y1={y}
                  x2={PADDING_LEFT + PLOT_WIDTH}
                  y2={y}
                  stroke="#E5E7EF"
                  strokeWidth={1}
                />
                <SvgText
                  x={PADDING_LEFT - 8}
                  y={y + 4}
                  fontSize="10"
                  fill={Colors.titleTextColorGray}
                  textAnchor="end"
                >
                  {tick}
                </SvgText>
              </G>
            );
          })}

          {labels.map((label, labelIndex) => {
            const groupStart = PADDING_LEFT + labelIndex * groupWidth;
            const totalBarsWidth = barWidth * dataset.length;
            const offset = (groupWidth - totalBarsWidth) / 2;

            return (
              <G key={`${label}-${labelIndex}`}>
                {dataset.map((item, seriesIndex) => {
                  const value = item.values[labelIndex] ?? 0;
                  const x = groupStart + offset + seriesIndex * barWidth;
                  const y = getY(value);
                  const height = PADDING_TOP + PLOT_HEIGHT - y;

                  return (
                    <Rect
                      key={`${item.labels}-${labelIndex}`}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={height}
                      fill={item.colors}
                      rx={2}
                    />
                  );
                })}

                <ChartXAxisLabel
                  x={groupStart + groupWidth / 2}
                  baseY={CHART_HEIGHT - 20}
                  label={label}
                />
              </G>
            );
          })}
        </G>
      </Svg>

      <View style={styles.legendRow}>
        {dataset.map((item) => (
          <View key={item.labels} style={styles.legendItem}>
            <View style={[styles.legendSwatch, { backgroundColor: item.colors }]} />
            <Text style={styles.legendLabel}>{item.labels}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.darkBlue,
  },
});
