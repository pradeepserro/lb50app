import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, G, Circle, TSpan } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

const CHART_HORIZONTAL_INSET = 48;
const MAX_CHART_SIZE = 420;
const LABEL_OFFSET = 18;
const LABEL_LINE_HEIGHT = 13;
const LABEL_MAX_LINE_LENGTH = 12;

function wrapLabel(label: string): string[] {
  return label.trim().split(/\s+/).reduce<string[]>((lines, word) => {
    const lastLine = lines[lines.length - 1];

    if (!lastLine || `${lastLine} ${word}`.length > LABEL_MAX_LINE_LENGTH) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${lastLine} ${word}`;
    }

    return lines;
  }, []);
}

export type RadarDataSet = {
  values: number[];
  color: string;
  lineColor?: string;
  fillColor?: string;
  strokeWidth?: number;
  dotRadius?: number;
  dotStrokeColor?: string;
  dotStrokeWidth?: number;
  showDots?: boolean;
};

type Props = {
  title?: string;
  labels: string[];
  data: RadarDataSet[];
  maxValue?: number;
};

export function RadarChartCustom({
  title,
  labels,
  data,
  maxValue = 100,
}: Props) {
  const { width } = useWindowDimensions();
  const size = Math.min(width - CHART_HORIZONTAL_INSET, MAX_CHART_SIZE);
  const center = size / 2;
  const radius = size * 0.32;
  const isFocused = useIsFocused();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isFocused) {
      animation.setValue(0);
      Animated.timing(animation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: false,
      }).start();
    }
  }, [isFocused, animation]);

  const angleSlice = (Math.PI * 2) / labels.length;

  const getPoint = (value: number, index: number) => {
    const angle = index * angleSlice - Math.PI / 2;
    const pointRadius = (value / maxValue) * radius;
    return {
      x: center + pointRadius * Math.cos(angle),
      y: center + pointRadius * Math.sin(angle),
    };
  };

  const getPolygonPoints = (values: number[]) =>
    values
      ?.map((v, i) => {
        const p = getPoint(v, i);
        return `${p.x},${p.y}`;
      })
      ?.join(' ');

  const renderGrid = () => {
    const levels = 3;

    return Array?.from?.({ length: levels })?.map((_, levelIndex) => {
      const r = ((levelIndex + 1) / levels) * radius;

      const points = labels
        ?.map((_l, labelIndex) => {
          const angle = labelIndex * angleSlice - Math.PI / 2;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return `${x},${y}`;
        })
        ?.join(' ');

      return (
        <Polygon
          key={`grid-${levelIndex}`}
          points={points}
          stroke="#E0E0E0"
          fill="none"
        />
      );
    });
  };

  const renderAxes = () =>
    labels?.map((_, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);

      return (
        <Line
          key={`axis-${i}`}
          x1={center}
          y1={center}
          x2={x}
          y2={y}
          stroke="#E0E0E0"
        />
      );
    });

  const renderLabels = () =>
    labels?.map((label, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const x = center + (radius + LABEL_OFFSET) * Math.cos(angle);
      const y = center + (radius + LABEL_OFFSET) * Math.sin(angle);
      const lines = wrapLabel(label);
      const firstLineY = y - ((lines.length - 1) * LABEL_LINE_HEIGHT) / 2;

      return (
        <SvgText
          key={`label-${i}`}
          x={x}
          y={firstLineY}
          fontSize="11"
          fill={Colors.darkBlue}
          textAnchor="middle"
        >
          {lines.map((line, lineIndex) => (
            <TSpan
              key={`${label}-${lineIndex}`}
              x={x}
              dy={lineIndex === 0 ? 0 : LABEL_LINE_HEIGHT}
            >
              {line}
            </TSpan>
          ))}
        </SvgText>
      );
    });

  const renderDataDots = (dataset: RadarDataSet, datasetIndex: number) => {
    if (dataset.showDots === false) {
      return null;
    }

    const dotRadius = dataset.dotRadius ?? 5;

    return dataset.values.map((value, i) => {
      const { x, y } = getPoint(value, i);

      return (
        <Circle
          key={`dot-${datasetIndex}-${i}`}
          cx={x}
          cy={y}
          r={dotRadius}
          fill={dataset.color}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <Svg width={size} height={size}>
        <G>
          {renderGrid()}
          {renderAxes()}
          {renderLabels()}

          {data?.map((dataset, index) => (
            <Polygon
              key={`data-${index}`}
              points={getPolygonPoints(dataset.values)}
              stroke={dataset.lineColor ?? dataset.color}
              fill={dataset.fillColor || 'none'}
              strokeWidth={dataset.strokeWidth ?? (index === 0 ? 3 : 2)}
            />
          ))}

          {data?.map((dataset, index) => renderDataDots(dataset, index))}
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontFamily: Fonts.MontserratMedium,
  },
});
