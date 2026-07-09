import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    backgroundColor: Colors.darkBlue,
    paddingHorizontal: 14,
    paddingVertical: 14,
    overflow: 'hidden',
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  decoration: {
    position: 'absolute',
    top: -6,
    right: 4,
    opacity: 0.9,
  },
  leftIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 14,
    backgroundColor: Colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    paddingRight: 40,
  },
  title: {
    fontSize: 18,
    color: Colors.white,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  description: {
    marginTop: 6,
    fontSize: 14,
    color: Colors.white,
    opacity: 0.7,
    fontFamily: Fonts.MontserratRegular,
    lineHeight: 20,
  },
  singleTitle: {
    fontSize: 14,
    color: Colors.white,
    fontFamily: Fonts.PoppinsMedium,
  },
});

