import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import {handleChangePrice} from '@/constants';
import {useTranslation} from 'react-i18next';
import {useAppSelector} from '@/hooks/UseAppSelector/useAppSelector';
import Toast from 'react-native-toast-message';

// Gọi API trực tiếp qua callApi (axios/fetch wrapper tuỳ bạn)
import callApi from '@/constants/callApi';

import {CustomeLoading} from '@/components';

const DetailTabScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const {item} = route.params;
  const {t} = useTranslation();

  // Tách ngày ra để format
  const startAtArr = item.start_at ? item.start_at.split(' ') : [];
  const startAtString = startAtArr[0] || '2025-02-07T07:47:04.544Z';
  const dateFormatted = moment(startAtString).format('DD-MM-YYYY');

  // Đổi khoảng cách từ m sang km
  const distanceKM = item.distance ? Math.round(item.distance / 1000) : 0;

  // Trạng thái loading khi gọi API accept
  const [acceptLoading, setAcceptLoading] = useState(false);

  // Xoá hoặc huỷ => điều hướng và show toast error (tuỳ logic bạn)
  const onDelete = () => {
    navigation.navigate('DrawerNavigator', {
      screen: 'Main',
    });
    Toast.show({
      type: 'error',
      text1: t('TOAST.ERROR'),
    });
  };

  // Gọi API trực tiếp tại đây khi nhấn Confirm
  const onConfirm = async () => {
    try {
      setAcceptLoading(true);

      // Gọi endpoint PUT /order/accept/:id
      const response = await callApi.put(`/order/accept/${item.id}`, {});

      // Kiểm tra status
      if (response.status === 200) {
        // Hiển thị loading thêm 2 giây (fake delay) rồi mới tắt
        setTimeout(() => {
          setAcceptLoading(false);
          Toast.show({
            type: 'success',
            text1: t('TOAST.SUCCESS') + ' 🎉',
          });
          // Điều hướng sau khi loading
          navigation.navigate('DrawerNavigator', {
            screen: 'Main',
          });
        }, 2500);
      } else {
        // Thất bại => tắt loading và hiển thị Alert
        setAcceptLoading(false);
        Alert.alert(
          'Notification',
          response.data?.msg || 'Something went wrong',
        );
      }
    } catch (error: any) {
      // Bắt lỗi (mạng, server, v.v.)
      setAcceptLoading(false);

      // Lấy msg từ error?.response?.data?.data?.msg nếu có
      Alert.alert(
        'Notification',
        error?.response?.data?.data?.msg || 'Something went wrong',
      );
    }
  };

  // Chỉ để ví dụ, nếu bạn cần
  const useType = useAppSelector(state => state.user.role_index);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>
        {t('DETAIL_TAB_SCREEN.DESCRIPTION_TITLE')}
      </Text>

      <View style={styles.infoContainer}>
        {/* Thông tin chuyến */}
        <View style={styles.tripRow}>
          <Text style={styles.tripLabel}>
            {t('DETAIL_TAB_SCREEN.TRIP_LABEL')}
            <Text style={[styles.tripValue, {fontSize: 12}]}>
              {' '}
              {item.origin} → {item.destination}
            </Text>
          </Text>
        </View>

        <View style={[styles.tripRow, {marginTop: 5}]}>
          <Text style={styles.grayText}>
            {t('DETAIL_TAB_SCREEN.DISTANCE_LABEL')}{' '}
            <Text style={styles.blackBold}>{distanceKM} KM</Text>
          </Text>
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

        {/* Thông tin người đặt hoặc tài xế */}
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
                style={{width: 50, height: 50}}
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
              {handleChangePrice(item?.price)} K
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        {/* Nút thao tác */}
        <View style={styles.btnRow}>
          <TouchableOpacity
            style={styles.confirmBtn}
            onPress={onConfirm}
            disabled={acceptLoading}>
            <Text style={styles.confirmText}>
              {t('DETAIL_TAB_SCREEN.CONFIRM_BUTTON')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
            <Text style={styles.deleteText}>
              {t('DETAIL_TAB_SCREEN.DELETE_BUTTON')}
            </Text>
          </TouchableOpacity>

          {/* Loading overlay */}
          <CustomeLoading visible={acceptLoading} />
        </View>
      </View>
    </View>
  );
};

export default DetailTabScreen;

// ====================== STYLES ======================
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
