import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import LogoPng from '@assets/icons/logo.png';
import {
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

type Props = NativeStackScreenProps<HomeStackParamList, 'Analyze'>;

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
  const tabContent = TAB_SECTION_CONTENT[tab];

  const loadAnalyzeData = useCallback(async (tabIndex: number) => {
    setLoading(true);
    try {
      const tabTypeId = TAB_TYPE_IDS[tabIndex];
      const data = await fetchAnalyzeApi(tabTypeId);
      setGraphs(sortGraphsById(data.graphs));
    } catch (error) {
      showApiErrorAlert(error, 'Analyze Unavailable');
      setGraphs([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAnalyzeData(tab);
    }, [loadAnalyzeData, tab]),
  );

  const handleTabChange = (nextTab: number) => {
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
                { label: 'Weekly', value: 2 },
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
            graphs.map((graph) => <AnalyzeGraphCard key={graph.id} graph={graph} />)
          )}
        </View>
      </ScrollView>

      <LoadingOverlay visible={loading} />
    </DashboardScreenLayout>
  );
}
