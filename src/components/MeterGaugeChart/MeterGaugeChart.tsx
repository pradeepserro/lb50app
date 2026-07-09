import {
  parseAnalyzeRange,
  type AnalyzeDataset,
  type AnalyzeGauge,
} from '@/api/analyze/analyze';
import { CHART_WIDTH } from '@/components/chartUtils';
import { Colors } from '@/theme/colors';
import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, G, Path, Polygon, Text as SvgText } from 'react-native-svg';

type Props = {
  gauge?: AnalyzeGauge[];
  dataset: AnalyzeDataset[];
};

const SIZE = CHART_WIDTH;
const MARGIN = 8;
const OUTER_RADIUS = SIZE / 2 - MARGIN;
const BAND = OUTER_RADIUS * 0.42;
const INNER_RADIUS = OUTER_RADIUS - BAND;
const LABEL_RADIUS = INNER_RADIUS + BAND / 2;
const NEEDLE_LENGTH = INNER_RADIUS + BAND * 0.55;
const HUB_RADIUS = Math.max(11, OUTER_RADIUS * 0.07);
const CX = SIZE / 2;
const CY = OUTER_RADIUS + MARGIN;
const SVG_HEIGHT = CY + HUB_RADIUS + 6;
const SEGMENT_GAP_DEG = 1.4;

type Segment = {
  start: number;
  end: number;
  color: string;
  label: string;
  rangeText: string;
};

function polar(radius: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY - radius * Math.sin(rad),
  };
}

function valueToAngle(value: number, segments: Segment[]) {
  const count = segments.length;
  if (!count) {
    return 90;
  }

  const segDeg = 180 / count;

  for (let index = 0; index < count; index += 1) {
    const segment = segments[index];
    if (value <= segment.end || index === count - 1) {
      const span = segment.end - segment.start || 1;
      const frac = Math.min(1, Math.max(0, (value - segment.start) / span));
      return 180 - (index + frac) * segDeg;
    }
  }

  return 0;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function describeBand(startAngle: number, endAngle: number) {
  const outerStart = polar(OUTER_RADIUS, startAngle);
  const outerEnd = polar(OUTER_RADIUS, endAngle);
  const innerEnd = polar(INNER_RADIUS, endAngle);
  const innerStart = polar(INNER_RADIUS, startAngle);

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

function buildSegments(gauge?: AnalyzeGauge): {
  segments: Segment[];
  min: number;
  max: number;
} {
  const fallback = { segments: [], min: 0, max: 60 };
  if (!gauge?.steps?.length) {
    return fallback;
  }

  const { min, max } = parseAnalyzeRange(gauge.range);
  const steps = [...gauge.steps].sort(
    (a, b) => parseAnalyzeRange(a.range).min - parseAnalyzeRange(b.range).min,
  );

  let prevEnd = min;
  const segments = steps.map((step, index) => {
    const parsed = parseAnalyzeRange(step.range);
    const start = Math.max(parsed.min, prevEnd);
    const isLast = index === steps.length - 1;
    const end = isLast ? max : Math.max(parsed.max, start);
    prevEnd = end;

    let rangeText: string;
    if (index === 0) {
      rangeText = `< ${formatNumber(end)}`;
    } else if (isLast) {
      rangeText = `\u2265 ${formatNumber(start)}`;
    } else {
      rangeText = `${formatNumber(start)} - ${formatNumber(end)}`;
    }

    return {
      start,
      end,
      color: step.color,
      label: step.label,
      rangeText,
    };
  });

  return { segments, min, max };
}

export function MeterGaugeChart({ gauge, dataset }: Props) {
  const { segments } = useMemo(() => buildSegments(gauge?.[0]), [gauge]);

  const needles = useMemo(
    () =>
      dataset
        .filter((entry) => Number.isFinite(entry.values?.[0]))
        .map((entry) => ({
          value: entry.values[0],
          color: entry.colors,
          label: entry.labels,
        })),
    [dataset],
  );

  if (!segments.length) {
    return null;
  }

  const segDeg = 180 / segments.length;

  return (
    <View style={styles.container}>
      <Svg width={SIZE} height={SVG_HEIGHT}>
        {segments.map((segment, index) => {
          const rawStart = 180 - index * segDeg;
          const rawEnd = 180 - (index + 1) * segDeg;
          const startAngle = rawStart - SEGMENT_GAP_DEG / 2;
          const endAngle = rawEnd + SEGMENT_GAP_DEG / 2;
          if (startAngle <= endAngle) {
            return null;
          }

          const midAngle = (rawStart + rawEnd) / 2;
          const labelPoint = polar(LABEL_RADIUS, midAngle);
          const rotation = 90 - midAngle;

          return (
            <G key={segment.label}>
              <Path d={describeBand(startAngle, endAngle)} fill={segment.color} />
              <G transform={`rotate(${rotation} ${labelPoint.x} ${labelPoint.y})`}>
                <SvgText
                  x={labelPoint.x}
                  y={labelPoint.y - 1}
                  fill={Colors.white}
                  fontSize={7}
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {segment.label.toUpperCase()}
                </SvgText>
                <SvgText
                  x={labelPoint.x}
                  y={labelPoint.y + 10}
                  fill={Colors.white}
                  fontSize={7}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {segment.rangeText}
                </SvgText>
              </G>
            </G>
          );
        })}

        {needles.map((needle, index) => {
          const angle = valueToAngle(needle.value, segments);
          const length =
            NEEDLE_LENGTH - index * (BAND * 0.06);
          const tip = polar(length, angle);
          const left = polar(HUB_RADIUS * 0.55, angle + 90);
          const right = polar(HUB_RADIUS * 0.55, angle - 90);

          return (
            <Polygon
              key={`${needle.label}-${needle.value}-${index}`}
              points={`${tip.x},${tip.y} ${left.x},${left.y} ${right.x},${right.y}`}
              fill={needle.color}
            />
          );
        })}

        <Circle cx={CX} cy={CY} r={HUB_RADIUS} fill={Colors.darkBlue} />
        <Circle cx={CX} cy={CY} r={HUB_RADIUS * 0.45} fill={Colors.white} />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
});
