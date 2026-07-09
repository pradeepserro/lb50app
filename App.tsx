import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ErrorFeedbackProvider } from '@/feedback/ErrorFeedbackProvider';
import { RootNavigator } from '@/navigation/RootNavigator';
import { Colors } from '@/theme/colors';
import { persistor, store } from '@/store';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <ErrorFeedbackProvider>
              <StatusBar barStyle="light-content" backgroundColor={Colors.black} />
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </ErrorFeedbackProvider>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
}
