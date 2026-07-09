import React, { useContext } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';
import RightArrowNavIcon from '@assets/icons/right_arrow_nav.svg';
import { RingStyleContext } from '@/components/ActionRing/ringStyleContext';

type SvgIconComponent = React.ComponentType<{ width: number; height: number }>;

export type BubbleVariant = 'home' | 'hub';

export type BubbleProps = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  isPressable?: boolean;
  Icon?: SvgIconComponent;
  icon?: React.ReactNode;
  labelNumberOfLines?: number;
  showArrow?: boolean;
  pressableProps?: Omit<PressableProps, 'onPress' | 'style' | 'children'>;
};

const Bubble: React.FC<BubbleProps> = ({
  Icon,
  icon,
  label,
  onPress,
  style,
  isPressable = false,
  labelNumberOfLines,
  showArrow,
  pressableProps,
}) => {
  const ringContext = useContext(RingStyleContext);
  const baseStyles = ringContext?.bubbleStyles ?? fallbackBubbleStyles;
  const iconSize = ringContext?.metrics.bubbleIconSize ?? 22;

  const Container = isPressable ? Pressable : View;
  const iconEl = icon ?? (Icon ? <Icon width={iconSize} height={iconSize} /> : null);
  const shouldShowArrow = showArrow ?? isPressable;

  return (
    <Container
      accessibilityRole={isPressable ? 'button' : undefined}
      onPress={onPress}
      style={[baseStyles.bubble, style]}
      {...(isPressable ? pressableProps : undefined)}
    >
      {iconEl ? <View style={baseStyles.bubbleIconWrap}>{iconEl}</View> : null}
      <View style={baseStyles.bubbleMain}>
        <Text
          style={baseStyles.bubbleLabel}
          numberOfLines={labelNumberOfLines ?? 3}
        >
          {label}
        </Text>
        {shouldShowArrow ? (
          <RightArrowNavIcon width={4} height={9} style={baseStyles.arrowRight} />
        ) : null}
      </View>
    </Container>
  );
};

export default Bubble;

const fallbackBubbleStyles = StyleSheet.create({
  bubble: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    minWidth: 75,
    maxWidth: 108,
    minHeight: 75,
  },
  bubbleIconWrap: {
    marginBottom: 2,
  },
  bubbleMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 1,
    marginTop: 1,
    paddingHorizontal: 2,
  },
  bubbleLabel: {
    flexShrink: 1,
    fontSize: 10,
    color: Colors.titleTextColorGray,
    fontFamily: Fonts.MontserratMedium,
    textAlign: 'center',
    lineHeight: 11,
  },
  arrowRight: {},
});
