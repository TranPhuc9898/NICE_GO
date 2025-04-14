import React, {useRef, useEffect, useState, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Alert,
} from 'react-native';
// Lib
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';
import _ from 'lodash';
// Components
import {
  BottomSheetComponent,
  CustomeLoading,
  CustomSuccessModal,
} from '@/components';
import CustomeMapTracking from '@/components/CustomeMapTracking';
import {useNavigation} from '@react-navigation/native';
import {useBottomSheet} from '@/hooks/UseBottomSheet/useBottomSheet';

import ControlDropDownItem from '@/components/ControlDropDownItem';
import ControlDateTimePicker from '@/components/CustomeDateTimePicker/abc';
// API
import {getOrderInfo} from '@/api/OrdetGetInfo';
// Styles
import styles from './styles';
// Redux
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import useOrderAddApi from '@/api/OrderAdd';

import PolylineUtil from '@mapbox/polyline';
import callApi from '@/constants/callApi';
// import CustomeAlert from '@/components/CustomeAlert';

interface OrderBookingScreenProps {
  route: {
    params: {
      originPlaceId: string;
      destinationPlaceId: string;
      originDescription: string;
      destinationDescription: string;
    };
  };
}

interface Coord {
  latitude: number;
  longitude: number;
}

// const GOOGLE_API_KEY = 'AIzaSyBuWCKTF0r_1OsbewMo9YCUjRbhlMjEVv0';
const GOOGLE_API_KEY = 'AlzaSyxpi_q2Jka3N-jzjMdzcMod02y1gJ5ksJr';

