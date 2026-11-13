import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';
export const styles = StyleSheet.create({
  content: { paddingHorizontal: 14, paddingTop: 8, paddingBottom: 24, gap: 8 },
  intro: { color: Colors.darkBlue, fontFamily: Fonts.MontserratRegular, fontSize: 12, marginBottom: 2 },
  card: { backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 7, elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  cardHeading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  label: { color: Colors.darkBlue, fontFamily: Fonts.MontserratSemiBold, fontSize: 14 },
  input: { minHeight: 42, borderWidth: 1, borderColor: '#D6DCE8', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, color: Colors.darkBlue, textAlignVertical: 'top' },
  smileButton: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E5F5E8', alignItems: 'center', justifyContent: 'center' },
  smile: { fontSize: 23, color: '#269449', lineHeight: 28 },
  disabled: { opacity: 0.4 },
  saveButton: { backgroundColor: '#1769D2', minHeight: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  saveText: { color: '#FFFFFF', fontFamily: Fonts.PoppinsSemiBold, fontSize: 15 },
});
