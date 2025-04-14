import React, {useState, useEffect, useCallback} from 'react';
import {
  SafeAreaView,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useForm, FormProvider} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';

import CustomeTextInPut from '@/components/CustomeTextInPut';
import {BottomSheetComponent} from '@/components';
import {useBottomSheet} from '@/hooks/UseBottomSheet/useBottomSheet';
import useHomeScreen from '@/hooks/UseHomeScreen/useHomeScreen';
import {getLocations} from '@/api/Location';
import CustomeMap from '@/components/CustomeMap';
import useGetLocationDetails from '@/api/LocationDetails';

interface IValues {
  pickUp: string;
  pickEnd: string;
}

const PickUpScreen = () => {
  const {t} = useTranslation();
  const methods = useForm<IValues>({
    mode: 'onChange',
    defaultValues: {
      pickUp: '',
      pickEnd: '',
    },
  });
  const navigation = useNavigation<any>();
  const {bottomSheetRef, openBottomSheet, closeBottomSheet} = useBottomSheet();
  const {locationPermissionGranted, region} = useHomeScreen();

  // State lưu vị trí hiển thị trên map
  const [mapRegion, setMapRegion] = useState<any>(region);

  // State lưu thông tin điểm pickUp và pickEnd
  const [pickUpData, setPickUpData] = useState<{
    description: string;
    place_id: string;
  }>({
    description: '',
    place_id: '',
  });
  const [pickEndData, setPickEndData] = useState<{
    description: string;
    place_id: string;
  }>({
    description: '',
    place_id: '',
  });

  // State xác định đã chọn hay chưa
  const [isPickUpSelected, setIsPickUpSelected] = useState(false);
  const [isPickEndSelected, setIsPickEndSelected] = useState(false);

  // Hook lấy thông tin chi tiết vị trí cho pickUp (không gọi tự động)
  const {data: locationDetailsData, refetch: refetchLocationDetails} =
    useGetLocationDetails(
      {
        place_id: pickUpData.place_id,
      },
      false,
    );

  // --- Effect 1: Cập nhật mapRegion từ region của thiết bị nếu chưa chọn pickUp ---
  useEffect(() => {
    if (!isPickUpSelected && region?.latitude && region?.longitude) {
      setMapRegion(region);
    }
  }, [region, isPickUpSelected]);

  // --- Effect 2: Gọi API lấy thông tin chi tiết sau khi chọn pickUp ---
  useEffect(() => {
    if (!_.isEmpty(pickUpData.description) && !_.isEmpty(pickUpData.place_id)) {
      refetchLocationDetails();
    }
  }, [pickUpData, refetchLocationDetails]);

  // useEffect(() => {
  //   if (locationDetailsData && locationDetailsData.data) {
  //     const {latitude, longitude} = locationDetailsData.data;

  //     if (latitude && longitude) {
  //       setMapRegion({
  //         latitude,
  //         longitude,
  //         // latitudeDelta: 0.01,
  //         // longitudeDelta: 0.01,
  //       });
  //     }
  //   }
  // }, [locationDetailsData]);
  useEffect(() => {
    if (locationDetailsData?.data) {
      const {latitude, longitude} = locationDetailsData.data;

      if (latitude && longitude) {
        setMapRegion((prev: any) => {
          const newRegion = {
            latitude,
            longitude,
            latitudeDelta: 0.01,

            longitudeDelta: 0.01,
          };
          return _.isEqual(prev, newRegion) ? prev : {...newRegion};
        });
      }
    }
  }, [locationDetailsData]);

  // --- Effect 4: Điều khiển mở/đóng BottomSheet khi cả pickUp và pickEnd đã được chọn ---
  useEffect(() => {
    if (isPickUpSelected && isPickEndSelected) {
      openBottomSheet();
    } else {
      closeBottomSheet();
    }
  }, [isPickUpSelected, isPickEndSelected, openBottomSheet, closeBottomSheet]);

  // Hàm xử lý khi người dùng nhấn Order Booking
  const onPressOrderBooking = useCallback(() => {
    closeBottomSheet();
    navigation.navigate('OrderBookingScreen', {
      originPlaceId: pickUpData.place_id,
      originDescription: pickUpData.description,
      destinationPlaceId: pickEndData.place_id,
      destinationDescription: pickEndData.description,
    });
  }, [closeBottomSheet, navigation, pickUpData, pickEndData]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {locationPermissionGranted && region ? (
          <View style={styles.mapFullScreen}>
            <CustomeMap region={!_.isEmpty(mapRegion) ? mapRegion : region} />
          </View>
        ) : (
          <View style={styles.emptyMapContainer} />
        )}

        <View style={styles.overlay}>
          <FormProvider {...methods}>
            <CustomeTextInPut
              name="pickUp"
              placeholder={t('PICKUP_SCREEN.CHOOSE_YOUR_DESTINATION')}
              minChars={5}
              rules={{required: t('PICKUP_SCREEN.ERROR_1')}}
              fetchApi={async query => {
                try {
                  const response = await getLocations(query);
                  return response.data || [];
                } catch (error) {
                  console.error('Lỗi getLocations:', error);
                  return [];
                }
              }}
              onItemSelected={item => {
                setPickUpData({
                  description: item.description,
                  place_id: item.place_id,
                });
                setIsPickUpSelected(true);
              }}
              onItemCleared={() => {
                setPickUpData({description: '', place_id: ''});
                setIsPickUpSelected(false);
              }}
            />

            <CustomeTextInPut
              name="pickEnd"
              placeholder={t('PICKUP_SCREEN.ORDER_BOOKING')}
              minChars={5}
              rules={{required: t('PICKUP_SCREEN.ERROR_1')}}
              fetchApi={async query => {
                try {
                  const response = await getLocations(query);
                  return response.data || [];
                } catch (error) {
                  console.error('Lỗi getLocations:', error);
                  return [];
                }
              }}
              onItemSelected={item => {
                setPickEndData({
                  description: item.description,
                  place_id: item.place_id,
                });
                setIsPickEndSelected(true);
              }}
              onItemCleared={() => {
                setPickEndData({description: '', place_id: ''});
                setIsPickEndSelected(false);
              }}
            />
          </FormProvider>
        </View>

        <BottomSheetComponent
          enablePanDownToClose={false}
          ref={bottomSheetRef}
          content={
            <TouchableOpacity
              style={styles.bottomSheetContent}
              onPress={onPressOrderBooking}>
              <Text style={styles.buttonText}>
                {t('PICKUP_SCREEN.ORDER_BOOKING')}
              </Text>
            </TouchableOpacity>
          }
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default PickUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapFullScreen: {
    ...StyleSheet.absoluteFillObject,
  },
  emptyMapContainer: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomSheetContent: {
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    backgroundColor: '#1154FF',
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 12,
    borderRadius: 8,
    overflow: 'hidden',
    width: '90%',
  },
});
