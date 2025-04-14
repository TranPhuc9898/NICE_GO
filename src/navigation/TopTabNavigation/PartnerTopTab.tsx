import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useTranslation} from 'react-i18next';
import {TabCancleScreen, TabConfirmScreen, TabWattingScreen} from '@/screens';

const TopTab = createMaterialTopTabNavigator<any>();

const PartnerTopTab = ({}) => {
  const {t} = useTranslation();

  return (
    <TopTab.Navigator
      id={undefined}
      screenOptions={{
        swipeEnabled: false,
        lazy: true,
        tabBarAllowFontScaling: false,
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#1154FF',
        tabBarIndicatorStyle: {
          backgroundColor: '#1154FF',
          height: 50,
          borderRadius: 15,
          borderWidth: 0.1,
          borderColor: '#ffffff',
          // Thay vì marginBottom, dùng top để đẩy xuống
          top: 12,
        },
        tabBarStyle: {
          marginTop: 10,
          // Hoặc thêm paddingBottom nếu cần thêm không gian dưới indicator
          paddingBottom: 5,
        },
        // Chỉnh itemStyle để tab tự căn giữa
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        // Chỉnh labelStyle để text bên trong tự căn giữa
        tabBarLabelStyle: {
          textAlign: 'center',
          fontSize: 12,
          fontWeight: 'bold',
        },
        tabBarContentContainerStyle: {
          marginTop: 10,
          paddingLeft: 5,
          paddingRight: 5,
        },
      }}
      initialRouteName="TabConfirm">
      <TopTab.Screen
        name="TabConfirm"
        component={TabConfirmScreen}
        options={{
          title: t('PARTNER_TOP_TAB.TAB_CONFIRM'),
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          },
        }}
        // initialParams={{dataOrder, isLoadingOrder, isErrorOrder}}
      />
      <TopTab.Screen
        name="TabWatting"
        component={TabWattingScreen}
        options={{
          title: t('PARTNER_TOP_TAB.TAB_WAITING'),
          tabBarLabelStyle: {fontSize: 12, fontWeight: 'bold'},
        }}
      />
      <TopTab.Screen
        name="TabCancle"
        component={TabCancleScreen}
        options={{
          title: t('PARTNER_TOP_TAB.TAB_CANCELLED'),
          tabBarLabelStyle: {fontSize: 12, fontWeight: 'bold'},
        }}
      />
    </TopTab.Navigator>
  );
};

export default PartnerTopTab;
