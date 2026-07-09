import React from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { Colors } from '@/theme/colors';

type Props = {
  visible: boolean;
};

export function LoadingOverlay({ visible }: Props) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={Colors.green} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
