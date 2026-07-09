import { Alert } from 'react-native';

type ShowFn = (title: string, message: string) => void;

let showImpl: ShowFn | null = null;

export function registerErrorFeedbackShow(fn: ShowFn | null): void {
  showImpl = fn;
}

export function showThemedErrorFeedback(title: string, message: string): void {
  if (showImpl) {
    showImpl(title, message);
    return;
  }
  Alert.alert(title, message);
}
