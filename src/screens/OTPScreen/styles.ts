import {StyleSheet} from 'react-native';
import {spacing} from '../../constants/index';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: spacing.SPACING_15,
    justifyContent: 'center', // Căn giữa nội dung
  },
  welcomeContainer: {
    marginBottom: spacing.SPACING_30,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
  },
  subText: {
    fontSize: 14,
    color: '#848484',
    textAlign: 'center',
    marginTop: spacing.SPACING_10,
  },
  phoneText: {
    color: '#1154FF',
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.SPACING_40,
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: spacing.SPACING_10,
    borderWidth: 1,
    borderColor: '#CCC',
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    elevation: 2,
    marginHorizontal: spacing.SPACING_20,
  },
  submitButton: {
    backgroundColor: '#1154FF',
    borderRadius: spacing.SPACING_10,
    paddingVertical: spacing.SPACING_20,
    alignItems: 'center',
    marginTop: spacing.SPACING_10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.SPACING_20,
  },
  resendText: {
    fontSize: 14,
    color: '#848484',
  },
  resendLink: {
    color: '#1154FF',
    fontWeight: '500',
  },
});
