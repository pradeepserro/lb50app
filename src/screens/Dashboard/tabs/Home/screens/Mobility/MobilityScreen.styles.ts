import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';
export const styles = StyleSheet.create({
  content: { paddingHorizontal: 12, paddingTop: 16, paddingBottom: 80, gap: 24 },
  ringSection: { alignItems: 'center', paddingVertical: 28 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  centerText: { color: Colors.white, fontFamily: Fonts.PoppinsSemiBold, fontSize: 13 },
});
