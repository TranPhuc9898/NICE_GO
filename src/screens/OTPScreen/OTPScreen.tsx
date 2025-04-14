// import React, {useState, useRef} from 'react';
// import {
//   SafeAreaView,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Keyboard,
//   Platform,
// } from 'react-native';
// import {
//   KeyboardAvoidingView,
//   ScrollView,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import {useNavigation, useRoute} from '@react-navigation/native';
// import {Dimensions} from 'react-native';
// import useVerifyPhoneApi from '@/api/Auth/VerifyOTP';

// const {width: screenWidth} = Dimensions.get('window');

// const OTPScreen = () => {
//   const navigation = useNavigation<any>();
//   const route = useRoute();
//   const {phone} = route.params as {phone: string};
//   const [otp, setOtp] = useState<any>(['', '', '', '']);
//   const inputs = useRef<Array<TextInput | null>>([]);

//   // Sử dụng useVerifyPhoneApi với enabled: false (không tự động gọi API)
//   const {
//     data: verifyData,
//     isLoading,
//     refetch,
//   } = useVerifyPhoneApi({phone, code: otp.join('')}, false);

//   const handleChangeText = (value: string, index: number) => {
//     if (isNaN(Number(value))) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (value !== '' && index < 3) {
//       inputs.current[index + 1]?.focus();
//     }
//     if (value === '' && index > 0) {
//       inputs.current[index - 1]?.focus();
//     }
//   };

//   const handleSubmit = async () => {
//     if (otp.join('').length !== 4) {
//       Alert.alert('Please fill in all 4 digits');
//       return;
//     }

//     try {
//       const result = await refetch();
//       console.log('🚀 ~ handleSubmit ~ result:', result);
//       // result.data = { msg: "Invalid code" } hoặc { msg: "Phone verified successfully" }

//       if (result?.status === 'success') {
//         navigation.navigate('InfoScreen', {phone, otp});
//       } else {
//         Alert.alert('Verification failed', result?.error?.message);
//         // navigation.navigate('InfoScreen', {phone, otp});
//       }
//     } catch (err: any) {
//       // Nếu server trả về lỗi 4xx/5xx => axios throw => React Query throw => vào đây
//       Alert.alert('Verification error', err.message);
//     }
//   };

//   const handleResendCode = () => {
//     // Xử lý gửi lại mã OTP nếu cần
//   };

//   const otpInputWidth = Math.min((screenWidth - 80) / 4, 60);

//   return (
//     <KeyboardAvoidingView
//       style={{flex: 1, backgroundColor: '#fff'}}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//       keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
//       <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
//         <SafeAreaView style={styles.safeArea}>
//           <ScrollView
//             contentContainerStyle={styles.scrollContainer}
//             keyboardShouldPersistTaps="handled">
//             {/* Title */}
//             <View style={styles.welcomeContainer}>
//               <Text style={styles.welcomeText}>Verify phone number</Text>
//               <Text style={styles.subText}>
//                 Check your SMS messages. We’ve sent you the PIN at{' '}
//                 <Text style={styles.phoneText}>{phone}</Text>
//               </Text>
//             </View>

//             {/* OTP Input Fields */}
//             <View style={[styles.otpContainer, {width: screenWidth - 40}]}>
//               {otp.map((_, index) => (
//                 <TextInput
//                   key={index}
//                   style={[
//                     styles.otpInput,
//                     {width: otpInputWidth, height: otpInputWidth},
//                   ]}
//                   keyboardType="numeric"
//                   maxLength={1}
//                   value={otp[index]}
//                   onChangeText={value => handleChangeText(value, index)}
//                   ref={ref => (inputs.current[index] = ref)}
//                 />
//               ))}
//             </View>

//             {/* Verify Button */}
//             <TouchableOpacity
//               style={styles.submitButton}
//               onPress={handleSubmit}
//               disabled={isLoading}>
//               <Text style={styles.submitText}>
//                 {isLoading ? 'Verifying...' : 'Verify'}
//               </Text>
//             </TouchableOpacity>

