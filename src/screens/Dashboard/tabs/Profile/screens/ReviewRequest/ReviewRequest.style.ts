import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  rootContent: {
    flex: 1,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 12,
  },
  headerSideRight: {
    justifyContent: 'flex-end',
  },
  notificationIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrap: {
    paddingTop: 28,
  },
  successRing: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  successCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewCard: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
  title: {
    color: Colors.darkBlue,
    fontSize: 18,
    fontFamily: Fonts.PoppinsSemiBold,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    color: Colors.titleTextColorGray,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
  },
  ticketBox: {
    marginTop: 22,
    minHeight: 76,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.bg1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ticketTextWrap: {
    flex: 1,
    alignItems: 'center',
  },
  ticketLabel: {
    color: Colors.darkBlue,
    fontSize: 12,
    fontFamily: Fonts.MontserratSemiBold,
  },
  ticketValue: {
    marginTop: 4,
    color: Colors.darkBlue,
    fontSize: 14,
    fontFamily: Fonts.MontserratBold,
  },
  copyIcon: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  nextSection: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 8,
    color: Colors.darkBlue,
    fontSize: 14,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  bullet: {
    width: 16,
    color: Colors.darkBlue,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: Fonts.MontserratMedium,
  },
  bulletText: {
    flex: 1,
    color: Colors.darkBlue,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: Fonts.MontserratRegular,
  },
  buttonWrap: {
    paddingHorizontal: 12,
  },
});
