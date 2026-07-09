import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const DASHBOARD_TAB_BAR_HEIGHT = 80;

export function useDashboardTabBarInset(extra = 8) {
  const insets = useSafeAreaInsets();
  return DASHBOARD_TAB_BAR_HEIGHT + insets.bottom + extra;
}
