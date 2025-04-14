import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthStackNavigator from './AuthStack';
import AppStackNavigator from './AppStack';
import {AuthContext} from '@/context/AuthContext';
import {SplashScreen} from '@/screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OnBoardingScreen from '@/screens/OnBoardScreen/OnBoardScreen';

const RootNavigator = () => {
  const {isAuthenticated} = useContext(AuthContext);

  // 1. Quản lý 2 state: loading SplashScreen, & đã xem OnBoarding
  const [isLoading, setIsLoading] = useState(true);
  const [hasViewedOnBoarding, setHasViewedOnBoarding] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('Bắt đầu khởi tạo ứng dụng...');

      // Đọc flag OnBoarding từ AsyncStorage
      const storedOnBoardingFlag = await AsyncStorage.getItem(
        'hasViewedOnBoarding',
      );
      if (storedOnBoardingFlag === 'true') {
        setHasViewedOnBoarding(true);
      }

      // Hiển thị SplashScreen 5s
      setTimeout(() => {
        console.log('Khởi tạo hoàn tất!');
        setIsLoading(false);
      }, 5000);
    };

    initializeApp();
  }, []);

  // 2. Nếu còn loading => SplashScreen
  if (isLoading) {
    return <SplashScreen onFinish={() => setIsLoading(false)} />;
  }

  // 4. Đã xem OnBoarding rồi => kiểm tra isAuthenticated
  return isAuthenticated ? (
    <AppStackNavigator />
  ) : (
    <AuthStackNavigator
      initialRouteName={hasViewedOnBoarding ? 'Login' : 'OnBoarding'}
    />
  );
};

export default RootNavigator;
