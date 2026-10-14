/**
 * @format
 */

import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { registerFirebaseBackgroundHandler } from './src/utils/firebaseMessaging';

enableScreens(true);
registerFirebaseBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);
