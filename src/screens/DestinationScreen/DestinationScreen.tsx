import {
  SafeAreaView,
  StyleSheet,
  View,
  Alert,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, {useCallback, useMemo, useState} from 'react';
import {withModalProvider} from '@/components/BottomSheet/WithBottomSheetProvider';
import {useSelector} from 'react-redux';
import ControlDropDownItem from '@/components/ControlDropDownItem';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '@/navigation/AppStack';
import useOrderAPI from '@/api/Order';

// ==== THÊM: import useTranslation ====
import {useTranslation} from 'react-i18next';

type DestinationScreenRouteProp = RouteProp<
  RootStackParamList,
  'DestinationScreen'
>;

type Props = {
  route: DestinationScreenRouteProp;
};

const DestinationScreen: React.FC<Props> = ({route}) => {
  // ==== Lấy hàm t() để dịch ====
  const {t} = useTranslation();

  const navigation = useNavigation<any>();
  console.log('🚀 ~ DestinationScreen ~ route:', route);
  // States
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);
  const [selectedWard, setSelectedWard] = useState<string | null>(null);
  const [selectedCarType, setSelectedCarType] = useState<string | null>(null);
  const [selectedTripType, setSelectedTripType] = useState<string | null>(null);
  const [note, setNote] = useState<string>('');

  // ID States
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null,
  );
  const [selectedWardId, setSelectedWardId] = useState<number | null>(null);
  const [selectedCarTypeId, setSelectedCarTypeId] = useState<number | null>(
    null,
  );
  const [selectedTripTypeId, setSelectedTripTypeId] = useState<number | null>(
    null,
  );

  // Error States
  const [cityError, setCityError] = useState<boolean>(false);
  const [districtError, setDistrictError] = useState<boolean>(false);
  const [wardError, setWardError] = useState<boolean>(false);
  const [carTypeError, setCarTypeError] = useState<boolean>(false);
  const [tripTypeError, setTripTypeError] = useState<boolean>(false);
  const [noteError, setNoteError] = useState<boolean>(false);

  // Redux
  const reduxData = useSelector((state: any) => state.pickUp.data);
  const locations = reduxData?.data?.locations?.end || [];
  const carTypes = reduxData?.data?.car_type || [];
  const tripTypes = reduxData?.data?.trip_type || [];

  // Districts
  const districts = useMemo(() => {
    if (!selectedCity) return [];
    const city = locations.find((c: any) => c.name === selectedCity);
    return city ? city.districts : [];
  }, [selectedCity, locations]);

  // Wards
  const wards = useMemo(() => {
    if (!selectedDistrict) return [];
    const district = districts.find((d: any) => d.name === selectedDistrict);
    return district ? district.wards : [];
  }, [selectedDistrict, districts]);

  // Handlers
  const handleCitySelect = useCallback((city: any) => {
    setSelectedCity(city.name);
    setSelectedCityId(city.id);
    setSelectedDistrict(null);
    setSelectedDistrictId(null);
    setSelectedWard(null);
    setSelectedWardId(null);
    setCityError(false);
  }, []);

  const handleDistrictSelect = useCallback((district: any) => {
    setSelectedDistrict(district.name);
    setSelectedDistrictId(district.id);
    setSelectedWard(null);
    setSelectedWardId(null);
    setDistrictError(false);
  }, []);

  const handleWardSelect = useCallback((ward: any) => {
    setSelectedWard(ward.name);
    setSelectedWardId(ward.id);
    setWardError(false);
  }, []);

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

  // Lấy origin ID từ route params
  const originCityId = route.params?.otherParam?.selectedCityId;
  const originDistrictId = route.params?.otherParam?.selectedDistrictId;
  const originWardId = route.params?.otherParam?.selectedWardId;

  // Tạo requestBody
  const requestBody: any = useMemo(() => {
    return {
      origin: {
        province: originCityId,
        district: originDistrictId,
        ward: originWardId,
      },
      destination: {
        province: selectedCityId,
        district: selectedDistrictId,
        ward: selectedWardId,
      },
      trip_type: selectedTripTypeId,
      car_type: selectedCarTypeId,
    };
  }, [
    originCityId,
    originDistrictId,
    originWardId,
    selectedCityId,
    selectedDistrictId,
    selectedWardId,
    selectedTripTypeId,
    selectedCarTypeId,
  ]);

  // const {
  //   data: orderData,
  //   isLoading,
  //   isError,
  //   refetch,
  // } = useOrderAPI(requestBody, false);

  // Submit
  const handleSubmit = useCallback(() => {
    let valid = true;

    if (!selectedCity) {
      setCityError(true);
      valid = false;
    }

    if (!selectedDistrict) {
      setDistrictError(true);
      valid = false;
    }

    if (!selectedWard) {
      setWardError(true);
      valid = false;
    }

    if (!selectedCarType) {
      setCarTypeError(true);
      valid = false;
    }

    if (!selectedTripType) {
      setTripTypeError(true);
      valid = false;
    }

    if (!note.trim()) {
      setNoteError(true);
      valid = false;
    }

    if (valid) {
      refetch()
        .then(res => {
          console.log('🚀 ~ handleSubmit ~ res:', res);
          if (!isError && res.data) {
            // Thành công => điều hướng
            navigation.navigate('ResultScreen', {orderData: res.data});
          }
        })
        .catch(err => {
          Alert.alert(
            t('DESTINATION_SCREEN.FORM_ERROR_TITLE'),
            'Có lỗi đéo gì đó khi gọi API', // chuỗi này tuỳ bạn i18n tiếp nếu muốn
          );
          console.log(err);
        });

      Alert.alert(
        t('DESTINATION_SCREEN.FORM_SUCCESS_TITLE'),
        t('DESTINATION_SCREEN.FORM_SUCCESS_MESSAGE'),
      );
    } else {
      Alert.alert(
        t('DESTINATION_SCREEN.FORM_ERROR_TITLE'),
        t('DESTINATION_SCREEN.FORM_ERROR_MESSAGE'),
      );
    }
  }, [
    selectedCity,
    selectedDistrict,
    selectedWard,
    selectedCarType,
    selectedTripType,
    note,
    refetch,
    isError,
    navigation,
    t,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollViewContent}
        enableOnAndroid={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            {/* Chọn Tỉnh / Thành Phố */}
            <ControlDropDownItem
              label={t('DESTINATION_SCREEN.SELECT_CITY')}
              selectedValue={selectedCity}
              data={locations}
              onSelect={handleCitySelect}
              error={cityError}
              errorMessage={
                cityError ? t('DESTINATION_SCREEN.REQUIRED_FIELD_ERROR') : ''
              }
            />

            {/* Chọn Quận / Huyện */}
            <ControlDropDownItem
              label={t('DESTINATION_SCREEN.SELECT_DISTRICT')}
              selectedValue={selectedDistrict}
              data={districts}
              onSelect={handleDistrictSelect}
              error={districtError}
              errorMessage={
                districtError
                  ? t('DESTINATION_SCREEN.REQUIRED_FIELD_ERROR')
                  : ''
              }
            />

            {/* Chọn Xã / Phường */}
            <ControlDropDownItem
              label={t('DESTINATION_SCREEN.SELECT_WARD')}
              selectedValue={selectedWard}
              data={wards}
              onSelect={handleWardSelect}
              error={wardError}
              errorMessage={
                wardError ? t('DESTINATION_SCREEN.REQUIRED_FIELD_ERROR') : ''
              }
            />

            {/* Chọn Loại Xe */}
            <ControlDropDownItem
              label={t('DESTINATION_SCREEN.SELECT_CAR_TYPE')}
              selectedValue={selectedCarType}
              data={carTypes}
              onSelect={handleCarTypeSelect}
              error={carTypeError}
              errorMessage={
                carTypeError ? t('DESTINATION_SCREEN.REQUIRED_FIELD_ERROR') : ''
              }
            />

            {/* Chọn Loại Chuyến Đi */}
            <ControlDropDownItem
              label={t('DESTINATION_SCREEN.SELECT_TRIP_TYPE')}
              selectedValue={selectedTripType}
              data={tripTypes}
              onSelect={handleTripTypeSelect}
              error={tripTypeError}
              errorMessage={
                tripTypeError
                  ? t('DESTINATION_SCREEN.REQUIRED_FIELD_ERROR')
                  : ''
              }
            />

            {/* TextInput ghi chú */}
            <View style={styles.noteContainer}>
              <Text style={styles.label}>
                {t('DESTINATION_SCREEN.NOTE_LABEL')}
              </Text>
              <TextInput
                style={[styles.textInput, noteError && styles.textInputError]}
                placeholder={t('DESTINATION_SCREEN.NOTE_PLACEHOLDER')}
                value={note}
                onChangeText={text => {
                  setNote(text);
                  if (noteError && text.trim()) setNoteError(false);
                }}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              {noteError && (
                <Text style={styles.errorText}>
                  {t('DESTINATION_SCREEN.REQUIRED_FIELD_ERROR')}
                </Text>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* Nút Submit */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {t('DESTINATION_SCREEN.SUBMIT_BUTTON')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default DestinationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  noteContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  textInput: {
    height: 100,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  textInputError: {
    borderColor: 'red',
  },
  buttonContainer: {
    marginHorizontal: 20,
  },
  submitButton: {
    height: 50,
    backgroundColor: '#1154FF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginLeft: 20,
    fontSize: 12,
  },
});
