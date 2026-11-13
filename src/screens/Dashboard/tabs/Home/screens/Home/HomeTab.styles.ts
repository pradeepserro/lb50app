import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 80,
    paddingTop: 8,
    justifyContent: 'space-between',
    gap: 8,
    paddingHorizontal: 12,
  },
  topSection: {
    paddingTop: 0,
  },
  fastCurrentDate: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
  },
  fastCurrentTime: {
    fontSize: 13,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratRegular,
  },
  fastCurrentPeriod: {
    fontSize: 13,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratRegular,
    textTransform: 'uppercase',
  },
  centerColumn: {
    height: '100%',
    width: '100%',
    zIndex: 1,
  },
  centerHalf: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    gap: 6,
  },
  centerDivider: {
    width: '100%',
    height: 1,
    backgroundColor: 'linear-gradient(90deg, rgba(63, 84, 151, 0) 0%, rgba(255, 255, 255, 0.5) 50%, rgba(63, 83, 151, 0) 100%)',
  },
  centerTitle: {
    fontSize: 14,
    color: Colors.bg,
    fontFamily: Fonts.MontserratSemiBold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  centerSubtitle: {
    fontSize: 13,
    color: Colors.titleTextColorGray,
    fontFamily: Fonts.MontserratSemiBold,
    letterSpacing: 0.5,
    // marginTop: 4,
    textTransform: 'uppercase',
  },
  centerSub: { color: Colors.white },
  activeLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.white,
    fontFamily: Fonts.MontserratBold,
    letterSpacing: 1,
  },
  smartGoalsButtonWrap: { alignItems: 'center', marginTop: 0, marginBottom: 0 },
  smartGoalsButton: { height: 45, backgroundColor: '#1769D2', alignItems: 'center', justifyContent: 'center' },
  smartGoalIconCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#1052A9', alignItems: 'center', justifyContent: 'center', marginLeft: 4 },
  shopBtn: {
    marginTop: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    paddingBottom: 0
  },
  shopBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '800',
    fontFamily: Fonts.PoppinsSemiBold,
    lineHeight: 15,
  },
  prevBtn: {
    height: 45,
    backgroundColor: Colors.red,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 'auto'
  },
  prevBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    paddingRight: 16,
    lineHeight: 15,
  },
  continueArrowCircleLeft: {
    width: 38,
    height: 38,
    borderRadius: 50,
    backgroundColor: '#52B15A',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
});
