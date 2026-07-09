import { StyleSheet } from 'react-native';
import { Fonts } from '@/utils/fonts';
import { Colors } from '@/theme/colors';

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  scrollBody: {
    paddingBottom: 24,
  },
  infoSection: {
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 16,
    overflow: 'hidden',
  },
  leafPattern: {
    ...StyleSheet.absoluteFill,
    opacity: 0.07,
  },
  partLabel: {
    fontSize: 14,
    letterSpacing: 1.2,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratSemiBold,
    marginBottom: 6,
  },
  sequenceTitle: {
    fontSize: 20,
    color: Colors.red,
    fontFamily: Fonts.PoppinsSemiBold,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    alignItems: 'center',
  },
  statItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3
  },
  statText: {
    fontSize: 14,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratMedium,
  },

  actionsRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 14,
    marginBottom: 4,
  },
  prevBtn: {
    height: 45,
    backgroundColor: Colors.gray,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 'auto',
  },
  prevBtnText: {
    color: Colors.red,
    fontSize: 15,
    fontFamily: Fonts.PoppinsMedium,
    paddingRight: 16,
    lineHeight: 15,
  },
  continueArrowCircleLeft: {
    width: 38,
    height: 38,
    borderRadius: 50,
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  continueBtn: {
    width: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: Colors.darkBlue,
    height: 45,
  },
  continueArrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 50,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  continueText: {
    fontSize: 15,
    color: Colors.white,
    fontFamily: Fonts.PoppinsMedium,
    paddingLeft: 16,
    lineHeight: 15,
  },

  cardsBlock: {
    paddingHorizontal: 12,
    paddingTop: 8,
    gap: 12,
  },
  overviewCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  cardHeaderTitle: {
    fontSize: 16,
    color: Colors.darkBlue,
    fontFamily: Fonts.PoppinsSemiBold,
    flex: 1,
  },
  overviewBody: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.titleTextColorGray,
    fontFamily: Fonts.MontserratRegular,
  },

  benefitsCard: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  benefitsHeaderTitle: {
    fontSize: 16,
    color: Colors.white,
    fontFamily: Fonts.PoppinsSemiBold,
    flex: 1,
  },
  benefitLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  benefitBullet: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.white,
    marginTop: 7,
    opacity: 0.5
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.white,
    opacity: 0.5,
    fontFamily: Fonts.MontserratRegular,
  },
});
