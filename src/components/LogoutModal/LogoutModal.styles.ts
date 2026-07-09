import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: 'rgba(5, 17, 56, 0.45)',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.darkBlue,
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Fonts.PoppinsBold,
  },
  message: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.titleTextColorGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    fontFamily: Fonts.MontserratRegular,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelBtn: {
    borderRadius: 999,
    backgroundColor: Colors.gray,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    gap: 10,
    paddingRight: 20
  },
  cancelIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.red,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  confirmBtn: {
    borderRadius: 999,
    backgroundColor: Colors.darkBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 4,
    gap: 10,
    paddingRight: 20
  },
  confirmIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: Fonts.PoppinsSemiBold,
  },
});
