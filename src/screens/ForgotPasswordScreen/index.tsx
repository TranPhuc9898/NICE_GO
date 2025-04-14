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
import {AuthContext} from '../../context/AuthContext'; // Import AuthContext
import TextInPut from '@/components/TextInPut';
import CustomLoading from '@/components/CustomLoading'; // Sửa đường dẫn import nếu cần

import _ from 'lodash';
import {useDispatch} from 'react-redux';
import {setUserRole} from '@/redux/slice/UserSlice/UserSlice';
import {spacing, SPACING_50} from '@/constants';

import styles from './styles';
interface IFormValues {
  phone: string;
  password: string;
}

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const {signIn} = useContext(AuthContext); // Sử dụng AuthContext
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

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
    setLoading(true);
    setError(null);
    try {
      const response = await login(data.phone, data.password);
      console.log('🚀 ~ ForgotPasswordScreen ~ response:', response);
      // NOTE: LƯU Role của user
      const roleIndex = _.get(response, 'user.role_index');
      if (!_.isEmpty(roleIndex)) {
        dispatch(setUserRole(roleIndex));
      }
      // Gọi signIn từ AuthContext để lưu token và cập nhật trạng thái
      signIn(response.access_token);

      // Bạn có thể điều hướng tới màn hình chính sau khi đăng nhập thành công
      // navigation.navigate('Home'); // Thay 'Home' bằng tên màn hình chính của bạn
    } catch (err: any) {
      const message =
        err.response?.data?.msg ||
        err.message ||
        'Đăng nhập thất bại. Vui lòng thử lại.';
      console.log('🚀 ~ ForgotPasswordScreen ~ message:', message);

      setError(message);
    } finally {
      setLoading(false); // Sửa lại để tắt loading ngay lập tức
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        {/* <CustomLoading visible={loading} /> */}
        <View style={styles.container}>
          {/* VIEW TEXT */}
          <View style={styles.viewText}>
            <Text style={styles.welcomeText}>Forgot your password</Text>
            <View style={styles.viewSubText}>
              <Text style={styles.subText}>
                Please enter your email address below to receive your password
                reset instructions.
              </Text>
            </View>
          </View>
          {/* END VIEW TEXT */}

          {/* VIEW FORM */}
          <View style={styles.viewForm}>
            <FormProvider {...methods}>
              <TextInPut
                name="phone"
                placeholder="Enter Phone Number"
                type="phone"
              />
            </FormProvider>
          </View>
          {/* END VIEW FORM */}

          {/* VIEW LOG-IN */}
          <View>
            <TouchableOpacity
              style={[styles.submitButton, !isValid && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>{'Send'}</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* END VIEW LOG-IN SOCIAL */}
          <View style={{paddingTop: spacing.SPACING_60}}>
            <TouchableOpacity
              style={{alignItems: 'center', paddingTop: 10}}
              onPress={() => {
                navigation.goBack();
              }}>
              <Text style={{color: '#1154FF'}}>Back to Sign in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPasswordScreen;
