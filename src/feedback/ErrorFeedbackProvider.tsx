import React, { useCallback, useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { Fonts } from '@/utils/fonts';
import { registerErrorFeedbackShow } from '@/feedback/errorFeedbackBridge';

type Payload = { title: string; message: string };

export function ErrorFeedbackProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  const [payload, setPayload] = useState<Payload | null>(null);

  const hide = useCallback(() => {
    setPayload(null);
  }, []);

  useEffect(() => {
    const show: (title: string, message: string) => void = (title, message) => {
      setPayload({ title, message });
    };
    registerErrorFeedbackShow(show);
    return () => registerErrorFeedbackShow(null);
  }, []);

  const visible = payload !== null;

  return (
    <>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={hide}>
        <View style={[styles.root, { paddingTop: insets.top }]}>
          <Pressable
            style={styles.backdrop}
            onPress={hide}
            accessibilityLabel="Dismiss error"
          />
          <View style={styles.card} accessibilityRole="alert">
            <View style={styles.accentBar} />
            <View style={styles.cardContent}>
              <Text style={styles.title}>{payload?.title ?? 'Error'}</Text>
              <Text style={styles.message}>{payload?.message ?? ''}</Text>
              <Pressable
                accessibilityRole="button"
                onPress={hide}
                style={({ pressed }) => [
                  styles.button,
                  pressed && styles.buttonPressed,
                ]}>
                <Text style={styles.buttonText}>OK</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(11, 27, 58, 0.45)',
  },
  card: {
    zIndex: 1,
    width: '100%',
    maxWidth: 340,
    flexDirection: 'row',
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  accentBar: {
    width: 5,
    alignSelf: 'stretch',
    backgroundColor: Colors.red,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 18,
  },
  title: {
    marginTop: 0,
    fontSize: 18,
    fontWeight: '700',
    color: Colors.red,
    fontFamily: Fonts.PoppinsBold,
    textAlign: 'center',
  },
  message: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 21,
    color: Colors.titleTextColor,
    fontFamily: Fonts.MontserratRegular,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    height: 46,
    borderRadius: 50,
    backgroundColor: Colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    opacity: 0.92,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: Fonts.PoppinsMedium,
  },
});
