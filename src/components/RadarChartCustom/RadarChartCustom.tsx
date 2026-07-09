import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import Svg, { Polygon, Line, Text as SvgText, G, Circle } from 'react-native-svg';
import { useIsFocused } from '@react-navigation/native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

const { width } = Dimensions.get('window');
const SIZE = width * 0.72;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.35;

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
    const radius = (value / maxValue) * RADIUS;
    return {
      x: CENTER + radius * Math.cos(angle),
      y: CENTER + radius * Math.sin(angle),
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
      const r = (((levelIndex) + 1) / levels) * RADIUS;

      const points = labels
        ?.map((_l, labelIndex) => {
          const angle = labelIndex * angleSlice - Math.PI / 2;
          const x = CENTER + r * Math.cos(angle);
          const y = CENTER + r * Math.sin(angle);
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
      const x = CENTER + RADIUS * Math.cos(angle);
      const y = CENTER + RADIUS * Math.sin(angle);

      return (
        <Line
          key={`axis-${i}`}
          x1={CENTER}
          y1={CENTER}
          x2={x}
          y2={y}
          stroke="#E0E0E0"
        />
      );
    });

  const renderLabels = () =>
    labels?.map((label, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const x = CENTER + (RADIUS + 22) * Math.cos(angle);
      const y = CENTER + (RADIUS + 22) * Math.sin(angle);

      return (
        <SvgText
          key={`label-${i}`}
          x={x}
          y={y}
          fontSize="11"
          fill={Colors.darkBlue}
          textAnchor="middle"
        >
          {label}
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

      <Svg width={SIZE} height={SIZE}>
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
