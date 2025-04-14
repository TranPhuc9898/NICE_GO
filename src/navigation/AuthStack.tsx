/*
Chứa các màn hình liên quan đến xác thực như Login
**/
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
// SCREENS
import {ForgotPasswordScreen, LoginScreen, RegisterScreen} from '@/screens';
import OnBoardingScreen from '@/screens/OnBoardScreen/OnBoardScreen';
import CustomHeader from '@/components/Header';
import OTPScreen from '@/screens/OTPScreen/OTPScreen';
import InfoScreen from '@/screens/InfoScreen/InfoScreen';

const Stack = createStackNavigator();

const AuthStackNavigator = ({initialRouteName}: {initialRouteName: any}) => (
  <Stack.Navigator
    initialRouteName={initialRouteName}
    screenOptions={{
      headerShown: false,
      gestureEnabled: false, // Chặn gesture back trên iOS
    }}>
    <Stack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false, gestureEnabled: false}}
    />
    <Stack.Screen
      name="OnBoarding"
      component={OnBoardingScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
      options={{
        headerShown: true,
        header: () => <CustomHeader title="" isShowLeftIcon={true} />,
      }}
    />
    <Stack.Screen
      name="ForgotPasswordScreen"
      component={ForgotPasswordScreen}
      options={{
        headerShown: true,
        header: () => <CustomHeader title="" isShowLeftIcon={true} />,
      }}
    />
    <Stack.Screen
      name="OTPScreen"
      component={OTPScreen}
      options={{
        headerShown: true,
        header: () => <CustomHeader title="" isShowLeftIcon={true} />,
      }}
    />
    <Stack.Screen
      name="InfoScreen"
      component={InfoScreen}
      options={{
        headerShown: true,
        header: () => <CustomHeader title="" isShowLeftIcon={true} />,
      }}
    />
  </Stack.Navigator>
);

export default AuthStackNavigator;