const OrderBookingScreen: React.FC<OrderBookingScreenProps> = ({route}) => {
  const {t} = useTranslation();
  const {
    originPlaceId,
    destinationPlaceId,
    originDescription,
    destinationDescription,
  } = route.params;

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const innerSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation<any>();

  const [isBusy, setIsBusy] = useState(false);
  const [hasShownAlert, setHasShownAlert] = useState(false);

  // State cho khoảng cách: text hiển thị UI & value dùng cho API call
  const [distanceText, setDistanceText] = useState('');
  const [distanceValue, setDistanceValue] = useState<number>(0);
  const [duration, setDuration] = useState<any>({});
  console.log('🚀 ~ duration:', duration);
  const [price, setPrice] = useState('');

  // Các state lựa chọn cho car, trip, booking, ... (đã được cập nhật theo yêu cầu)
  const [selectedCarType, setSelectedCarType] = useState<string | null>(null);
  const [selectedTripType, setSelectedTripType] = useState<string | null>(null);
  const [selectedCarTypeId, setSelectedCarTypeId] = useState<number | null>(
    null,
  );
  const [selectedTripTypeId, setSelectedTripTypeId] = useState<number | null>(
    null,
  );
  const [carTypeError, setCarTypeError] = useState<boolean>(false);
  const [tripTypeError, setTripTypeError] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<any>(true);

  // Date & Time states
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [selectedTime, setSelectedTime] = useState<Date | null>(new Date());
  const [dateErrorType, setDateErrorType] = useState<'NONE' | 'EMPTY' | 'PAST'>(
    'NONE',
  );

  // Booking Type states
  const [selectedBookingTypeId, setSelectedBookingTypeId] = useState<
    number | null
  >(null);
  const [bookingTypeError, setBookingTypeError] = useState<boolean>(false);

  const [originCoords, setOriginCoords] = useState<
    | {
        latitude: string;
        longitude: string;
      }
    | any
  >('');
  const [destinationCoords, setDestinationCoords] = useState<
    | {
        latitude: string;
        longitude: string;
      }
    | any
  >('');

  // Lấy dữ liệu redux
  const roleIndex = useSelector((state: RootState) => state.user.role_index);
  const reduxData = useSelector((state: any) => state.pickUp.data);
  const carTypesData = reduxData?.data?.car_type || [];
  const tripTypesData = reduxData?.data?.trip_type || [];
  const bookingTypesData = reduxData?.data?.booking_type || [];

  // Các hàm xử lý cho các ControlDropDownItem
  const handleCarTypeSelect = useCallback((carType: any) => {
    setSelectedCarType(carType.name);
    setSelectedCarTypeId(carType.id);
    setCarTypeError(false);
  }, []);

  const handleTripTypeSelect = useCallback((tripType: any) => {
    setSelectedTripType(tripType.name);
    setSelectedTripTypeId(tripType.id);
    setTripTypeError(false);
  }, []);

  // Format lại giá nhập vào
  const handleChangePrice = (text: string) => {
    const numeric = text.replace(/\D/g, '');
    if (!numeric) {
      setPrice('');
      return;
    }
    const numberVal = parseInt(numeric, 10);
    const formatted = numberVal.toLocaleString('vi-VN');
    setPrice(formatted);
  };

  // Callback xử lý ngày, giờ chọn
  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    setDateErrorType('NONE');
  }, []);

  const handleTimeSelect = useCallback((time: Date) => {
    setSelectedTime(time);
  }, []);

  const fetchDirectionsABC = async () => {
    try {
      const url = `https://maps.gomaps.pro/maps/api/directions/json?destination=${destinationDescription}&origin=${originDescription}&key=${GOOGLE_API_KEY}`;
      const response = await fetch(url);
      const json = await response.json();
      console.log('🚀 ~ fetchDirections ~ jsonABC:', json);

      if (json.routes?.length) {
        const points = json.routes[0].overview_polyline.points;
        const decoded = PolylineUtil.decode(points);
        const routeCoords = decoded.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));

        const leg = json.routes[0].legs[0];
        if (leg) {
          setOriginCoords({
            latitude: leg.start_location.lat.toString(),
            longitude: leg.start_location.lng.toString(),
          });
          setDestinationCoords({
            latitude: leg.end_location.lat.toString(),
            longitude: leg.end_location.lng.toString(),
          });
        }
      }
    } catch (error) {
      console.log('fetchDirections error:', error);
    }
  };

  useEffect(() => {
    fetchDirectionsABC();
  }, []);

  // Lấy thông tin khoảng cách,
  const fetchOrderInfo = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getOrderInfo(originPlaceId, destinationPlaceId);
      console.log('🚀 ~ fetchOrderInfo ~ response:', response);
      if (response?.data?.rows?.[0]?.elements?.[0]) {
        const element = response.data.rows[0].elements[0];
        // UI/UX hiển thị dạng text (ví dụ "104 km")
        setDistanceText(element.distance?.text || '');
        // API call sử dụng giá trị numeric (ví dụ 104469)
        setDistanceValue(element.distance?.value || 0);
        setDuration(element.duration || '');
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, [originPlaceId, destinationPlaceId]);

  useEffect(() => {
    fetchOrderInfo();
  }, [fetchOrderInfo]);

  useEffect(() => {
    bottomSheetRef.current?.present();
  }, []);

  // Build request body cho API Order Add
  // Lưu ý: Dùng distanceValue (numeric) để call API,
  // còn hiển thị cho người dùng dùng distanceText
  const orderAddRequestBody = useMemo(
    () => ({
      origin: {
        name: originDescription,
        place_id: originPlaceId,
        lat: originCoords?.latitude,
        lng: originCoords?.longitude,
      },
      destination: {
        name: destinationDescription,
        place_id: destinationPlaceId,
        lat: destinationCoords?.latitude,
        lng: destinationCoords?.longitude,
      },
      distance: distanceValue, // Sử dụng value cho API
      duration: duration.value,
      type: 'user',
      date_start: selectedDate ? selectedDate.toISOString().slice(0, 10) : '',
      time_start: selectedTime ? selectedTime.toISOString().slice(11, 19) : '',
      trip_type: selectedTripTypeId || 0,
      car_type: selectedCarTypeId || 0,
      booking_type: selectedBookingTypeId || 0,
      enable_resell: false,
      price: price ? parseInt(price.replace(/\D/g, ''), 10) : 0,
    }),
    [
      originDescription,
      originPlaceId,
      destinationDescription,
      destinationPlaceId,
      distanceValue,
      selectedDate,
      selectedTime,
      selectedTripTypeId,
      selectedCarTypeId,
      selectedBookingTypeId,
      price,
      originCoords,
      duration,
      destinationCoords, // thêm dependency để cập nhật khi có tọa độ
    ],
  );
  const [alertVisible, setAlertVisible] = useState(false);
  console.log('🚀 ~ orderAddRequestBody:', orderAddRequestBody);
  // Hook gọi API Order Add
  // const {
  //   data: orderAddData,
  //   isLoading: isOrderAddLoading,
  //   isError: isOrderAddError,
  //   refetch: submitOrder,
  // } = useOrderAddApi(orderAddRequestBody, false);
  const callOrderAddApi = async () => {
    try {
      setIsBusy(true); // Bật loading khi gọi API
      const response = await callApi.post('/order/add', orderAddRequestBody);
      setIsBusy(false); // Tắt loading ngay sau khi API thành công
      console.log('🚀 ~ callOrderAddApi ~ response:', response);
      if (response?.status === 200) {
        setTimeout(() => {
          setAlertVisible(true); // Hiển thị modal sau khi tắt loading
        }, 1000); // Delay 100ms để đảm bảo state đồng bộ
        setTimeout(() => {
          setAlertVisible(false); // Tắt modal sau 4 giây
          navigation.navigate('DrawerNavigator', {screen: 'Main'});
        }, 3000);
      }
    } catch (error: any) {
      setIsBusy(false); // Tắt loading khi có lỗi
      if (
        error.response &&
        error.response.data &&
        error.response.data.status === 'error'
      ) {
        // Alert.alert('Error', error.response.data.msg);
        Alert.alert('Error', error.response.data.msg, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(), // Quay lại màn hình trước khi nhấn OK
            style: 'default',
          },
        ]);
      } else {
        Alert.alert('Error', error.response.data.msg);
      }
    }
  };

  // Nội dung của Bottom Sheet (UI)
  const renderOuterSheetContent = () => {
    return (
      <ScrollView style={{}}>
        <View style={{flexDirection: 'column'}}>
          {/* Origin Row */}
          <View style={{flexDirection: 'row'}}>
            <View
              style={{
                width: 20,
                height: 20,
                borderRadius: 15,
                backgroundColor: '#2979FF',
                marginRight: 5,
              }}
            />
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={styles.label}>
                {t('ORDER_BOOKING_SCREEN.ORIGIN_LABEL')}
              </Text>
              <Text style={styles.value}>{originDescription}</Text>
            </View>
          </View>
          {/* Divider */}
          <View
            style={{height: 1, backgroundColor: '#ddd', marginVertical: 15}}
          />
          {/* Destination Row */}
          <View style={{flexDirection: 'row'}}>
            <Image
              source={require('../../assets/image/point.png')}
              style={{width: 25, height: 25, marginRight: 5}}
            />
            <View style={{flexDirection: 'row', flex: 1}}>
              <Text style={styles.label}>
                {t('ORDER_BOOKING_SCREEN.DESTINATION_LABEL')}
              </Text>
              <Text style={styles.value}>{destinationDescription}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.infoBox, {marginTop: 15}]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('ORDER_BOOKING_SCREEN.DISTANCE_LABEL')}
            </Text>
            {/* Hiển thị khoảng cách dạng text cho UI */}
            <Text style={styles.infoValue}>{distanceText}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>
              {t('ORDER_BOOKING_SCREEN.TIME_ESTIMATE_LABEL')}
            </Text>
            <Text style={styles.infoValue}>{duration?.text}</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>
              {t('ORDER_BOOKING_SCREEN.PRICE_LABEL')}
            </Text>
            <View
              style={[
                {
                  borderColor: price ? '#1154FF' : '#898999',
                  borderWidth: 1,
                  borderRadius: 5,
                },
              ]}>
              <TextInput
                style={[styles.textInput, {color: price ? '#1154FF' : 'black'}]}
                placeholderTextColor="#898999"
                placeholder="200.000 VND"
                value={price}
                onChangeText={handleChangePrice}
                keyboardType="numeric"
              />
            </View>
          </View>
        </View>
        {/* Date & Time Picker */}
        <View style={styles.infoBox2}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 15,
            }}>
            <ControlDateTimePicker
              label={t('ORDER_BOOKING_SCREEN.DATE_LABEL')}
              onSelect={handleDateSelect}
              mode="date"
              format="dd/MM/yyyy"
              locale="vi-VN"
              size="Medium"
              initialValue={new Date()}
            />
            <ControlDateTimePicker
              label={t('ORDER_BOOKING_SCREEN.TIME_LABEL')}
              onSelect={handleTimeSelect}
              mode="time"
              format="HH:mm"
              locale="vi-VN"
              size="Medium"
              initialValue={new Date()}
            />
          </View>
        </View>
        <View style={[styles.checkboxRow, {marginTop: 8}]}></View>
        {/* Các Control Dropdown cho trip, car, booking */}
        <View style={styles.infoBox}>
          <ControlDropDownItem
            label={t('ORDER_BOOKING_SCREEN.SELECT_TRIP_TYPE')}
            selectedValue={selectedTripType}
            data={tripTypesData}
            onSelect={handleTripTypeSelect}
            error={tripTypeError}
            errorMessage={tripTypeError ? t('ERROR.REQUIRED_FIELD_ERROR') : ''}
          />
          <ControlDropDownItem
            label={t('ORDER_BOOKING_SCREEN.SELECT_CAR_TYPE')}
            selectedValue={selectedCarType}
            data={carTypesData}
            onSelect={handleCarTypeSelect}
            error={carTypeError}
            errorMessage={carTypeError ? t('ERROR.REQUIRED_FIELD_ERROR') : ''}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {bookingTypesData.map((item: any, index: any) => {
              const isSelected = selectedBookingTypeId === item.id;
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: 5,
                  }}>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onPress={() => {
                      setSelectedBookingTypeId(item?.id);
                    }}>
                    <View
                      style={{
                        width: 15,
                        height: 15,
                        borderWidth: !_.isEmpty(selectedBookingTypeId) ? 0 : 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 3,
                        marginRight: 5,
                        borderColor: isSelected ? '#1154FF' : '#666',
                        backgroundColor: isSelected ? '#1154FF' : 'transparent',
                      }}>
                      {isSelected && (
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 10,
                          }}>
                          ✓
                        </Text>
                      )}
                    </View>

                    <Text>{item?.name}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookingButton}
          onPress={() => {
            // Validate các trường bắt buộc
            let valid = true;
            if (!selectedTripTypeId) {
              setTripTypeError(true);
              valid = false;
            }
            if (!selectedCarTypeId) {
              setCarTypeError(true);
              valid = false;
            }
            if (!selectedBookingTypeId) {
              setBookingTypeError(true);
              valid = false;
            }
            if (!selectedDate) {
              setDateErrorType('EMPTY');
              valid = false;
            }
            if (!selectedTime) {
              valid = false;
            }
            if (!valid) return;

            // Call API Order Add
            callOrderAddApi();
            setIsBusy(true); // bật loading
            bottomSheetRef.current?.close();
            // navigation.navigate('DrawerNavigator', {
            //   screen: 'Main',
            // });
          }}>
          <Text style={styles.bookingButtonText}>
            {t('ORDER_BOOKING_SCREEN.BOOKING_CONFIRM_BUTTON')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.mapContainer}>
          <CustomeMapTracking
            originPlaceId={originDescription}
            destinationPlaceId={destinationDescription}
            googleApiKey={GOOGLE_API_KEY}
          />
        </View>
        <BottomSheetComponent
          ref={bottomSheetRef}
          snapPoints={['20%', '50%', '85%']}
          enablePanDownToClose={false}
          content={renderOuterSheetContent()}
        />
        {isBusy && <CustomeLoading visible={true} />}
        <CustomSuccessModal
          visible={alertVisible}
          message={t('SYSTEM.MESSAGE')}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default OrderBookingScreen;
