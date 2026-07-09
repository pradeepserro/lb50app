import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import CloseIcon from '@assets/icons/close.svg';
import LogoutIcon from '@assets/icons/logout.svg';
import { styles } from '@/components/LogoutModal/LogoutModal.styles';

type Props = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  cancelLabel?: string;
  confirmLabel?: string;
};

const DEFAULT_TITLE = 'Log out';
const DEFAULT_MESSAGE =
  'Are you sure you want to log out of your account? You will need to sign in again to access your data.';

export function LogoutModal({
  visible,
  onClose,
  onConfirm,
  title = DEFAULT_TITLE,
  message = DEFAULT_MESSAGE,
  cancelLabel = 'Cancel',
  confirmLabel = 'Log out',
}: Props) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <Pressable
          style={styles.backdrop}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Dismiss logout dialog"
        />
        <Pressable style={styles.card} onPress={() => { }} accessibilityViewIsModal>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              style={styles.cancelBtn}
              onPress={onClose}
            >
              <View style={styles.cancelIconCircle}>
                <CloseIcon width={10} height={10} />
              </View>
              <Text style={styles.cancelText}>{cancelLabel}</Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              style={styles.confirmBtn}
              onPress={onConfirm}
            >
              <View style={styles.confirmIconCircle}>
                <LogoutIcon width={18} height={18} />
              </View>
              <Text style={styles.confirmText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Pressable>
      </View>
    </Modal>
  );
}
