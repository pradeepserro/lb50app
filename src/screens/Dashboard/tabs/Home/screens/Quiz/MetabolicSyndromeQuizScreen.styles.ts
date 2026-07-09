import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

const BASE_CARD_WIDTH = 340;
const BASE_CARD_HEIGHT = 350;
const BASE_IMAGE_HEIGHT = 180;
const EMPTY_STATE_ASPECT_RATIO = 390 / 493;

export function useQuizCardMetrics() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const horizontalPadding = 24;
    const cardWidth = Math.min(Math.max(width - horizontalPadding, 280), BASE_CARD_WIDTH);
    const widthScale = cardWidth / BASE_CARD_WIDTH;

    const reservedVertical = Math.min(340, Math.round(height * 0.4));
    const usableHeight = Math.max(height - reservedVertical, 200);
    const aspectHeight = cardWidth * (BASE_CARD_HEIGHT / BASE_CARD_WIDTH);
    const minCardHeight = BASE_CARD_HEIGHT;
    const maxCardHeight = Math.round(
      Math.min(
        usableHeight * 0.88,
        height * 0.5,
        Math.max(aspectHeight, BASE_CARD_HEIGHT * widthScale),
      ),
    );
    const defaultCardHeight = Math.round(
      Math.max(
        minCardHeight,
        Math.min(Math.max(aspectHeight, minCardHeight), maxCardHeight),
      ),
    );
    const imageWidth = Math.round(cardWidth - 44 * widthScale);
    const imageHeight = Math.round(BASE_IMAGE_HEIGHT * widthScale);

    return {
      cardWidth,
      minCardHeight,
      maxCardHeight,
      defaultCardHeight,
      scale: widthScale,
      cardPaddingH: Math.round(22 * widthScale),
      cardPaddingTop: Math.round(28 * widthScale),
      cardPaddingBottom: Math.round(24 * widthScale),
      cardTitleFontSize: Math.round(20 * widthScale),
      cardTitleLineHeight: Math.round(24 * widthScale),
      cardDescriptionFontSize: Math.round(13 * widthScale),
      cardDescriptionLineHeight: Math.round(18 * widthScale),
      imageWidth,
      imageHeight,
    };
  }, [width, height]);
}

export const styles = StyleSheet.create({
  headerSideSpacer: {
    width: 56,
    height: 1,
  },
  headerSideRight: {
    justifyContent: 'flex-end',
  },
  skipButton: {
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'transparent',
  },
  skipText: {
    fontSize: 12,
    color: Colors.red,
    fontFamily: Fonts.PoppinsMedium,
  },
  scrollContent: {
    paddingBottom: 120,
    paddingTop: 16,
    gap: 24,
    paddingHorizontal: 12,
  },
  scrollContentCentered: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: 0,
  },
  loadingContainer: {
    minHeight: 320,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyStateContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },
  emptyStateImage: {
    maxWidth: 300,
    aspectRatio: EMPTY_STATE_ASPECT_RATIO,
  },
  funQuizLabel: {
    fontSize: 14,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratSemiBold,
  },
  stepRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepText: {
    fontSize: 20,
    color: Colors.red,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  percentPill: {
    backgroundColor: Colors.darkBlue,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  percentText: {
    fontSize: 12,
    color: Colors.white,
    fontFamily: Fonts.MontserratSemiBold,
  },
  progressTrack: {
    marginTop: 10,
    height: 5,
    borderRadius: 999,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    borderWidth: 0
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: Colors.green,
  },
  cardArea: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  cardShadowWrap: {
    alignSelf: 'center',
    borderRadius: 18,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  cardFace: {
    borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  cardTitle: {
    fontSize: 20,
    color: Colors.darkBlue,
    fontFamily: Fonts.PoppinsSemiBold,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardDescription: {
    marginTop: 14,
    fontSize: 13,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratRegular,
    lineHeight: 18,
    textAlign: 'center',
  },
  cardImage: {
    marginTop: 16,
    borderRadius: 14,
    backgroundColor: Colors.gray,
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginTop: 20,
    marginBottom: 4,
    paddingBottom: 24,
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
});
