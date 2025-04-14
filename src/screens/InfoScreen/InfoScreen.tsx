import React, {useState, useContext} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {FormProvider, SubmitHandler, useForm} from 'react-hook-form';
import TextInPut from '@/components/TextInPut';
import {useRoute} from '@react-navigation/native';
import {register} from '@/api/Auth/Register';
import {AuthContext} from '@/context/AuthContext';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'; // Thêm import
import styles from './styles';

interface IFormValues {
  phone_number: string;
  name: string;
  email: string;
  password: string;
  address: string;
  otp: any;
}

const InfoScreen = () => {
  const route = useRoute();
  const {phone, otp} = route.params as {phone: string; otp: string[]};
  const otpString = otp.join('');
  const {signIn} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<IFormValues>({
    mode: 'onChange',
    defaultValues: {
      phone_number: phone,
      name: '',
      email: '',
      password: '',
      address: '',
      otp: otpString,
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
      const response = await register(
        data.phone_number,
        data.otp,
        data.name,
        data.email,
        data.password,
        data.address,
      );
      signIn(response.data?.access_token);
    } catch (err: any) {
      const message =
        err.response?.data?.msg ||
        err.message ||
        'Đăng ký thất bại. Vui lòng thử lại.';
      setError(message);
      Alert.alert('Lỗi', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{flex: 1, backgroundColor: 'white'}}
      contentContainerStyle={{flexGrow: 1}}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'ios' ? 50 : 50} // Đẩy lên thêm 100px khi bàn phím xuất hiện
      keyboardShouldPersistTaps="handled">
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Enter your information</Text>
          </View>

          {/* Form */}
          <FormProvider {...methods}>
            <View style={styles.formContainer}>
              <TextInPut
                name="phone_number"
                placeholder="Phone Number"
                type="phone"
              />
              <TextInPut name="name" placeholder="Full Name" type="name" />
              <TextInPut
                name="email"
                placeholder="Email Address"
                type="email"
              />
              <TextInPut
                name="password"
                placeholder="Password"
                type="password"
                secureTextEntry
              />
              <TextInPut name="address" placeholder="Address" type="address" />
            </View>
          </FormProvider>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, !isValid && styles.buttonDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAwareScrollView>
  );
};

export default InfoScreen;
