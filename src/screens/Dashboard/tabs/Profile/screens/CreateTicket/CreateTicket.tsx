import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import type { TicketType } from '@/api/ticket/ticket';
import { fetchTicketTypesApi } from '@/api/ticket/ticketEndpoints';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import {
  DASHBOARD_TAB_BAR_HEIGHT,
  useDashboardTabBarInset,
} from '@/components/screenLayout/dashboardLayout';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import type { ProfileStackParamList } from '@/screens/Dashboard/tabs/Profile/navigation/types';
import { styles as profileStyles } from '@/screens/Dashboard/tabs/Profile/ProfileTab.styles';
import { styles } from '@/screens/Dashboard/tabs/Profile/screens/CreateTicket/CreateTicket.style';
import { Colors } from '@/theme/colors';

type Props = NativeStackScreenProps<ProfileStackParamList, 'CreateTicket'>;

function NotificationIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"
        stroke={Colors.darkBlue}
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10 21h4"
        stroke={Colors.darkBlue}
        strokeWidth={1.7}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function CreateTicket({ navigation, route }: Props) {
  const safeAreaInsets = useSafeAreaInsets();
  const tabBarInset = useDashboardTabBarInset();
  const ticketTypeGroupId = route.params?.ticketTypeGroupId ?? 1;
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<
    number | null
  >(null);
  const [loading, setLoading] = useState(true);

  const loadTicketTypes = useCallback(async () => {
    setLoading(true);

    try {
      const data = await fetchTicketTypesApi(ticketTypeGroupId);
      setTicketTypes(data.ticket_types);
      setSelectedTicketTypeId(currentId =>
        currentId !== null &&
        data.ticket_types.some(ticketType => ticketType.id === currentId)
          ? currentId
          : null,
      );
    } catch (error) {
      setTicketTypes([]);
      setSelectedTicketTypeId(null);
      showApiErrorAlert(error, 'Ticket Types Unavailable');
    } finally {
      setLoading(false);
    }
  }, [ticketTypeGroupId]);

  useFocusEffect(
    useCallback(() => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
          height: DASHBOARD_TAB_BAR_HEIGHT + safeAreaInsets.bottom,
          paddingTop: 8,
          paddingBottom: 10 + safeAreaInsets.bottom,
          position: 'absolute',
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOpacity: 0.12,
          shadowRadius: 18,
          shadowOffset: { width: 0, height: 10 },
          elevation: 10,
        },
      });
    }, [navigation, safeAreaInsets.bottom]),
  );

  useFocusEffect(
    useCallback(() => {
      setTicketTypes([]);
      setSelectedTicketTypeId(null);
      loadTicketTypes();
    }, [loadTicketTypes]),
  );

  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  return (
    <DashboardScreenLayout
      header={
        <View style={[screenHeaderStyles.bar, screenHeaderStyles.header]}>
          <View style={screenHeaderStyles.headerSide}>
            <ScreenHeaderBackButton onPress={handleBack} />
          </View>

          <View style={screenHeaderStyles.headerCenter}>
            <Text style={screenHeaderStyles.headerTitle}>Create Ticket</Text>
          </View>

          <View style={[screenHeaderStyles.headerSide, styles.headerSideRight]}>
            <View style={styles.notificationIcon}>
              <NotificationIcon />
            </View>
          </View>
        </View>
      }
    >
      <View style={[styles.rootContent, { paddingBottom: tabBarInset }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={[profileStyles.card, styles.introCard]}>
            <Text style={styles.introTitle}>How can we help you today?</Text>
            <Text style={styles.introSubtitle}>
              Choose a category to get started
            </Text>
          </View>

          <View style={styles.ticketTypesList}>
            {ticketTypes.length === 0 && !loading ? (
              <View style={[profileStyles.card, styles.emptyCard]}>
                <Text style={styles.emptyText}>No ticket types available.</Text>
              </View>
            ) : (
              ticketTypes.map(ticketType => (
                <Pressable
                  key={ticketType.id}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: ticketType.id === selectedTicketTypeId,
                  }}
                  onPress={() => {
                    setSelectedTicketTypeId(ticketType.id);
                    navigation.navigate('DescribeIssue', {
                      ticketId: 0,
                      ticketTypeId: ticketType.id,
                      ticketTypeGroupId,
                      ticketTypeName: ticketType.name,
                      title: ticketType.name,
                    });
                  }}
                  style={[profileStyles.card, styles.ticketTypeCard]}
                >
                  <Text style={styles.ticketTypeTitle}>{ticketType.name}</Text>
                  <Text style={styles.ticketTypeDescription}>
                    {ticketType.description}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        </ScrollView>

        <LoadingOverlay visible={loading} />
      </View>
    </DashboardScreenLayout>
  );
}
