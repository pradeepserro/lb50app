import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import ClockIcon from '@assets/icons/clock.svg';
import LogoPng from '@assets/icons/logo.png';
import {
  TICKET_STATUS_IDS,
  type TicketListItem,
  type TicketStatusId,
} from '@/api/ticket/ticket';
import { fetchTicketListApi } from '@/api/ticket/ticketEndpoints';
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay';
import { PrimaryButton } from '@/components/PrimaryButton';
import { DashboardScreenLayout } from '@/components/screenLayout/DashboardScreenLayout';
import { ScreenHeaderBackButton } from '@/components/screenLayout/ScreenHeaderBackButton';
import { useDashboardTabBarInset } from '@/components/screenLayout/dashboardLayout';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';
import { showApiErrorAlert } from '@/feedback/errorFeedback';
import { styles as profileStyles } from '@/screens/Dashboard/tabs/Profile/ProfileTab.styles';
import { styles } from '@/screens/Dashboard/tabs/Profile/screens/Tickets/Tickets.style';

type TicketStatus = 'All' | 'In Progress' | 'Closed';
type TicketFilter = TicketStatus;

type Props = {
  navigation: any;
};

const FILTERS: TicketFilter[] = ['All', 'In Progress', 'Closed'];

const FILTER_STATUS_IDS: Record<TicketFilter, TicketStatusId> = {
  All: TICKET_STATUS_IDS.ALL,
  'In Progress': TICKET_STATUS_IDS.IN_PROGRESS,
  Closed: TICKET_STATUS_IDS.CLOSED,
};

const TICKET_STATUS_LABELS: Record<TicketStatusId, TicketStatus> = {
  [TICKET_STATUS_IDS.ALL]: 'All',
  [TICKET_STATUS_IDS.IN_PROGRESS]: 'In Progress',
  [TICKET_STATUS_IDS.CLOSED]: 'Closed',
};

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

function formatTicketDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const day = String(date.getDate()).padStart(2, '0');
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');

  return `${day} ${month} ${year}, ${displayHours}:${minutes} ${period}`;
}

function TicketCard({
  ticket,
  onPress,
}: {
  ticket: TicketListItem;
  onPress: () => void;
}) {
  const status = TICKET_STATUS_LABELS[ticket.status_id];
  const isInProgress = ticket.status_id === TICKET_STATUS_IDS.IN_PROGRESS;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Open ticket ${ticket.id}`}
      onPress={onPress}
      style={styles.ticketCard}
    >
      <View style={styles.ticketTopRow}>
        <View style={styles.ticketIdWrap}>
          <Text style={styles.ticketIdLabel}>Ticket ID:</Text>
          <Text style={styles.ticketId}>{ticket.id}</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            isInProgress
              ? styles.statusBadgeInProgress
              : styles.statusBadgeClosed,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              isInProgress
                ? styles.statusTextInProgress
                : styles.statusTextClosed,
            ]}
          >
            {status}
          </Text>
        </View>
      </View>

      <Text style={styles.issueTitle}>{ticket.title}</Text>

      <View style={styles.divider} />

      <View style={styles.dateRow}>
        <ClockIcon width={15} height={15} />
        <Text style={styles.dateTime}>
          {formatTicketDateTime(ticket.created_at)}
        </Text>
      </View>
    </Pressable>
  );
}

export function Tickets({ navigation }: Props) {
  const tabBarInset = useDashboardTabBarInset(0);
  const tabBarHeight = useBottomTabBarHeight();
  const tabBarOverlaysContent = tabBarHeight >= tabBarInset;
  const [selectedFilter, setSelectedFilter] =
    useState<TicketFilter>('In Progress');
  const [tickets, setTickets] = useState<TicketListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = useCallback(async (filter: TicketFilter) => {
    setLoading(true);
    setTickets([]);

    try {
      const data = await fetchTicketListApi(FILTER_STATUS_IDS[filter]);
      setTickets(data.tickets);
    } catch (error) {
      setTickets([]);
      showApiErrorAlert(error, 'Tickets Unavailable');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTickets(selectedFilter);
    }, [loadTickets, selectedFilter]),
  );

  const handleFilterChange = useCallback(
    (filter: TicketFilter) => {
      if (filter === selectedFilter) {
        loadTickets(filter);
        return;
      }

      setSelectedFilter(filter);
    },
    [loadTickets, selectedFilter],
  );

  return (
    <DashboardScreenLayout
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
            <Image
              source={LogoPng}
              style={screenHeaderStyles.headerLogo}
              resizeMode="contain"
            />
          </View>

          <Text style={screenHeaderStyles.headerTitle}>Tickets</Text>

          <View style={screenHeaderStyles.headerSide} />
        </View>
      }
    >
      <View
        style={[
          styles.rootContent,
          tabBarOverlaysContent && { paddingBottom: tabBarInset },
        ]}
      >
        <View style={styles.tabsRow}>
          {FILTERS.map(filter => {
            const selected = filter === selectedFilter;

            return (
              <Pressable
                key={filter}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                onPress={() => handleFilterChange(filter)}
                style={({ pressed }) => [
                  styles.tab,
                  selected
                    ? filter === 'In Progress'
                      ? styles.tabSelectedInProgress
                      : filter === 'Closed'
                        ? styles.tabSelectedClosed
                        : styles.tabSelected
                    : styles.tabInactive,
                  pressed && styles.tabPressed,
                ]}
              >
                <Text
                  style={[styles.tabText, selected && styles.tabTextSelected]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {tickets.length === 0 && !loading ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No tickets available.</Text>
            </View>
          ) : (
            tickets.map(ticket => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onPress={() =>
                  navigation.navigate('TicketDetails', {
                    ticketId: ticket.id,
                  })
                }
              />
            ))
          )}
        </ScrollView>

        <View style={[profileStyles.saveWrap, styles.createTicketsWrap]}>
          <PrimaryButton
            title="Create Tickets"
            onPress={() =>
              navigation.navigate('CreateTicket', { ticketTypeGroupId: 1 })
            }
            style={profileStyles.saveBtn}
            titleStyle={profileStyles.saveTitle}
          />
        </View>

        <LoadingOverlay visible={loading} />
      </View>
    </DashboardScreenLayout>
  );
}
