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
  Keyboard,
  TouchableWithoutFeedback,
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
import {spacing, SPACING_50} from '@/constants';

import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IUserResponse {
  access_token: string;
  user: {
    role_index: number | string;
    // Thêm các thuộc tính khác nếu cần
  };
}
interface IFormValues {
  phone: string;
  password: string;
}

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const {signIn} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();

  const storeUserSession = async (data: any) => {
    console.log('🚀 ~ storeUserSession ~ data:', data);
    try {
      // Lưu access_token
      await AsyncStorage.setItem('userToken', data.access_token);
      // Nếu cần, lưu luôn thông tin role
      if (data.user && data.user.role_index) {
        await AsyncStorage.setItem('userData', JSON.stringify(data.user));
      }
    } catch (error) {
      console.error('Error storing user data:', error);
    }
  };

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
      console.log('🚀 ~ LoginScreen ~ response:', response);
      await storeUserSession(response);
      const roleIndex = _.get(response, 'user.role_index');
      if (!_.isEmpty(roleIndex)) {
        dispatch(setUserRole(roleIndex));
      }
      signIn(response.access_token);
    } catch (err: any) {
      Alert.alert('Eror', err?.response?.data?.data?.msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* <CustomLoading visible={loading} /> */}
          {/* VIEW TEXT */}
          <View style={styles.viewText}>
            <Text style={styles.welcomeText}>Welcome!</Text>
            <View style={styles.viewSubText}>
              <Text style={styles.subText}>Sign in to your account</Text>
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
              <TextInPut
                name="password"
                placeholder="Enter Password"
                secureTextEntry
                type="password"
              />
            </FormProvider>
          </View>
          {/* END VIEW FORM */}

          {/* VIEW FORGOTPASSWORD */}
          <View style={styles.viewForgotPassWord}>
            <TouchableOpacity
              style={{paddingTop: 10}}
              onPress={() => {
                navigation.navigate('ForgotPasswordScreen');
              }}>
              <Text style={styles.forgotPassword}>
                {'Forgot your password?'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* END VIEW FORGOTPASSWORD */}

          {/* VIEW LOG-IN */}
          <View>
            <TouchableOpacity
              style={[styles.submitButton, !isValid && styles.buttonDisabled]}
              onPress={handleSubmit(onSubmit)}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitText}>{'Log In'}</Text>
              )}
            </TouchableOpacity>
          </View>
          {/* END VIEW LOG-IN */}

          {/* VIEW LOG-IN SOCIAL */}
          <View style={{paddingTop: 50}}>
            <View style={{alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: '#848484'}}>
                {'Or sign up with social account'}
              </Text>
            </View>
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
                    <Text>{'Sign in with Google'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
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
                    <Text>{'Sign in with Google'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/* END VIEW LOG-IN SOCIAL */}

          <View style={{paddingTop: spacing.SPACING_60 * 2}}>
            <TouchableOpacity
              style={{alignItems: 'center', paddingTop: 10}}
              onPress={() => {
                navigation.navigate('RegisterScreen');
              }}>
              <Text style={{color: '#848484'}}>
                Don't have an account?
                <Text style={styles.forgotPassword}> Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
