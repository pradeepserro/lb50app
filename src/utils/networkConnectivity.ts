import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

export const INTERNET_UNAVAILABLE_MESSAGE =
    'Internet Not Available. Please check your internet connection and then try again';

let connectionWaitPromise: Promise<void> | null = null;

async function isInternetAvailable(): Promise<boolean> {
    try {
        const state = await NetInfo.fetch();

        return (
            state.isConnected === true &&
            state.isInternetReachable !== false
        );
    } catch {
        return false;
    }
}

function showOfflineAlert(onRetry: () => void): void {
    Alert.alert(
        'Internet Not Available',
        INTERNET_UNAVAILABLE_MESSAGE,
        [{ text: 'Retry', onPress: onRetry }],
        { cancelable: false },
    );
}

export async function waitForInternetConnection(): Promise<void> {
    if (await isInternetAvailable()) {
        return;
    }

    if (connectionWaitPromise) {
        return connectionWaitPromise;
    }

    connectionWaitPromise = new Promise<void>(resolve => {
        const retry = async (): Promise<void> => {
            if (await isInternetAvailable()) {
                connectionWaitPromise = null;
                resolve();
                return;
            }

            showOfflineAlert(retry);
        };

        showOfflineAlert(retry);
    });

    return connectionWaitPromise;
}
