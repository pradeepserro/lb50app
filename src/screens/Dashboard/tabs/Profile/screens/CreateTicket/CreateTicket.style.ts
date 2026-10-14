import { StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

export const styles = StyleSheet.create({
  rootContent: {
    flex: 1,
    minHeight: 0,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerSideRight: {
    justifyContent: 'flex-end',
  },
  notificationIcon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  introCard: {
    marginBottom: 0,
  },
  introTitle: {
    color: Colors.darkBlue,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  introSubtitle: {
    marginTop: 2,
    color: Colors.darkBlue,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: Fonts.MontserratRegular,
  },
  ticketTypesList: {
    marginTop: 24,
  },
  ticketTypeCard: {
    minHeight: 76,
    marginBottom: 16,
    justifyContent: 'center',
  },
  ticketTypeTitle: {
    color: Colors.darkBlue,
    fontSize: 16,
    lineHeight: 22,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  ticketTypeDescription: {
    marginTop: 2,
    color: Colors.darkBlue,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: Fonts.MontserratRegular,
  },
  emptyCard: {
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: Colors.titleTextColorGray,
    fontSize: 13,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
  },
});
