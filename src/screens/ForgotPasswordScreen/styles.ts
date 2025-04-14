import {Dimensions, StyleSheet} from 'react-native';
import {spacing} from '../../constants/index';

const width = Dimensions.get('window').width;

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    // justifyContent: 'center',
    padding: spacing.SPACING_15,
  },
  welcomeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  subText: {
    color: '#848484',
  },
  viewText: {},
  viewSubText: {
    paddingTop: spacing.SPACING_10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '500',
  },
  viewForm: {
    paddingTop: spacing.SPACING_30,
  },
  viewForgotPassWord: {
    alignItems: 'flex-end',
  },
  submitButton: {
    backgroundColor: '#1154FF',
    borderRadius: spacing.SPACING_10,
    paddingVertical: spacing.SPACING_20,
    alignItems: 'center',
    marginTop: spacing.SPACING_40,
  },
  submitButtonGoogle: {
    borderWidth: 0.2,
    borderRadius: spacing.SPACING_10,
    paddingVertical: spacing.SPACING_10,
    alignItems: 'center',
    marginTop: spacing.SPACING_20,
  },
  submitButtonApple: {
    borderWidth: 0.2,
    borderRadius: spacing.SPACING_10,
    paddingVertical: spacing.SPACING_10,
    alignItems: 'center',
    marginTop: spacing.SPACING_10,
  },
  buttonDisabled: {
    backgroundColor: '#1154FF',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#1154FF',
    fontSize: 14,
    marginTop: 5,
  },
  registerText: {
    color: '#8a2be2',
    fontSize: 14,
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
