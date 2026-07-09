import { StyleSheet } from 'react-native';

export const dashboardScreenLayoutStyles = StyleSheet.create({
  root: { flex: 1 },
  container: { flex: 1 },
  bgWrap: {
    ...StyleSheet.absoluteFill,
  },
  bg: { width: '100%', height: '100%' },
  header: {
    zIndex: 1,
    elevation: 1,
  },
  content: {
    flex: 1,
    zIndex: 1,
    elevation: 1,
  },
});
