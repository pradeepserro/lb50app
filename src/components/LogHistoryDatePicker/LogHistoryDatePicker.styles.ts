import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    flexGrow: 0,
    flexShrink: 0,
  },
  headerBanner: {
    backgroundColor: '#008477',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerYear: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Fonts.MontserratMedium,
  },
  headerYearActive: {
    fontSize: 28,
    color: Colors.white,
    fontFamily: Fonts.MontserratSemiBold,
  },
  headerDate: {
    fontSize: 28,
    color: Colors.white,
    fontFamily: Fonts.MontserratSemiBold,
  },
  headerDateInactive: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: Fonts.MontserratMedium,
    marginTop: 4,
  },
  calendarBody: {
    paddingTop: 12,
  },
  monthNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  monthNavButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  monthNavButtonPressed: {
    backgroundColor: Colors.gray,
  },
  monthNavLabel: {
    fontSize: 15,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratSemiBold,
  },
  monthNavLabelButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  monthNavLabelButtonPressed: {
    backgroundColor: Colors.gray,
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  weekdayLabel: {
    fontSize: 12,
    color: Colors.titleTextColorGray,
    fontFamily: Fonts.MontserratMedium,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  dayCell: {
    width: '14%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  dayButton: {
    width: 30,
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 999,
  },
  dayButtonPressed: {
    opacity: 0.75,
  },
  dayButtonSelected: {
    backgroundColor: '#008477',
  },
  dayButtonHistory: {
    backgroundColor: Colors.gray,
    borderWidth: 1,
    borderColor: '#008477',
  },
  dayLabel: {
    marginTop: 4,
    textAlign: 'center',
    fontSize: 15,
    color: Colors.darkBlue,
    fontFamily: Fonts.PoppinsMedium,
  },
  dayLabelSelected: {
    color: Colors.white,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  dayLabelHistory: {
    color: Colors.darkBlue,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 12,
  },
  footerButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  footerButtonPressed: {
    opacity: 0.7,
  },
  footerButtonLabel: {
    fontSize: 14,
    color: '#008477',
    fontFamily: Fonts.MontserratSemiBold,
    letterSpacing: 0.5,
  },
  headerYearButton: {
    alignSelf: 'flex-start',
    marginBottom: 4,
    borderRadius: 4,
  },
  headerYearButtonPressed: {
    opacity: 0.75,
  },
  headerDateButton: {
    alignSelf: 'flex-start',
    borderRadius: 4,
  },
  headerDateButtonPressed: {
    opacity: 0.75,
  },
  yearList: {
    maxHeight: 280,
    paddingVertical: 8,
  },
  yearListContent: {
    paddingVertical: 96,
  },
  yearRow: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearRowPressed: {
    opacity: 0.75,
  },
  yearLabel: {
    fontSize: 16,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratMedium,
  },
  yearLabelSelected: {
    fontSize: 28,
    color: '#008477',
    fontFamily: Fonts.MontserratSemiBold,
  },
});
