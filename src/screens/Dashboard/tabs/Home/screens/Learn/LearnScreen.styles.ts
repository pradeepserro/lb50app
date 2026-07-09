import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 80,
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
  ringSection: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 28,
  },
  centerTitle: {
    fontSize: 10,
    // fontWeight: '900',
    color: Colors.white,
    fontFamily: Fonts.PoppinsSemiBold,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  centerSub: { color: Colors.white },
  insightCard: {
    marginTop: 20,
  }
});

