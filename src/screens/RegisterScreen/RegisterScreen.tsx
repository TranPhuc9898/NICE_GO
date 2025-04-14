import React, {useState, useContext} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import {useNavigation} from '@react-navigation/native';
import {login} from '@/api/Auth/Login';
import {AuthContext} from '../../context/AuthContext';
import TextInPut from '@/components/TextInPut';
import CustomLoading from '@/components/CustomLoading';

import _ from 'lodash';
import {useDispatch} from 'react-redux';
import {setUserRole} from '@/redux/slice/UserSlice/UserSlice';
import {spacing} from '@/constants';

// ==== THÊM: import useTranslation ====
import {useTranslation} from 'react-i18next';

import styles from './styles';
import {OTPApi} from '@/api/Auth/OTP';

interface IFormValues {
  phone: string;
  password: string;
}

const RegisterScreen = () => {
  const navigation = useNavigation<any>();
  const {signIn} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  // ==== THÊM: Lấy hàm t() ====
  const {t} = useTranslation();

  const methods = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: {
      phone: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: {isValid},
  } = methods;

  const onSubmit: SubmitHandler<IFormValues> = async data => {
    const phone = data.phone;

    try {
      // Gọi API OTP
      const response = await OTPApi(phone);
      console.log('🚀 ~ RegisterScreen ~ response:', response);

      if (response.msg) {
        // Nếu thành công, chuyển hướng sang OTPScreen
        navigation.navigate('OTPScreen', {phone});
      }
    } catch (error: any) {
      console.error(
        '🚀 ~ onSubmit OTP API error:',
        error.response || error.message,
      );

      // Hiển thị thông báo lỗi cho người dùng nếu cần
      Alert.alert('Lỗi', 'Không thể tạo OTP. Vui lòng thử lại sau.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <CustomLoading visible={loading} />
        <View style={styles.container}>
          {/* VIEW TEXT */}
          <View style={styles.viewText}>
            {/* "Create your account" */}
            <Text style={styles.welcomeText}>
              {t('REGISTER_SCREEN.CREATE_YOUR_ACCOUNT')}
            </Text>

            <View style={[styles.viewSubText, {flexDirection: 'row'}]}>
              <Text style={styles.subText}>
                {t('REGISTER_SCREEN.ALREADY_HAVE_ACCOUNT')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                <Text style={{color: '#1154FF'}}>
                  {' '}
                  {t('REGISTER_SCREEN.LOGIN')}{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* END VIEW TEXT */}

          {/* VIEW FORM */}
          <View style={styles.viewForm}>
            <FormProvider {...methods}>
              <TextInPut
                name="phone"
                placeholder={t('REGISTER_SCREEN.PHONE_PLACEHOLDER')}
                type="phone"
                showCountryCode={true}
              />
            </FormProvider>
          </View>
          {/* END VIEW FORM */}

          {/* VIEW SIGN-UP BUTTON */}
          <View>
            <TouchableOpacity
              style={[styles.submitButton, !isValid && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>
                  {t('REGISTER_SCREEN.SIGN_UP')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {/* END VIEW SIGN-UP BUTTON */}

          {/* VIEW LOG-IN SOCIAL */}
          <View style={{paddingTop: 50}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: '#848484'}}>
                {t('REGISTER_SCREEN.OR_SIGN_UP_WITH_SOCIAL_ACCOUNT')}
              </Text>
            </View>
            {/* LOG-IN GOOGLE */}
            <View>
              <TouchableOpacity
                style={[styles.submitButtonGoogle]}
                onPress={() => {}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={{paddingRight: spacing.SPACING_10}}>
                    <Image source={require('../../assets/image/Google.png')} />
                  </View>
                  <View>
                    <Text>{t('REGISTER_SCREEN.SIGN_IN_WITH_GOOGLE')}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {/* END LOG-IN GOOGLE */}

            {/* LOG-IN APPLE */}
            <View>
              <TouchableOpacity
                style={[styles.submitButtonApple]}
                onPress={() => {}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <View style={{paddingRight: spacing.SPACING_10}}>
                    <Image source={require('../../assets/image/Apple.png')} />
                  </View>
                  <View>
                    <Text>{t('REGISTER_SCREEN.SIGN_IN_WITH_GOOGLE')}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            {/* END LOG-IN APPLE */}
          </View>
          {/* END VIEW LOG-IN SOCIAL */}

          {/* VIEW TERMS */}
          <View style={{paddingTop: spacing.SPACING_60 * 2}}>
            <TouchableOpacity style={{alignItems: 'center', paddingTop: 10}}>
              <Text style={{color: '#848484'}}>
                {t('REGISTER_SCREEN.TERMS_AGREE')}
                <Text style={styles.forgotPassword}>
                  {t('REGISTER_SCREEN.TERMS_CONDITIONS')}
                </Text>
                {t('REGISTER_SCREEN.PRIVACY_POLICY_PREFIX')}
                <Text style={styles.forgotPassword}>
                  {t('REGISTER_SCREEN.PRIVACY_POLICY')}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
          {/* END VIEW TERMS */}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default RegisterScreen;
