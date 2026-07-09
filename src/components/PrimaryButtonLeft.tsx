import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
  View
} from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

type Props = {
  title: string;
  onPress: PressableProps['onPress'];
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  renderLeftAccessory?: () => React.ReactNode;
};

export function PrimaryButtonLeft({
  title,
  onPress,
  disabled,
  loading,
  style,
  titleStyle,
  renderLeftAccessory,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      <View style={styles.content}>
        {renderLeftAccessory?.()}
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        )}
      </View>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  button: {
    height: 45,
    borderRadius: 50,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: Colors.primaryDark,
  },
  disabled: {
    opacity: 0.6,
  },
  title: {
    color: Colors.text,
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
    letterSpacing: 0.2,
  },
});

