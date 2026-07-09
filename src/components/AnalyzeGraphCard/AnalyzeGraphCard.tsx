import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ANALYZE_GRAPH_TYPE_IDS,
  getAnalyzeMaxValue,
  type AnalyzeGraph,
} from '@/api/analyze/analyze';
import { BarChartCustom } from '@/components/BarChartCustom/BarChartCustom';
import { LineChartCustom } from '@/components/LineChartCustom/LineChartCustom';
import { MeterGaugeChart } from '@/components/MeterGaugeChart/MeterGaugeChart';
import { RadarChartCustom } from '@/components/RadarChartCustom/RadarChartCustom';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

type Props = {
  graph: AnalyzeGraph;
};

function GraphLegend({
  items,
  coloredLabels = false,
}: {
  items: { color: string; label: string }[];
  coloredLabels?: boolean;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <View style={styles.legendRow}>
      {items.map((item) => (
        <View key={item.label} style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: item.color }]} />
          <Text
            style={[
              styles.legendLabel,
              coloredLabels ? { color: item.color } : undefined,
            ]}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function renderGraphContent(graph: AnalyzeGraph) {
  switch (graph.type_id) {
    case ANALYZE_GRAPH_TYPE_IDS.RADIAL: {
      const labels = graph.labels ?? [];
      const allValues = graph.dataset.flatMap((item) => item.values);
      const maxValue = getAnalyzeMaxValue(allValues);
      const chartData = graph.dataset.map((item) => ({
        values: item.values,
        color: item.colors,
        lineColor: item.colors,
        fillColor: 'none',
        strokeWidth: 2.5,
        showDots: true,
      }));

      return (
        <>
          <RadarChartCustom labels={labels} data={chartData} maxValue={maxValue} />
          <GraphLegend
            items={graph.dataset.map((item) => ({
              color: item.colors,
              label: item.labels,
            }))}
          />
        </>
      );
    }
    case ANALYZE_GRAPH_TYPE_IDS.METER:
      return (
        <>
          <MeterGaugeChart gauge={graph.gauge} dataset={graph.dataset} />
          <GraphLegend
            coloredLabels
            items={graph.dataset
              .filter((item) => Number.isFinite(item.values?.[0]))
              .map((item) => ({
                color: item.colors,
                label: item.labels,
              }))}
          />
        </>
      );
    case ANALYZE_GRAPH_TYPE_IDS.LINE:
      return (
        <LineChartCustom labels={graph.labels ?? []} dataset={graph.dataset} />
      );
    case ANALYZE_GRAPH_TYPE_IDS.BAR:
      return (
        <BarChartCustom labels={graph.labels ?? []} dataset={graph.dataset} />
      );
    default:
      return null;
  }
}

export function AnalyzeGraphCard({ graph }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{graph.header}</Text>
        {graph.sub_header ? (
          <Text style={styles.subtitle}>{graph.sub_header}</Text>
        ) : null}
      </View>
      {renderGraphContent(graph)}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 14,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.darkBlue,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.titleTextColorGray,
    textAlign: 'center',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.darkBlue,
  },
});
