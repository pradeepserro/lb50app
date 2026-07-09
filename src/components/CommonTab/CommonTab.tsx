import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  Pressable,
  View,
} from 'react-native';
import { styles } from '@/components/CommonTab/CommonTab.styles';

export type CommonTabValue = number;

type TabItem = {
  label: string;
  value: CommonTabValue;
};

type Props = {
  tabs: TabItem[];
  value: CommonTabValue;
  onChange: (value: CommonTabValue) => void;
};

export function CommonTab({ tabs, value, onChange }: Props) {
  const [trackWidth, setTrackWidth] = useState(0);

  const slideAnim = useRef(new Animated.Value(0)).current;
  const hasLaidOut = useRef(false);

  const tabCount = tabs.length;

  const segmentWidth =
    trackWidth > 0 && tabCount > 0
      ? trackWidth / tabCount
      : 0;

  const activeIndex = Math.max(
    0,
    tabs.findIndex((t) => t.value === value),
  );

  useEffect(() => {
    if (segmentWidth <= 0) return;

    const targetX = activeIndex * segmentWidth;

    // Initial render
    if (!hasLaidOut.current) {
      slideAnim.setValue(targetX);
      hasLaidOut.current = true;
      return;
    }

    // Smooth indicator animation only
    Animated.spring(slideAnim, {
      toValue: targetX,
      useNativeDriver: true,
      stiffness: 260,
      damping: 24,
      mass: 0.9,
    }).start();
  }, [activeIndex, segmentWidth, slideAnim]);

  const onTrackLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;

    if (width !== trackWidth) {
      setTrackWidth(width);
    }
  };

  return (
    <View style={styles.track} onLayout={onTrackLayout}>
      {segmentWidth > 0 && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            {
              width: segmentWidth,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        />
      )}

      {tabs.map((tab) => {
        const active = value === tab.value;

        return (
          <Pressable
            key={tab.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(tab.value)}
            style={({ pressed }) => [
              styles.tab,
              pressed && styles.tabPressed,
            ]}
          >
            <Animated.Text
              style={[
                styles.label,
                active && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Animated.Text>
          </Pressable>
        );
      })}
    </View>
  );
}