import React from 'react';
import { Pressable, View } from 'react-native';
import BackLeftIcon from '@assets/icons/back_left.svg';
import { screenHeaderStyles } from '@/components/screenLayout/screenHeader.styles';

type Props = {
  onPress: () => void;
};

export function ScreenHeaderBackButton({ onPress }: Props) {
  return (
    <View>
      <Pressable
        accessibilityRole="button"
        style={screenHeaderStyles.headerBack}
        onPress={onPress}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <View pointerEvents="none">
          <BackLeftIcon width={18} height={18} />
        </View>
      </Pressable>
    </View>
  );
}
