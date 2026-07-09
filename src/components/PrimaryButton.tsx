import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  StyleSheet,
  Text,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';

type AccessoryContext = {
  loading: boolean;
};

type Props = {
  title: string;
  onPress: PressableProps['onPress'];
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  renderRightAccessory?: (context: AccessoryContext) => React.ReactNode;
};

export function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  style,
  titleStyle,
  renderRightAccessory,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled ? styles.pressed : null,
        isDisabled ? styles.disabled : null,
        style,
      ]}>
      {loading && !renderRightAccessory ? (
        <ActivityIndicator color={Colors.text} />
      ) : (
        <Text style={[styles.title, titleStyle]}>{title}</Text>
      )}
      {renderRightAccessory?.({ loading: Boolean(loading) })}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 999,
    backgroundColor: Colors.primary,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
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
    letterSpacing: 0.2,
    fontFamily: Fonts.PoppinsMedium,
  },
});

