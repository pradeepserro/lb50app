import React, { useContext } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { Pressable, View } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';
import Bubble, { type BubbleProps } from '@/components/Bubble';
import { useRingStyles } from '@/components/ActionRing/ActionRing.styles';
import { RingStyleContext, type RingMetrics } from '@/components/ActionRing/ringStyleContext';

export type ActionRingBubble = Pick<
  BubbleProps,
  'label' | 'icon' | 'onPress' | 'isPressable' | 'labelNumberOfLines' | 'showArrow' | 'pressableProps'
> & {
  key?: string;
  style?: StyleProp<ViewStyle>;
};

export type ActionRingProps = {
  onPress?: () => void;
  children: React.ReactNode;
  bubbles?: ActionRingBubble[];
};

export function useActionRingMetrics(): RingMetrics | null {
  return useContext(RingStyleContext)?.metrics ?? null;
}

function sanitizeSvgId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, '');
}

export function ActionRing({
  onPress,
  children,
  bubbles,
}: ActionRingProps) {
  const { ringStyles, bubbleStyles, metrics } = useRingStyles();
  const rawId = typeof (React as any).useId === 'function' ? (React as any).useId() : 'ringInnerGrad';
  const gradientId = React.useMemo(() => sanitizeSvgId(String(rawId || 'ringInnerGrad')), [rawId]);

  return (
    <RingStyleContext.Provider value={{ bubbleStyles, metrics }}>
      <View style={ringStyles.ringWrap}>
        <View style={ringStyles.ringOuter}>
          <View style={ringStyles.ringDashed} pointerEvents="none" />

          {onPress ? (
            <Pressable
              accessibilityRole="button"
              onPress={onPress}
              style={ringStyles.ringInner}
            >
              <Svg width="100%" height="100%" style={ringStyles.ringInnerGradient}>
                <Defs>
                  <RadialGradient id={gradientId} cx="50%" cy="50%" rx="70%" ry="70%">
                    <Stop offset="10%" stopColor="#13204B" />
                    <Stop offset="58%" stopColor="#40559A" />
                  </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" rx="999" ry="999" fill={`url(#${gradientId})`} />
              </Svg>

              {children}
            </Pressable>
          ) : (
            <View style={ringStyles.ringInner}>
              <Svg width="100%" height="100%" style={ringStyles.ringInnerGradient}>
                <Defs>
                  <RadialGradient id={gradientId} cx="50%" cy="50%" rx="70%" ry="70%">
                    <Stop offset="10%" stopColor="#13204B" />
                    <Stop offset="58%" stopColor="#40559A" />
                  </RadialGradient>
                </Defs>
                <Rect width="100%" height="100%" rx="999" ry="999" fill={`url(#${gradientId})`} />
              </Svg>

              {children}
            </View>
          )}

          {bubbles?.map((bubble, index) => (
            <Bubble
              key={bubble.key ?? `${index}`}
              label={bubble.label}
              icon={bubble.icon}
              onPress={bubble.onPress}
              isPressable={bubble.isPressable}
              style={bubble.style}
              labelNumberOfLines={bubble.labelNumberOfLines}
              showArrow={bubble.showArrow}
              pressableProps={bubble.pressableProps}
            />
          ))}
        </View>
      </View>
    </RingStyleContext.Provider>
  );
}
