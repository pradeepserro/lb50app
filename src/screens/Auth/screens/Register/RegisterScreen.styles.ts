import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  safe: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  scroll: { flex: 1 },
  container: { flex: 1, backgroundColor: '#D7E347' },
  scrollContent: {
    flex: 1,
    minHeight: 0,
    paddingTop: 20,
    paddingBottom: 0,
  },
  logoCircle: {
    alignSelf: 'center',
    width: 88,
    height: 88,
    borderRadius: 44,
    // backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  logoPng: {
    width: 100,
    height: 100,
  },
  header: { marginTop: 12, alignItems: 'center' },
  h1: { fontSize: 20, color: '#F23B3B', fontFamily: Fonts.PoppinsBold },
  h2: {
    marginTop: 6,
    fontSize: 14,
    color: 'rgba(10,20,40,0.75)',
    fontFamily: Fonts.MontserratMedium
  },
  card: {
    marginTop: 24,
    flex: 1,
    flexGrow: 1,
    minHeight: 0,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  cardScrollContent: {
    paddingBottom: 0,
  },
  field: { marginBottom: 10 },
  fieldLabel: {
    fontSize: 12,
    color: Colors.titleTextColor,
    marginBottom: 6,
    fontFamily: Fonts.MontserratRegular
  },
  fieldInputWrap: {
    height: 44,
    borderRadius: 50,
    backgroundColor: '#F1F4F8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  fieldIconCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    // backgroundColor: '#E8EDF3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  fieldIconText: {
    fontSize: 16,
    fontWeight: '900',
    color: 'rgba(10,20,40,0.45)',
    marginTop: -2,
  },
  fieldInput: {
    flex: 1,
    color: Colors.titleTextColor,
    fontSize: 14,
    fontFamily: Fonts.MontserratRegular
  },
  selectPlaceholder: { color: 'rgba(10,20,40,0.45)' },
  selectText: { color: '#0B1B3A' },
  chevIcon: {
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '500',
    color: Colors.red,
    fontFamily: Fonts.MontserratMedium,
  },
  continueBtn: {
    marginTop: 14,
    height: 46,
    width: '100%',
    alignSelf: 'stretch',
    backgroundColor: Colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center'
  },
  continueDisabled: { opacity: 0.6 },
  continueText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
  },
  continueArrowCircle: {
    position: 'absolute',
    right: 5,
    height: 35,
    width: 35,
    borderRadius: 50,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomLinkRow: { marginTop: 12, marginBottom: 0, alignItems: 'center' },
  bottomLinkText: {
    fontSize: 14, color: Colors.titleTextColor,
    fontFamily: Fonts.MontserratRegular
  },
  bottomLinkStrong: {
    color: Colors.red,
    fontSize: 14,
    fontFamily: Fonts.PoppinsSemiBold,
    textDecorationLine: 'underline',
  },
  bg: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 18,
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B1B3A',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalOption: {
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F1F4F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  modalOptionText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B1B3A',
  },
});

