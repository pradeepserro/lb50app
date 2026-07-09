import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    borderWidth: 0.8,
    borderColor: Colors.white,
    borderRadius: 9999,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.white,
    borderRadius: 9999,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabPressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 13,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.darkBlue,
  },
  activeLabel: {
    color: Colors.green,
    fontFamily: Fonts.PoppinsSemiBold,
    fontSize: 13
  },
});