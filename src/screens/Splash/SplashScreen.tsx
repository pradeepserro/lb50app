import React, { useEffect } from 'react';
import { Image, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { styles } from '@/screens/Splash/SplashScreen.styles';
import SplashLogo from '@assets/icons/splash_screen_logo.png';
import { getAuthToken, getHasOnboarded, getQuestionnaireCompleted } from '@/utils/storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export function SplashScreen({ navigation }: Props) {
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const [token, hasOnboarded, questionnaireCompleted] = await Promise.all([
        getAuthToken(),
        getHasOnboarded(),
        getQuestionnaireCompleted(),
      ]);

      const target: keyof RootStackParamList = token
        ? questionnaireCompleted
          ? 'Dashboard'
          : 'Questionnaire'
        : hasOnboarded
          ? 'Auth'
          : 'Intro';

      const t = setTimeout(() => {
        if (!cancelled) navigation.replace(target);
      }, 3500);

      return () => clearTimeout(t);
    };

    const cleanupPromise = run();

    return () => {
      cancelled = true;
      cleanupPromise.then(cleanup => cleanup?.()).catch(() => undefined);
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@assets/images/main_splash_bg.png')}
        style={styles.bg}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <Image source={SplashLogo} style={styles.logoImage} resizeMode="contain" />
      </View>
    </View>
  );
}
