import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

// ==== THÊM: import useTranslation ====
import {useTranslation} from 'react-i18next';

const ResultScreen = ({route}: {route: any}) => {
  // Mày lấy dữ liệu orderData từ params
  const orderData = route.params?.orderData;
  const info = orderData?.data?.info; // Chọc tới "info" con cặc

  const navigation = useNavigation<any>();

  // ==== Lấy hàm t() để dịch text ====
  const {t} = useTranslation();

  return (
    <View style={styles.container}>
      {/* Card hiển thị thông tin */}
      <View style={styles.card}>
        {/* "Thông Tin Chuyến Đi" */}
        <Text style={styles.title}>{t('RESULT_SCREEN.TRIP_INFORMATION')}</Text>

        <View style={styles.infoRow}>
          {/* "Địa điểm đi:" */}
          <Text style={styles.label}>{t('RESULT_SCREEN.ORIGIN_LOCATION')}</Text>
          <Text style={styles.value}>
            {/* "Unknown" => t('RESULT_SCREEN.UNKNOWN') */}
            {info?.origin || t('RESULT_SCREEN.UNKNOWN')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          {/* "Địa điểm đến:" */}
          <Text style={styles.label}>
            {t('RESULT_SCREEN.DESTINATION_LOCATION')}
          </Text>
          <Text style={styles.value}>
            {info?.destination || t('RESULT_SCREEN.UNKNOWN')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          {/* "Khoảng cách:" */}
          <Text style={styles.label}>{t('RESULT_SCREEN.DISTANCE')}</Text>
          <Text style={styles.value}>
            {info?.distance || t('RESULT_SCREEN.DASH')} {t('RESULT_SCREEN.KM')}
          </Text>
        </View>

        <View style={styles.infoRow}>
          {/* "Giá tiền:" */}
          <Text style={styles.label}>{t('RESULT_SCREEN.PRICE')}</Text>
          <Text style={[styles.value, {color: '#f44336'}]}>
            {info?.price?.toLocaleString()} {t('RESULT_SCREEN.CURRENCY')}
          </Text>
        </View>
      </View>

      {/* Nút "Xác Nhận" */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.navigate('Main');
        }}>
        <Text style={styles.buttonText}>{t('RESULT_SCREEN.CONFIRM')}</Text>
      </TouchableOpacity>

      {/* "Cảm ơn đã sử dụng dịch vụ!" */}
      <Text style={styles.footerText}>{t('RESULT_SCREEN.THANKS')}</Text>
    </View>
  );
};

export default ResultScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1154FF',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#666',
    fontSize: 15,
    flex: 1,
  },
  value: {
    fontSize: 15,
    flex: 1,
    textAlign: 'right',
    color: '#000',
  },
  button: {
    backgroundColor: '#1154FF',
    height: 50,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  footerText: {
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 12,
    color: '#999',
  },
});
