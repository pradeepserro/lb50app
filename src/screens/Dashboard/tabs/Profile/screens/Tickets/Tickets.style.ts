import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

const STATUS_ORANGE = '#F59E0B';

export const styles = StyleSheet.create({
  rootContent: {
    flex: 1,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingBottom: 4,
  },

  tabsRow: {
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    minHeight: 42,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    borderWidth: 1.5,
  },
  tabInactive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },
  tabSelected: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  tabSelectedInProgress: {
    backgroundColor: STATUS_ORANGE,
    borderColor: STATUS_ORANGE,
  },
  tabSelectedClosed: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  tabPressed: {
    opacity: 0.85,
  },
  tabText: {
    color: Colors.darkBlue,
    fontSize: 13,
    fontFamily: Fonts.PoppinsSemiBold,
    textAlign: 'center',
  },
  tabTextSelected: {
    color: Colors.white,
  },

  ticketCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'transparent',
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  ticketTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  ticketIdWrap: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ticketIdLabel: {
    color: Colors.titleTextColorGray,
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
  },
  ticketId: {
    color: Colors.darkBlue,
    fontSize: 13,
    fontFamily: Fonts.MontserratSemiBold,
  },
  statusBadge: {
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
  },
  statusBadgeInProgress: {
    backgroundColor: STATUS_ORANGE,
    borderColor: STATUS_ORANGE,
  },
  statusBadgeClosed: {
    backgroundColor: Colors.green,
    borderColor: Colors.green,
  },
  statusText: {
    fontSize: 10,
    fontFamily: Fonts.MontserratSemiBold,
  },
  statusTextInProgress: {
    color: Colors.white,
  },
  statusTextClosed: {
    color: Colors.white,
  },
  issueTitle: {
    marginTop: 12,
    color: Colors.darkBlue,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    backgroundColor: Colors.gray,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTime: {
    flex: 1,
    color: Colors.titleTextColorGray,
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
  },
  emptyState: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: Colors.titleTextColorGray,
    fontSize: 13,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
  },
  createTicketsWrap: {
    paddingHorizontal: 12,
  },
});
