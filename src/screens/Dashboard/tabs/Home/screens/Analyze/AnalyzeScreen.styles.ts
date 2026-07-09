import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  screenBg: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 120,
  },
  scrollBody: {
    paddingBottom: 24,
  },
  segmentWrap: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.red,
    paddingHorizontal: 12,
  },
  sectionDesc: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.darkBlue,
    lineHeight: 20,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  chartCard: {
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
  },
  chartCardHeader: {
    alignItems: 'center',
    marginBottom: 4,
  },
  chartCardTitle: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.darkBlue,
  },
  chartCardSubtitle: {
    marginTop: 4,
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.titleTextColorGray,
    letterSpacing: 0.6,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
    marginTop: 4,
    paddingHorizontal: 8,
  },
  legendRowSpread: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  legendItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    textAlign: 'center',
    marginTop: 2,
    backgroundColor: Colors.black,
  },
  legendLabel: {
    fontSize: 12,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.darkBlue,
  },
  legendTrend: {
    fontSize: 11,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.green,
  },
  legendVsBaseline: {
    fontSize: 12,
    fontFamily: Fonts.MontserratSemiBold,
    color: Colors.green,
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular,
    color: Colors.titleTextColorGray,
    textAlign: 'center',
  },
});
