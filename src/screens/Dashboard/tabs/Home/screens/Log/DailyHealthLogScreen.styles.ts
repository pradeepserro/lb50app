import { Platform, StyleSheet } from 'react-native';
import { Fonts } from '@/utils/fonts';
import { Colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  rootContent: {
    flex: 1,
    minHeight: 0,
  },
  keyboardAvoid: {
    flex: 1,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 120,
  },
  segmentWrap: {
    marginBottom: 16,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  insightCard: {
    marginBottom: 10,
  },
  insightHistoryCard: {
    marginTop: 40,
  },
  card: {
    backgroundColor: Colors.gray,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  todayTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  todayTitle: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.titleTextColorGray,
  },
  todayDateActions: {
    backgroundColor: Colors.white,
    width: 40,
    height: 40,
    borderRadius: 12,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  todayDate: {
    marginTop: 10,
    fontSize: 18,
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.darkBlue,
  },
  todayDateBold: {
    fontSize: 18,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionHeadeIcon: {
    backgroundColor: Colors.gray,
    width: 36,
    height: 36,
    borderRadius: 12,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.darkBlue,
  },
  metricInput: {
    backgroundColor: Colors.gray,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    color: Colors.darkBlue,
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  metricInputPlaceholder: {
    fontFamily: Fonts.PoppinsRegular,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderColor: Colors.gray,
    borderWidth: 1.5,
  },
  pillSelected: {
    backgroundColor: Colors.darkBlue,
    borderColor: Colors.darkBlue,
  },
  pillLabel: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.darkBlue,
  },
  pillLabelSelected: {
    color: Colors.white,
    fontWeight: '700'
  },
  pillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  pillCheckmark: {
    width: 12,
    height: 12,
    backgroundColor: Colors.white,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    marginTop: 8,
    height: 54,
    borderRadius: 999,
    backgroundColor: Colors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  saveButtonPressed: {
    opacity: 0.92,
  },
  saveLeadingSpacer: {
    width: 36,
  },
  saveTitle: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.white,
    lineHeight: 28,
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  saveBookmark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 14,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  historyDateCol: {
    width: 60,
    height: 64,
    backgroundColor: Colors.gray,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12
  },

  historyDateMonth: {
    fontSize: 12,
    fontFamily: Fonts.MontserratMedium,
    color: Colors.green,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  historyDateDay: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: Fonts.PoppinsBold,
    color: Colors.darkBlue,
  },

  historyBody: {
    flex: 1,
    paddingRight: 6,
  },

  historySummary: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.titleTextColorGray,
    fontFamily: Fonts.PoppinsRegular,
  },

  historyMeta: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 5
  },

  historyMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10
  },

  historyMetaText: {
    marginLeft: 5,
    fontSize: 12,
    color: Colors.darkBlue,
    fontFamily: Fonts.PoppinsMedium,
  },

  menuBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalRoot: {
    flex: 1,
  },

  menuBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },

  menuPopover: {
    position: 'absolute',
    backgroundColor: '#e0e2e8',
    borderRadius: 14,
    paddingVertical: 0,

    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 10,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  menuItemText: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.darkBlue,
    fontFamily: Fonts.PoppinsMedium,
  },

  menuItemDeleteText: {
    marginLeft: 10,
    fontSize: 14,
    color: Colors.red,
    fontFamily: Fonts.PoppinsMedium,
  }
});
