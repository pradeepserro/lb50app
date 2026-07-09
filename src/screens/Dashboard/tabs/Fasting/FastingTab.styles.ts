import { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DASHBOARD_TAB_BAR_HEIGHT } from '@/components/screenLayout/dashboardLayout';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';
const BASE_WIDTH = 390;

export function useFastingTabMetrics() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return useMemo(() => {
    const scale = Math.min(Math.max(width / BASE_WIDTH, 0.82), 1.12);
    const buttonHeight = Math.round(45 * scale);
    const iconSize = Math.round(36 * scale);
    const footerGap = Math.round(14 * scale);
    const footerPaddingTop = Math.round(20 * scale);
    const scrollMinHeight = Math.max(
      height - DASHBOARD_TAB_BAR_HEIGHT - insets.bottom - 100,
      420,
    );

    return {
      scale,
      buttonHeight,
      iconSize,
      footerGap,
      footerPaddingTop,
      scrollMinHeight,
      titleFontSize: Math.round(15 * scale),
      tabBarInset: DASHBOARD_TAB_BAR_HEIGHT + insets.bottom + 8,
    };
  }, [width, height, insets.bottom]);
}

export const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  scrollBody: {
    flex: 1,
    paddingBottom: 24,
  },

  sectionLabel: {
    marginTop: 14,
    marginHorizontal: 12,
    fontSize: 14,
    color: Colors.darkBlue,
    fontFamily: Fonts.MontserratSemiBold,
    letterSpacing: 0.6,
  },

  startCard: {
    marginTop: 10,
    marginHorizontal: 12,
    backgroundColor: Colors.gray,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  startIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  startInfo: {
    flex: 1,
  },
  startDate: {
    fontSize: 14,
    color: Colors.titleTextColorGray,
    fontFamily: Fonts.MontserratMedium,
  },
  startTime: {
    marginTop: 2,
    fontSize: 18,
    color: Colors.darkBlue,
    fontFamily: Fonts.PoppinsBold,
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '900',
  },

  protocolGrid: {
    marginTop: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap: 10,
  },
  protocolCard: {
    width: "30%",
    minHeight: 80,
    margin: '1.66%',
    borderRadius: 14,
    backgroundColor: 'rgba(243, 245, 249, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  protocolCardActive: {
    backgroundColor: Colors.darkBlue,
    borderColor: Colors.darkBlue,
  },
  protocolCheck: {
    position: 'absolute',
    top: -6,
    right: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    transform: [{ translateX: -10 }],
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  protocolCheckText: {
    color: Colors.green,
    fontSize: 13,
    fontWeight: '900',
  },
  protocolHours: {
    fontSize: 18,
    color: Colors.titleTextColor,
    fontFamily: Fonts.PoppinsBold,
  },
  protocolHoursActive: {
    color: Colors.white,
  },
  protocolHrs: {
    marginTop: 2,
    fontSize: 12,
    color: Colors.titleTextColor,
    fontFamily: Fonts.MontserratSemiBold,
    letterSpacing: 0.5,
  },
  protocolHrsActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingHorizontal: 12
  },
  prevBtn: {
    height: 45,
    backgroundColor: Colors.gray,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 'auto'
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
    marginLeft: 3,
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
  }
});
