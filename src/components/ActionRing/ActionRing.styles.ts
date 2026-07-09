import { useMemo } from 'react';
import { useWindowDimensions, type TextStyle, type ViewStyle } from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

const BASE_OUTER_SIZE = 260;

export type RingBubblePlacement =
  | 'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'bottomRight2';

export type RingMetrics = {
  outerSize: number;
  dashedSize: number;
  innerSize: number;
  nodeSize: number;
  scale: number;
  bubbleIconSize: number;
  centerIconSize: number;
  centerTitleFontSize: number;
  centerSubtitleFontSize: number;
};

export type RingPlacementVariant = 'home' | 'hub';

const SIX_BUBBLE_SLOTS = 6;

export type RingStylesResult = {
  ringStyles: {
    ringWrap: ViewStyle;
    ringOuter: ViewStyle;
    ringDashed: ViewStyle;
    ringInner: ViewStyle;
    ringInnerGradient: ViewStyle;
  };
  bubbleStyles: {
    bubble: ViewStyle;
    bubbleIconWrap: ViewStyle;
    bubbleMain: ViewStyle;
    bubbleLabel: TextStyle;
    arrowRight: ViewStyle;
  };
  getPlacementStyle: (
    placement: RingBubblePlacement,
    variant?: RingPlacementVariant,
  ) => ViewStyle;
  /** Evenly spaces six bubbles on the dashed ring (clockwise from top). */
  getSixBubblePlacementStyle: (slotIndex: number) => ViewStyle;
  metrics: RingMetrics;
};

function scaleValue(value: number, scale: number) {
  return value * scale;
}

export function useRingStyles(): RingStylesResult {
  const { width } = useWindowDimensions();

  return useMemo(() => {
    const outerSize = Math.min(width * 0.75, 380);
    const dashedSize = outerSize * 0.82;
    const innerSize = outerSize * 0.63;
    const nodeSize = outerSize * 0.28;
    const scale = outerSize / BASE_OUTER_SIZE;

    const metrics: RingMetrics = {
      outerSize,
      dashedSize,
      innerSize,
      nodeSize,
      scale,
      bubbleIconSize: Math.round(scaleValue(16, scale)),
      centerIconSize: Math.round(scaleValue(16, scale)),
      centerTitleFontSize: scaleValue(14, scale),
      centerSubtitleFontSize: scaleValue(13, scale),
    };

    const dashedInset = (outerSize - dashedSize) / 2;

    const ringStyles = {
      ringWrap: {
        flex: 1,
        alignItems: 'center' as const,
        justifyContent: 'flex-start' as const,
        paddingVertical: scaleValue(10, scale),
        width: '100%' as const,
      },
      ringOuter: {
        width: outerSize,
        aspectRatio: 1,
        borderRadius: outerSize / 2,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        position: 'relative' as const,
      },
      ringDashed: {
        position: 'absolute' as const,
        top: dashedInset,
        left: dashedInset,
        width: dashedSize,
        aspectRatio: 1,
        borderRadius: dashedSize / 2,
        borderWidth: scaleValue(2, scale),
        borderColor: Colors.darkBlue,
        borderStyle: 'dashed' as const,
      },
      ringInner: {
        width: innerSize,
        aspectRatio: 1,
        borderRadius: innerSize / 2,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        overflow: 'hidden' as const,
      },
      ringInnerGradient: {
        position: 'absolute' as const,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    };

    const bubblePaddingH = scaleValue(2, scale);
    const bubblePaddingTop = scaleValue(2, scale);
    const bubblePaddingBottom = scaleValue(5, scale);

    const bubbleStyles = {
      bubble: {
        position: 'absolute' as const,
        backgroundColor: Colors.white,
        borderRadius: nodeSize / 2,
        paddingHorizontal: bubblePaddingH,
        paddingTop: bubblePaddingTop,
        paddingBottom: bubblePaddingBottom,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: scaleValue(16, scale),
        shadowOffset: { width: 0, height: scaleValue(10, scale) },
        elevation: 5,
        minWidth: nodeSize,
        maxWidth: scaleValue(118, scale),
        minHeight: nodeSize,
      },
      bubbleIconWrap: {
        marginBottom: scaleValue(2, scale),
      },
      bubbleMain: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        gap: scaleValue(3, scale),
        marginTop: scaleValue(1, scale),
        paddingHorizontal: scaleValue(2, scale),
      },
      bubbleLabel: {
        flexShrink: 1,
        fontSize: scaleValue(10, scale),
        color: Colors.titleTextColorGray,
        fontFamily: Fonts.MontserratSemiBold,
        textAlign: 'center' as const,
        lineHeight: scaleValue(11, scale),
      },
      arrowRight: {},
    };

    const edgeOffset = scaleValue(-10, scale);
    const centerShiftY = scaleValue(34, scale);
    const bottomRightOffset = scaleValue(50, scale);
    const orbitRadius = dashedSize / 2;
    const halfNode = nodeSize / 2;

    const getOrbitalPlacementStyle = (angle: number): ViewStyle => ({
      left: '50%',
      top: '50%',
      transform: [
        { translateX: orbitRadius * Math.cos(angle) - halfNode },
        { translateY: orbitRadius * Math.sin(angle) - halfNode },
      ],
    });

    const getSixBubblePlacementStyle = (slotIndex: number): ViewStyle => {
      const startAngle = -Math.PI / 2;
      const angle =
        startAngle + (2 * Math.PI * (slotIndex % SIX_BUBBLE_SLOTS)) / SIX_BUBBLE_SLOTS;
      return getOrbitalPlacementStyle(angle);
    };

    const getPlacementStyle = (
      placement: RingBubblePlacement,
      variant: RingPlacementVariant = 'home',
    ): ViewStyle => {
      const sideAnchor = variant === 'hub' ? '32%' : '50%';

      if (variant === 'home') {
        switch (placement) {
          case 'top':
            return getOrbitalPlacementStyle(-Math.PI / 2);
          case 'right':
            return getOrbitalPlacementStyle(0);
          case 'bottom':
            return getOrbitalPlacementStyle(Math.PI / 2);
          case 'left':
            return getOrbitalPlacementStyle(Math.PI);
        }
      }

      switch (placement) {
        case 'top':
          return getOrbitalPlacementStyle(-Math.PI / 2);
        case 'left':
          return {
            left: edgeOffset,
            top: sideAnchor,
            transform: [{ translateY: -centerShiftY }],
          };
        case 'right':
          return {
            right: edgeOffset,
            top: sideAnchor,
            transform: [{ translateY: -centerShiftY }],
          };
        case 'bottom':
          return getOrbitalPlacementStyle(Math.PI / 2);
        case 'bottomLeft':
          return {
            left: edgeOffset,
            top: variant === 'hub' ? '70%' : sideAnchor,
            transform: [{ translateY: -centerShiftY }],
          };
        case 'bottomRight':
          return {
            right: edgeOffset,
            bottom: bottomRightOffset,
          };
        case 'bottomRight2':
          return getOrbitalPlacementStyle(Math.PI / 2);
        default:
          return {};
      }
    };

    return {
      ringStyles,
      bubbleStyles,
      getPlacementStyle,
      getSixBubblePlacementStyle,
      metrics,
    };
  }, [width]);
}
