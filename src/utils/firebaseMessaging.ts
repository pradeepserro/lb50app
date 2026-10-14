import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import type {
  Messaging,
  RemoteMessage,
} from '@react-native-firebase/messaging';
import { NativeModules, PermissionsAndroid, Platform } from 'react-native';
import { registerDeviceTokenApi } from '@/api/deviceToken/deviceTokenEndpoints';
import { getAuthToken } from '@/utils/storage';

const PERMISSION_REQUESTED_KEY = '@lb50/fcm-notification-permission-requested';
const REDACTED = '[REDACTED]';
const SENSITIVE_FIELD_PATTERN =
  /authorization|access.?token|refresh.?token|password|passcode|secret|api.?key|credential|cookie|otp|pin/i;

let lastRegisteredAuthToken: string | null = null;
let lastRegisteredFcmToken: string | null = null;
let pendingAuthToken: string | null = null;
let pendingFcmToken: string | null = null;
let registrationInFlight: Promise<void> | null = null;

type ForegroundNotificationModule = {
  show: (title: string, body: string) => void;
};

const foregroundNotification = NativeModules.ForegroundNotification as
  | ForegroundNotificationModule
  | undefined;

function sanitizeString(value: string): string {
  const assignmentPattern = new RegExp(
    '((?:' +
      SENSITIVE_FIELD_PATTERN.source +
      ')\\s*[:=]\\s*)[^\\s,}&]+',
    'gi',
  );

  return value
    .replace(/(Bearer\s+)[A-Za-z0-9._~+/=-]+/gi, '$1' + REDACTED)
    .replace(assignmentPattern, '$1' + REDACTED);
}

function sanitizeForLog(
  value: unknown,
  field?: string,
  seen = new WeakSet<object>(),
): unknown {
  if (field && SENSITIVE_FIELD_PATTERN.test(field)) {
    return REDACTED;
  }

  if (value === null || value === undefined) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try {
        return sanitizeForLog(JSON.parse(value), field, seen);
      } catch {
        // Keep non-JSON strings intact apart from credential redaction.
      }
    }
    return sanitizeString(value);
  }

  if (typeof value !== 'object') {
    return value;
  }

  if (seen.has(value)) {
    return '[Circular]';
  }
  seen.add(value);

  if (Array.isArray(value)) {
    const result = value.map(item => sanitizeForLog(item, undefined, seen));
    seen.delete(value);
    return result;
  }

  const result = Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, item]) => [
      key,
      sanitizeForLog(item, key, seen),
    ]),
  );
  seen.delete(value);
  return result;
}

function formatRemoteMessage(message: RemoteMessage): string {
  try {
    return JSON.stringify(sanitizeForLog(message), null, 2);
  } catch {
    return '[Unable to serialize message safely]';
  }
}

function logFcmError(context: string, error: unknown): void {
  if (!__DEV__) {
    return;
  }

  const message = error instanceof Error ? error.message : String(error);
  console.error('[FCM] ' + context + ': ' + sanitizeString(message));
}

function displayForegroundNotification(message: RemoteMessage): void {
  const title = message.notification?.title;
  const body = message.notification?.body;

  if (!title && !body) {
    return;
  }

  try {
    foregroundNotification?.show(title ?? '', body ?? '');
  } catch (error) {
    logFcmError('Unable to display foreground notification', error);
  }
}

async function requestAndroidNotificationPermission(): Promise<void> {
  if (Platform.OS !== 'android' || Number(Platform.Version) < 33) {
    return;
  }

  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
  if (await PermissionsAndroid.check(permission)) {
    return;
  }

  try {
    const wasRequested =
      (await AsyncStorage.getItem(PERMISSION_REQUESTED_KEY)) === 'true';
    if (wasRequested) {
      return;
    }
  } catch (error) {
    logFcmError('Unable to read notification permission state', error);
  }

  await PermissionsAndroid.request(permission);

  try {
    await AsyncStorage.setItem(PERMISSION_REQUESTED_KEY, 'true');
  } catch (error) {
    logFcmError('Unable to save notification permission state', error);
  }
}

async function registerTokenForAuthenticatedUser(
  fcmToken: string,
): Promise<void> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return;
  }

  if (
    lastRegisteredAuthToken === authToken &&
    lastRegisteredFcmToken === fcmToken
  ) {
    return;
  }

  if (registrationInFlight) {
    if (pendingAuthToken === authToken && pendingFcmToken === fcmToken) {
      return registrationInFlight;
    }

    await registrationInFlight;
    return registerTokenForAuthenticatedUser(fcmToken);
  }

  pendingAuthToken = authToken;
  pendingFcmToken = fcmToken;
  registrationInFlight = (async () => {
    try {
      await registerDeviceTokenApi({
        fcm_token: fcmToken,
        device_type: 'android',
      });
      lastRegisteredAuthToken = authToken;
      lastRegisteredFcmToken = fcmToken;
    } catch {
      // The shared API client reports failures through its development logger.
    } finally {
      pendingAuthToken = null;
      pendingFcmToken = null;
      registrationInFlight = null;
    }
  })();

  return registrationInFlight;
}

async function generateFcmToken(messaging: Messaging): Promise<void> {
  try {
    await requestAndroidNotificationPermission();
    const token = await getToken(messaging);

    if (__DEV__) {
      console.log(
        '========== FCM TOKEN ==========\n' +
          token +
          '\n===============================',
      );
    }

    await registerTokenForAuthenticatedUser(token);
  } catch (error) {
    logFcmError('Initialization failed', error);
  }
}


export async function syncFirebaseTokenForAuthenticatedUser(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await generateFcmToken(getMessaging());
}

export function registerFirebaseBackgroundHandler(): void {
  if (Platform.OS !== 'android') {
    return;
  }

  setBackgroundMessageHandler(getMessaging(), async remoteMessage => {
    if (__DEV__) {
      console.log(
        '========== FCM BACKGROUND MESSAGE ==========\n' +
          formatRemoteMessage(remoteMessage) +
          '\n=============================================',
      );
    }
  });
}

export function initializeFirebaseMessaging(): () => void {
  if (Platform.OS !== 'android') {
    return () => undefined;
  }

  const messaging = getMessaging();
  const unsubscribeForeground = onMessage(messaging, remoteMessage => {
    if (__DEV__) {
      console.log(
        '========== FCM FOREGROUND MESSAGE ==========\n' +
          formatRemoteMessage(remoteMessage) +
          '\n=============================================',
      );
    }

    displayForegroundNotification(remoteMessage);
  });
  const unsubscribeTokenRefresh = onTokenRefresh(messaging, token => {
    if (__DEV__) {
      console.log(
        '========== FCM TOKEN REFRESH ==========\n' +
          token +
          '\n========================================',
      );
    }

    registerTokenForAuthenticatedUser(token).catch(error => {
      logFcmError('Token refresh synchronization failed', error);
    });
  });

  generateFcmToken(messaging).catch(error => {
    logFcmError('Initialization failed', error);
  });

  return () => {
    unsubscribeForeground();
    unsubscribeTokenRefresh();
  };
}
