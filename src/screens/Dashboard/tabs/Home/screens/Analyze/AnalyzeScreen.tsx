import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useRef, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import LogoPng from '@assets/icons/logo.png';
import {
  ANALYZE_GRAPH_TYPE_IDS,
  ANALYZE_TAB_TYPE_IDS,
  sortGraphsById,
  type AnalyzeGraph,
  type AnalyzeTabTypeId,
} from '@/api/analyze/analyze';
import { fetchAnalyzeApi } from '@/api/analyze/analyzeEndpoints';
import { AnalyzeGraphCard } from '@/components/AnalyzeGraphCard/AnalyzeGraphCard';
import { CommonTab } from '@/components/CommonTab/CommonTab';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import type { HomeStackParamList } from '@/screens/Dashboard/tabs/Home/navigation/types';
import { styles } from '@/screens/Dashboard/tabs/Home/screens/Analyze/AnalyzeScreen.styles';
import { Colors } from '@/theme/colors';

type Props = NativeStackScreenProps<HomeStackParamList, 'Analyze'>;

type WeeklySummaryGraph = AnalyzeGraph & {
  dataset1?: number[];
  colors1?: string[];
  dataset2?: number[];
  colors2?: string[];
};

const TEXTBOX_TYPE_ID = 5;
const SIX_PILLARS_MAX_VALUE = 10;

function invertSixPillarsRadialScale(graph: AnalyzeGraph): AnalyzeGraph {
  if (graph.type_id !== ANALYZE_GRAPH_TYPE_IDS.RADIAL) {
    return graph;
  }

  return {
    ...graph,
    dataset: graph.dataset.map(item => ({
      ...item,
      values: item.values.map(value => SIX_PILLARS_MAX_VALUE - value),
    })),
  };
}

function WeeklySummaryIcon({ header }: { header: string }) {
  const isBloodPressure = /blood pressure/i.test(header);

  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={12}
        r={11}
        fill={isBloodPressure ? Colors.danger : Colors.primary}
      />
      <Path
        d={
          isBloodPressure
            ? 'M12 18s-6-3.6-6-8a3.3 3.3 0 0 1 6-1.9A3.3 3.3 0 0 1 18 10c0 4.4-6 8-6 8Z'
            : 'M12 5.2s-4.2 4.8-4.2 8a4.2 4.2 0 0 0 8.4 0c0-3.2-4.2-8-4.2-8Z'
        }
        fill={Colors.white}
      />
    </Svg>
  );
}

function WeeklySummaryCard({ graph }: { graph: WeeklySummaryGraph }) {
  const labels = graph.labels ?? [];

  return (
    <View style={[styles.chartCard, styles.summaryCard]}>
      <View style={styles.summaryHeader}>
        <WeeklySummaryIcon header={graph.header} />
        <Text style={styles.summaryTitle}>{graph.header}</Text>
      </View>

      {labels.map((label, index) => {
        const firstValue = graph.dataset1?.[index];
        const secondValue = graph.dataset2?.[index];
        const hasSecondValue = secondValue !== undefined && secondValue !== null;

        return (
          <View key={`${graph.id}-${label}-${index}`} style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>{label}</Text>
            <View style={styles.summaryValues}>
              <Text
                style={[
                  styles.summaryValue,
                  { color: graph.colors1?.[index] || Colors.darkBlue },
                ]}
              >
                {firstValue ?? '—'}
              </Text>
              {hasSecondValue ? (
                <>
                  <Text style={styles.summarySeparator}>/</Text>
                  <Text
                    style={[
                      styles.summaryValue,
                      { color: graph.colors2?.[index] || Colors.darkBlue },
                    ]}
                  >
                    {secondValue}
                  </Text>
                </>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const TAB_TYPE_IDS: AnalyzeTabTypeId[] = [
  ANALYZE_TAB_TYPE_IDS.SIX_PILLARS,
  ANALYZE_TAB_TYPE_IDS.BMI,
  ANALYZE_TAB_TYPE_IDS.WEEKLY,
];

type TabSectionContent = {
  sectionTitle: string;
  sectionDesc: string;
};

const TAB_SECTION_CONTENT: TabSectionContent[] = [
  {
    sectionTitle: '',
    sectionDesc: '',
  },
  {
    sectionTitle: '',
    sectionDesc: '',
  },
  {
    sectionTitle: '',
    sectionDesc: '',
  },
];

export function AnalyzeScreen({ navigation }: Props) {
  const [tab, setTab] = useState(0);
  const [graphs, setGraphs] = useState<AnalyzeGraph[]>([]);
  const [loading, setLoading] = useState(true);
  const requestIdRef = useRef(0);
  const tabContent = TAB_SECTION_CONTENT[tab];
  const isSixPillarsTab = TAB_TYPE_IDS[tab] === ANALYZE_TAB_TYPE_IDS.SIX_PILLARS;

  const loadAnalyzeData = useCallback(async (tabIndex: number) => {
    const requestId = ++requestIdRef.current;
    setGraphs([]);
    setLoading(true);
    try {
      const tabTypeId = TAB_TYPE_IDS[tabIndex];
      const data = await fetchAnalyzeApi(tabTypeId);
      if (requestId !== requestIdRef.current) return;
      setGraphs(sortGraphsById(data.graphs));
    } catch (error) {
      if (requestId !== requestIdRef.current) return;
      showApiErrorAlert(error, 'Analyze Unavailable');
      setGraphs([]);
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAnalyzeData(tab);
      return () => {
        requestIdRef.current += 1;
      };
    }, [loadAnalyzeData, tab]),
  );

  const handleTabChange = (nextTab: number) => {
    if (nextTab === tab) return;
    requestIdRef.current += 1;
    setGraphs([]);
    setLoading(true);
    setTab(nextTab);
  };

  return (
    <DashboardScreenLayout
      containerStyle={styles.screenBg}
      bgResizeMode="cover"
      header={
        <View style={[screenHeaderStyles.bar, screenHeaderStyles.header]}>
          <View style={screenHeaderStyles.headerSide}>
            <ScreenHeaderBackButton
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.goBack();
                }
              }}
            />
            <Image source={LogoPng} style={screenHeaderStyles.headerLogo} resizeMode="contain" />
          </View>
          <Text style={screenHeaderStyles.headerTitle}>Analyse</Text>
          <Text style={screenHeaderStyles.headerRight} />
        </View>
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.scrollBody}>
          <View style={styles.segmentWrap}>
            <CommonTab
              value={tab}
              onChange={handleTabChange}
              tabs={[
                { label: '6 Pillars', value: 0 },
                { label: 'BMI', value: 1 },
                { label: 'Health', value: 2 },
              ]}
            />
          </View>

          {tabContent.sectionTitle ? (
            <Text style={styles.sectionTitle}>{tabContent.sectionTitle}</Text>
          ) : null}
          {tabContent.sectionDesc ? (
            <Text style={styles.sectionDesc}>{tabContent.sectionDesc}</Text>
          ) : null}

          {graphs.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No analyze data available yet.</Text>
            </View>
          ) : (
            graphs.map((graph) =>
              graph.type_id === TEXTBOX_TYPE_ID ? (
                <WeeklySummaryCard
                  key={graph.id}
                  graph={graph as WeeklySummaryGraph}
                />
              ) : (
                <AnalyzeGraphCard
                  key={graph.id}
                  graph={isSixPillarsTab ? invertSixPillarsRadialScale(graph) : graph}
                />
              ),
            )
          )}
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} />
    </DashboardScreenLayout>
  );
}