//             {/* Resend Code */}
//             <TouchableOpacity
//               style={styles.resendContainer}
//               onPress={handleResendCode}>
//               <Text style={styles.resendText}>
//                 Didn’t receive SMS?{' '}
//                 <Text style={styles.resendLink}>Resend Code</Text>
//               </Text>
//             </TouchableOpacity>
//           </ScrollView>
//         </SafeAreaView>
//       </TouchableWithoutFeedback>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     backgroundColor: '#fff',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },
//   welcomeContainer: {
//     marginBottom: 30,
//     alignItems: 'center',
//   },
//   welcomeText: {
//     fontSize: 24,
//     fontWeight: '500',
//     color: '#333',
//   },
//   subText: {
//     fontSize: 14,
//     color: '#848484',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   phoneText: {
//     color: '#1154FF',
//     fontWeight: '500',
//   },
//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignSelf: 'center',
//     marginBottom: 40,
//   },
//   otpInput: {
//     backgroundColor: '#FFF',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#CCC',
//     textAlign: 'center',
//     fontSize: 18,
//     color: '#333',
//     elevation: 2,
//   },
//   submitButton: {
//     backgroundColor: '#1154FF',
//     borderRadius: 10,
//     paddingVertical: 15,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   submitText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   resendContainer: {
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   resendText: {
//     fontSize: 14,
//     color: '#848484',
//   },
//   resendLink: {
//     color: '#1154FF',
//     fontWeight: '500',
//   },
// });

// export default OTPScreen;
import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  Platform,
} from 'react-native';
import {
  KeyboardAvoidingView,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Dimensions} from 'react-native';
import useVerifyPhoneApi from '@/api/Auth/VerifyOTP';
import {OTPApi} from '@/api/Auth/OTP';

const {width: screenWidth} = Dimensions.get('window');

const OTPScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const {phone} = route.params as {phone: string};
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  // Sử dụng useVerifyPhoneApi với enabled: false (không tự động gọi API)
  const {
    data: verifyData,
    isLoading,
    refetch,
  } = useVerifyPhoneApi({phone, code: otp.join('')}, false);

  // Resend logic states
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(0);

  const handleResendCode = async () => {
    if (isResending || resendCountdown > 0) return;
    setIsResending(true);
    try {
      // Gọi lại API OTP để gửi OTP mới
      await OTPApi(phone);
      Alert.alert('OTP Resent', 'A new OTP has been sent to your phone.');
      // Bắt đầu đếm ngược 30s
      setResendCountdown(30);
    } catch (error: any) {
      Alert.alert('Resend failed', error.message);
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [resendCountdown]);

  const handleChangeText = (value: string, index: number) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value !== '' && index < 3) {
      inputs.current[index + 1]?.focus();
    }
    if (value === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    if (otp.join('').length !== 4) {
      Alert.alert('Please fill in all 4 digits');
      return;
    }
    try {
      const result = await refetch();
      console.log('🚀 ~ handleSubmit ~ result:', result);
      if (result?.status === 'success') {
        navigation.navigate('InfoScreen', {phone, otp});
      } else {
        Alert.alert('Verification failed', result?.error?.message);
      }
    } catch (err: any) {
      Alert.alert('Verification error', err.message);
    }
  };

  const otpInputWidth = Math.min((screenWidth - 80) / 4, 60);

  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: '#fff'}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled">
            {/* Title */}
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Verify phone number</Text>
              <Text style={styles.subText}>
                Check your SMS messages. We’ve sent you the PIN at{' '}
                <Text style={styles.phoneText}>{phone}</Text>
              </Text>
            </View>

            {/* OTP Input Fields */}
            <View style={[styles.otpContainer, {width: screenWidth - 40}]}>
              {otp.map((_, index) => (
                <TextInput
                  key={index}
                  style={[
                    styles.otpInput,
                    {width: otpInputWidth, height: otpInputWidth},
                  ]}
                  // Sử dụng keyboardType="number-pad" cho bàn phím số
                  keyboardType="number-pad"
                  maxLength={1}
                  value={otp[index]}
                  onChangeText={value => handleChangeText(value, index)}
                  ref={ref => (inputs.current[index] = ref)}
                />
              ))}
            </View>

            {/* Verify Button */}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={isLoading}>
              <Text style={styles.submitText}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </Text>
            </TouchableOpacity>

            {/* Resend Code: Chỉ chữ "Resend Code" là có thể bấm */}
            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive SMS? </Text>
              <TouchableOpacity
                onPress={handleResendCode}
                disabled={isResending || resendCountdown > 0}>
                <Text
                  style={[
                    styles.resendLink,
                    (isResending || resendCountdown > 0) && {opacity: 0.5},
                  ]}>
                  {resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    marginBottom: 30,
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
    marginTop: 10,
  },
  phoneText: {
    color: '#1154FF',
    fontWeight: '500',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginBottom: 40,
  },
  otpInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCC',
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    elevation: 2,
  },
  submitButton: {
    backgroundColor: '#1154FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    justifyContent: 'center',
  },
  resendText: {
    fontSize: 14,
    color: '#848484',
  },
  resendLink: {
    fontSize: 14,
    color: '#1154FF',
    fontWeight: '500',
  },
});

export default OTPScreen;
