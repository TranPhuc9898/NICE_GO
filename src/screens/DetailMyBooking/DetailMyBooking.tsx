import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {formatDuration, handleChangePrice} from '@/constants';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '@/hooks/UseAppSelector/useAppSelector';
import Toast from 'react-native-toast-message';
import useOrderAcceptApi from '@/api/OderAccept';
import {CustomeLoading} from '@/components';

const DetailMyBooking = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const {item} = route.params;
  const {t} = useTranslation();
  console.log('🚀 ~ DetailTabScreen ~ item:', item);

  // Cắt chuỗi start_at nếu có 2 phần, chỉ lấy phần đầu để tránh "Invalid date"
  const startAtArr = item.start_at ? item.start_at.split(' ') : [];
  const startAtString = startAtArr[0] || '2025-02-07T07:47:04.544Z';
  const dateFormatted = moment(startAtString).format('DD-MM-YYYY');

  const distanceKM = item.distance ? Math.round(item.distance / 1000) : 0;

  const {refetch: acceptOrder, isLoading: acceptLoading} = useOrderAcceptApi(
    item.id,
    false,
  );

  const onDelete = () => {
    navigation.navigate('DrawerNavigator', {
      screen: 'Main',
    });

    Toast.show({
      type: 'error',
      text1: t('TOAST.ERROR'),
    });
  };

  const onConfirm = async () => {
    try {
      // Gọi API OrderAccept truyền id (item.id)
      await acceptOrder();
      navigation.navigate('DrawerNavigator', {
        screen: 'Main',
      });
      Toast.show({
        type: 'success',
        text1: t('TOAST.SUCCESS') + ' 🎉',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('TOAST.ERROR'),
      });
    }
  };

  const useType = useAppSelector(state => state.user.role_index);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        {t('DETAIL_TAB_SCREEN.DESCRIPTION_TITLE')}
      </Text>

      <View style={styles.infoContainer}>
        <View style={styles.tripRow}>
          <View style={{}}>
            <Text style={styles.tripLabel}>
              {t('DETAIL_TAB_SCREEN.TRIP_LABEL')}
              <Text style={[styles.tripValue, {fontSize: 12}]}>
                {' '}
                {item.origin} → {item.destination}
              </Text>
            </Text>
          </View>
          {/* 
          <View style={styles.timeContainer}>
            <Text style={styles.grayText}>
              Thời gian đến: <Text style={styles.blackBold}>3 giờ</Text>
            </Text>
          </View> */}
        </View>

        <View style={[styles.tripRow, {marginTop: 5}]}>
          <Text style={styles.grayText}>
            {t('DETAIL_TAB_SCREEN.DISTANCE_LABEL')}{' '}
            <Text style={styles.blackBold}>{distanceKM} KM</Text>
          </Text>

          {/* <Text style={styles.grayText}>
            {t('DETAIL_TAB_SCREEN.ARRIVAL_TIME')}{' '}
            <Text style={styles.blackBold}>
              18 {t('DETAIL_TAB_SCREEN.HOUR')}
            </Text>
          </Text> */}
        </View>
        <View style={[styles.tripRow, {marginTop: 5}]}>
          <Text style={styles.grayText}>
            {t('DETAIL_TAB_SCREEN.PICKUP_TIME_LABEL')}{' '}
            <Text style={styles.blackBold}>
              {item?.duration + ' ' + t('DETAIL_TAB_SCREEN.HOUR')}
            </Text>
          </Text>
          <Text style={styles.grayText}>{dateFormatted}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.driverRow}>
          <View style={styles.avatarBox}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 5,
              }}>
              <Image
                source={require('../../assets/image/driving.png')}
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            </View>
          </View>

          <View style={{flex: 1, marginLeft: 10}}>
            <Text style={{fontWeight: '500', marginBottom: 4}}>
              {t('DETAIL_TAB_SCREEN.USER_LABEL')}{' '}
              <Text style={{fontWeight: 'bold'}}>{item?.owner_info?.name}</Text>
            </Text>

            <Text style={{fontWeight: '500', marginBottom: 4}}>
              {t('DETAIL_TAB_SCREEN.PHONE')}{' '}
              <Text style={{fontWeight: 'bold'}}>
                {item?.owner_info?.phone}
              </Text>
            </Text>
          </View>

          <View style={{alignItems: 'flex-end'}}>
            <Text style={{fontSize: 12}}>
              <Text style={styles.star}>★</Text> 5.0
            </Text>
            <Text style={[styles.blackBold, {marginTop: 2}]}>
              {handleChangePrice(item?.price)} {'K'}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />
      </View>
    </View>
  );
};

export default DetailMyBooking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  infoContainer: {
    backgroundColor: '#fefefe',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  tripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tripLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  tripValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
  },
  timeContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  grayText: {
    fontSize: 12,
    color: '#666',
  },
  blackBold: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarBox: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
  driverSub: {
    fontSize: 12,
    color: '#444',
    marginBottom: 2,
  },
  star: {
    color: '#f9c400',
    fontSize: 16,
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmBtn: {
    backgroundColor: '#346efb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#1A1F2C',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  deleteText: {
    color: '#fff',
    fontWeight: '600',
  },
});
