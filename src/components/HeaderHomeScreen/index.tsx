import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
} from 'react-native';

interface IHeaderHomeScreenProps {
  navigation?: any;
  route?: any;
  title?: string;
  subTitle?: string;
}

const HeaderHomeScreen: React.FC<IHeaderHomeScreenProps> = ({
  navigation,
  route,
  title = 'HeaderHomeScreen',
  subTitle,
}) => {
  const {t} = useTranslation();
  return (
    <SafeAreaView style={styles.containerHeader}>
      <View
        style={{
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {/* User Info */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* Nút mở Drawer */}
          <TouchableOpacity
            style={[styles.containerNotification2]}
            onPress={() => navigation.getParent()?.openDrawer()}>
            <Image
              source={require('../../assets/image/menu.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          {/* <View style={styles.containerHeaderAvatar}></View> */}

          {/* <View style={{paddingHorizontal: 10}}>
            <Text style={{fontWeight: 'bold', fontSize: 20}}>
              {t('HEADERHOMESCREEN.WELCOME')}
            </Text>
          </View> */}
        </View>

        <TouchableOpacity
          style={styles.containerNotification}
          onPress={() => navigation.navigate('PickUpScreen')}>
          <Image
            source={require('../../assets/image/map.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default HeaderHomeScreen;

const styles = StyleSheet.create({
  containerHeader: {},
  containerHeaderAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F5F5F5',
  },
  containerNotification: {
    // width: 50,
    // height: 50,
    // borderRadius: 10,
    // backgroundColor: '#F5F5F5',
    // alignItems: 'center',
    // justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: '#ccc',
    // shadowColor: '#000',
    // shadowOffset: {width: 5, height: 5},
    // shadowOpacity: 0.25,
    // shadowRadius: 2,
    // elevation: 4,
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerNotification2: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 25,
    height: 25,
  },
});
