import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Line, Polyline, Text as SvgText } from 'react-native-svg';
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

export function LineChartCustom({ labels, dataset }: Props) {
  const allValues = dataset.flatMap((item) => item.values);
  const maxValue = getChartYMax(allValues);
  const yTicks = buildYAxisTicks(maxValue);

  const getX = (index: number) =>
    labels.length <= 1 ? PADDING_LEFT + PLOT_WIDTH / 2 : PADDING_LEFT + (index / (labels.length - 1)) * PLOT_WIDTH;

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

          {dataset.map((item, seriesIndex) => {
            const points = item.values
              .map((value, index) => `${getX(index)},${getY(value)}`)
              .join(' ');

            return (
              <Polyline
                key={`${item.labels}-${seriesIndex}`}
                points={points}
                fill="none"
                stroke={item.colors}
                strokeWidth={2.5}
              />
            );
          })}

          {labels.map((label, index) => (
            <ChartXAxisLabel
              key={`${label}-${index}`}
              x={getX(index)}
              baseY={CHART_HEIGHT - 20}
              label={label}
            />
          ))}
        </G>
      </Svg>

      <View style={styles.legendRow}>
        {dataset.map((item) => (
          <View key={item.labels} style={styles.legendItem}>
            <View style={[styles.legendLine, { backgroundColor: item.colors }]} />
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
  legendLine: {
    width: 16,
    height: 3,
    borderRadius: 2,
  },
  legendLabel: {
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.darkBlue,
  },
});
