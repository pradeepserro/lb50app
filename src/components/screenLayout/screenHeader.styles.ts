import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const screenHeaderStyles = StyleSheet.create({
  bar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 10,
  },
  headerSide: {
    width: 88,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerBack: {
    width: 'auto',
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogo: { width: 34, height: 34 },
  headerTitle: {
    textAlign: 'center',
    fontSize: 16,
    // fontWeight: '700',
    color: Colors.darkBlue,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  headerDescription: {
    marginTop: 2,
    textAlign: 'center',
    fontSize: 14,
    color: Colors.darkBlue,
    opacity: 0.7,
    fontFamily: Fonts.PoppinsRegular,
  },
  headerRight: {
    minWidth : 88,
    textAlign: 'right',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.darkBlue,
  }
});
