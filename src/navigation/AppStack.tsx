import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';

// SCREENS
import {
  DetailTabScreen,
  HomeScreen,
  OrderBookingScreen,
  SettingScreen,
} from '@/screens';
import PickUpScreen from '@/screens/PickUpScreen/PickUpScreen';
import CustomHeader from '@/components/Header';
import DestinationScreen from '@/screens/DestinationScreen/DestinationScreen';
import ResultScreen from '@/screens/ResultScreen/ResultScreen';
import PartnerTopTab from './TopTabNavigation/PartnerTopTab';
import {useTranslation} from 'react-i18next';
import CustomTabBar from './tabBarNavigation/CustomTabBar';

import CustomNetInfo from '@/components/CustomNetInfo';
import DetailMyBooking from '@/screens/DetailMyBooking/DetailMyBooking';
import ProfileScreen from '@/screens/ProfileScreen';
import {Image, TouchableOpacity} from 'react-native';
import CustomDrawer from '@/components/CustomDrawer';
import {useNavigation} from '@react-navigation/native';
import EditScreen from '@/screens/EditScreen';

export type RootStackParamList = {
  Main: undefined;
  HomeScreen: undefined;
  SettingScreen: undefined;
  PickUpScreen: undefined;
  DestinationScreen: {otherParam: {selectedCity: string | null}};
  ResultScreen: undefined;
  PartnerTopTab: undefined;
  DetailTabScreen: undefined;
  OrderBookingScreen: any;
  DrawerNavigator: undefined;
  DetailMyBooking: undefined;
  ProfileScreen: undefined;
  EditScreen: undefined;
  // Thêm các màn hình khác nếu cần
};

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const Stack = createStackNavigator<RootStackParamList>();

// Vẫn giữ nguyên TabNavigator
const TabNavigator = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  return (
    <Tab.Navigator
      initialRouteName="HomeScreen"
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          tabBarLabel: 'Settings',
          headerShown: true,
          header: () => (
            <CustomHeader
              title={t('APP_STACK.SETTING_TITLE')}
              isShowLeftIcon={true}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          headerShown: true,
          header: () => (
            <CustomHeader
              title={t('APP_STACK.PROFILE_TITLE')}
              isShowLeftIcon={true}
              isShowRightIcon={true}
              rightIconSource={require('@icons/edit.png')}
              onRightIconPress={() => {
                // Xử lý khi bấm icon bên phải
                navigation.navigate('EditScreen');
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// DrawerNavigator
const DrawerNavigator = () => {
  const {t} = useTranslation();
  const navigation = useNavigation<any>();
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false, // Ẩn header mặc định
        // drawerType: 'front', // Kiểu drawer
        // overlayColor: 'rgba(0,0,0,0.3)', // Màu overlay
      }}>
      {/* Đây là route "Main" duy nhất thuộc Drawer */}
      <Drawer.Screen
        name={t('MAIN.MAIN')}
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={t('SETTING_SCREEN.SETTING_SCREEN')}
        component={SettingScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              title={t('APP_STACK.SETTING_TITLE')}
              isShowLeftIcon={true}
            />
          ),
        }}
      />
      <Drawer.Screen
        name={t('PROFILE_SCREEN.PROFILE_SCREEN')}
        component={ProfileScreen}
        options={{
          headerShown: true,
          header: () => (
            <CustomHeader
              title={t('APP_STACK.PROFILE_TITLE')}
              isShowLeftIcon={true}
              isShowRightIcon={true}
              rightIconSource={require('@icons/edit.png')}
              onRightIconPress={() => {
                // Xử lý khi bấm icon bên phải
                navigation.navigate('EditScreen');
              }}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

const AppStackNavigator = () => {
  const {t} = useTranslation();
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}>
        <Stack.Screen
          name="DrawerNavigator"
          component={DrawerNavigator}
          options={{
            headerShown: false,
          }}
        />

        {/* 
        Đổi tên route 'Main' này thành 'MainStack' hoặc comment hẳn nó nếu không cần
        Mục đích: tránh trùng tên với Drawer 'Main' 
      */}
        <Stack.Screen
          name="MainStack" // ĐÃ ĐỔI TÊN
          component={TabNavigator}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="PartnerTopTab"
          component={PartnerTopTab}
          options={{
            headerTitle: 'Partner Tabs',
          }}
        />
        <Stack.Screen
          name="PickUpScreen"
          component={PickUpScreen}
          options={{
            header: () => (
              <CustomHeader
                title={t('APP_STACK.PICKUP_TITLE')}
                isShowLeftIcon={true}
              />
            ),
          }}
        />
        <Stack.Screen
          name="DestinationScreen"
          component={DestinationScreen}
          options={{
            header: () => (
              <CustomHeader
                title={t('APP_STACK.DESTINATION_TITLE')}
                isShowLeftIcon={true}
              />
            ),
          }}
        />
        <Stack.Screen
          name="ResultScreen"
          component={ResultScreen}
          options={{
            header: () => (
              <CustomHeader
                title={t('APP_STACK.RESULT_SCREEN_TITLE')}
                isShowLeftIcon={false}
              />
            ),
          }}
        />
        <Stack.Screen
          name="DetailTabScreen"
          component={DetailTabScreen}
          options={{
            header: () => (
              <CustomHeader
                title={t('APP_STACK.DETAIL_SCREEN_TITLE')}
                isShowLeftIcon={true}
              />
            ),
          }}
        />
        <Stack.Screen
          name="DetailMyBooking"
          component={DetailMyBooking}
          options={{
            header: () => (
              <CustomHeader
                title={t('APP_STACK.DETAIL_SCREEN_TITLE')}
                isShowLeftIcon={true}
              />
            ),
          }}
        />
        <Stack.Screen
          name="OrderBookingScreen"
          component={OrderBookingScreen}
          options={{
            header: () => (
              <CustomHeader
                title={t('APP_STACK.DETAIL_SCREEN_TITLE')}
                isShowLeftIcon={true}
              />
            ),
          }}
        />

        <Stack.Screen
          name="EditScreen"
          component={EditScreen}
          options={{
            header: () => (
              <CustomHeader
                title={t('APP_STACK.EDIT_TITLE')}
                isShowLeftIcon={true}
              />
            ),
          }}
        />
      </Stack.Navigator>
      {/* <CustomNetInfo /> */}
    </>
  );
};

export default AppStackNavigator;
