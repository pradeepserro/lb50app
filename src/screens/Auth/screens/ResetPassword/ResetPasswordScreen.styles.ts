import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.bg },
  container: { flex: 1, paddingHorizontal: 18, paddingTop: 10 },
  headerRow: { height: 40, justifyContent: 'center' },
  back: { color: Colors.primary, fontWeight: '800' },
  header: { marginBottom: 16, marginTop: 6 },
  h1: { color: Colors.text, fontSize: 28, fontWeight: '900' },
  h2: { color: Colors.muted, marginTop: 6, fontSize: 14, fontWeight: '600' },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  label: {
    color: Colors.muted,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 14,
    paddingHorizontal: 14,
    backgroundColor: Colors.inputBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 16,
  },
  confirmLabel: {
    marginTop: 12,
  },
});

