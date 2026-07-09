import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  headerSideRight: {
    justifyContent: 'flex-end',
  },
  headerPlus: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerPlusText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '400',
    marginTop: -2,
    fontFamily: Fonts.MontserratMedium,
  },

  scrollContent: {
    paddingBottom: 120,
    paddingTop: 16,
    justifyContent: 'space-between',
    gap: 24,
    paddingHorizontal: 12,
  },
  scrollBody: {
    paddingBottom: 24,
  },
  topSection: {
    paddingTop: 0,
  },
  durationTimer: {
    marginTop: 6,
    fontSize: 22,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratBold,
    textAlign: 'center',
  },
  ringSection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 28,
  },
  centerTitle: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: Fonts.MontserratMedium,
    letterSpacing: 0.5,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  centerSub: {
    fontSize: 13,
    color: Colors.white,
    fontFamily: Fonts.PoppinsSemiBold,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  changeButton: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 999,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    alignSelf: 'center',
  },
  changeButtonText: {
    fontSize: 9,
    color: Colors.white,
    fontFamily: Fonts.MontserratMedium,
    letterSpacing: 1,
  },
  activeLabel: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: '800',
    color: Colors.white,
    fontFamily: Fonts.MontserratBold,
    letterSpacing: 1,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
