import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  pickerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  pickerSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray,
  },
  pickerHeaderTitle: {
    fontSize: 15,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratSemiBold,
  },
  pickerHeaderAction: {
    fontSize: 15,
    color: Colors.green,
    fontFamily: Fonts.MontserratSemiBold,
    minWidth: 56,
  },
  pickerHeaderActionMuted: {
    color: Colors.titleTextColorGray,
    textAlign: 'left',
  },
  pickerHeaderActionDone: {
    textAlign: 'right',
  },
});
