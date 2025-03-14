import { StyleSheet } from 'react-native';
import { colors } from '../../../constants/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  signOutButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  signOutButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
