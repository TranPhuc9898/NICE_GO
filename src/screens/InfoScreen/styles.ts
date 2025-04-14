import {StyleSheet} from 'react-native';
import {spacing} from '../../constants/index';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: spacing.SPACING_15,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: spacing.SPACING_20,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
  },
  formContainer: {
    marginBottom: spacing.SPACING_30,
  },
  submitButton: {
    backgroundColor: '#1154FF',
    borderRadius: spacing.SPACING_10,
    paddingVertical: spacing.SPACING_20,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
