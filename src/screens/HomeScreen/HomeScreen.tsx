import React, {useState, useEffect, useLayoutEffect, useCallback} from 'react';
import {
  View,
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {FormProvider, useForm} from 'react-hook-form';
import {useDispatch} from 'react-redux';

import HeaderHomeScreen from '@/components/HeaderHomeScreen';
import styles from './styles';
import PartnerTopTab from '@/navigation/TopTabNavigation/PartnerTopTab';
import useHomeScreen from '@/hooks/UseHomeScreen/useHomeScreen';
import usePickUp from '@/hooks/UsePickUpScreen/UsePickUpScreen';

import {CustomeTextInPut} from '@/components';
import {getLocations} from '@/api/Location';
import {
  setDestinationCoords,
  setOriginCoords,
} from '@/redux/slice/CoordinateSlice/CoordinateSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';
import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';
import {setUserRole} from '@/redux/slice/UserSlice/UserSlice';

// API hook mẫu dựa trên useOrderMeAcceptApi, sử dụng GET, tối ưu để tránh gọi nhiều lần
const useSwitchRoleApi = (role: string, enabled = false) => {
  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['SwitchRole_API', role],
    queryFn: async () => {
      console.log('Calling API for role:', role); // Debug log
      const endpoint = `/user/switch-role/${role}`;
      const response = await callApi.get(endpoint);
      return response;
    },
    enabled, // Chỉ gọi khi enabled = true
    refetchOnMount: false, // Tắt refetch khi mount
    refetchOnWindowFocus: false, // Tắt refetch khi focus
    refetchOnReconnect: false, // Tắt refetch khi reconnect
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

interface IValues {
  pickUp: string;
  pickEnd: string;
}

const GOOGLE_API_KEY = 'AlzaSyxpi_q2Jka3N-jzjMdzcMod02y1gJ5ksJr';

// Danh sách role từ SettingScreen
const roles = ['user', 'driver', 'partner'];

const HomeScreen = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1);

    console.log(123123123);
  }, []);
  console.log('🚀 ~ HomeScreen ~ count:', count);

  const navigation = useNavigation<any>();
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const {region} = useHomeScreen();
  const {data: dataPickUp} = usePickUp();

  const methods = useForm<IValues>({
    mode: 'onChange',
    defaultValues: {
      pickUp: '',
      pickEnd: '',
    },
  });

  const [pickUpData, setPickUpData] = useState({description: '', place_id: ''});
  const [pickEndData, setPickEndData] = useState({
    description: '',
    place_id: '',
  });

  // Thêm state cho modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);

  // Lấy roleIndex từ Redux store
  const roleIndex = useSelector((state: RootState) => state.user.role_index);

  // Hook để kiểm tra và hiển thị modal chỉ 1 lần sau khi đăng nhập
  useEffect(() => {
    const checkModalShown = async () => {
      try {
        const hasShownModal = await AsyncStorage.getItem('hasShownRoleModal');
        console.log('hasShownRoleModal in HomeScreen:', hasShownModal); // Debug log
        if (hasShownModal !== 'true') {
          setIsModalVisible(true); // Hiển thị modal nếu chưa từng hiển thị
          await AsyncStorage.setItem('hasShownRoleModal', 'true'); // Đánh dấu đã hiển thị
        }
      } catch (error) {
        console.error('Error checking hasShownRoleModal:', error);
        // Nếu có lỗi, đặt lại giá trị mặc định để hiển thị modal
        await AsyncStorage.setItem('hasShownRoleModal', 'false');
        setIsModalVisible(true);
      }
    };
    checkModalShown();
  });

  /**
   * Trường hợp 1: Nếu cả 2 ô đều rỗng thì dùng region của device set vào origin
   */
  useEffect(() => {
    if (!pickUpData.description && !pickEndData.description && region) {
      console.log('Using device current location:', region);
      dispatch(
        setOriginCoords({
          latitude: region.latitude.toString(),
          longitude: region.longitude.toString(),
        }),
      );
    }
  }, [pickUpData, pickEndData, region, dispatch]);

  /**
   * fetchGeocode cho pickUp
   */
  const fetchGeocodePickUp = async () => {
    if (!pickUpData.description) return;
    try {
      const addressEncoded = encodeURIComponent(pickUpData.description);
      const url = `https://maps.gomaps.pro/maps/api/geocode/json?key=${GOOGLE_API_KEY}&address=${addressEncoded}`;

      const response = await fetch(url);
      const json = await response.json();
      if (json?.results?.length) {
        const {lat, lng} = json.results[0].geometry.location;
        dispatch(
          setOriginCoords({
            latitude: lat.toString(),
            longitude: lng.toString(),
          }),
        );
      }
    } catch (error) {
      console.log('fetchGeocodePickUp error:', error);
    }
  };

  /**
   * fetchGeocode cho pickEnd
   */
  const fetchGeocodePickEnd = async () => {
    if (!pickEndData.description) return;
    try {
      const addressEncoded = encodeURIComponent(pickEndData.description);
      const url = `https://maps.gomaps.pro/maps/api/geocode/json?key=${GOOGLE_API_KEY}&address=${addressEncoded}`;

      const response = await fetch(url);
      const json = await response.json();
      if (json?.results?.length) {
        const {lat, lng} = json.results[0].geometry.location;
        dispatch(
          setDestinationCoords({
            latitude: lat.toString(),
            longitude: lng.toString(),
          }),
        );
      }
    } catch (error) {
      console.log('fetchGeocodePickEnd error:', error);
    }
  };

  // Khi pickUp thay đổi => call geocode
  useLayoutEffect(() => {
    if (pickUpData.description) {
      fetchGeocodePickUp();
    }
  }, [pickUpData]);

  // Khi pickEnd thay đổi => call geocode
  useLayoutEffect(() => {
    if (pickEndData.description) {
      fetchGeocodePickEnd();
    }
  }, [pickEndData]);

  // Sử dụng hook API cho switch role (sử dụng GET)
  const {refetch: switchRole, isLoading: isSwitching} = useSwitchRoleApi(
    selectedRole || '',
    false,
  );

  // Xử lý khi chọn role, sử dụng useCallback để tránh re-render không cần thiết
  const handleSelectRole = useCallback((role: string) => {
    console.log('Selecting role:', role);
    setSelectedRole(role);
  }, []);

  // Xử lý khi nhấn nút Confirm
  const handleConfirm = async () => {
    console.log('Attempting to switch role to:', selectedRole);
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role before confirming.');
      return;
    }
    setIsConfirming(true);
    try {
      const response = await switchRole();
      console.log('API Response:', response);
      if (response.status === 200) {
        Alert.alert('Success', 'Role switched successfully');
        dispatch(setUserRole(selectedRole));
        setIsModalVisible(false);
      } else if (response.status === 400) {
        const errorMessage = response.data?.msg || 'Failed to switch role';
        Alert.alert('Error', `Failed to switch role: ${errorMessage}`);
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      console.log('API Error:', error);
      let errorMessage = 'Failed to switch role. Please try again.';
      if (error.response && error.response.status === 400) {
        errorMessage = error.response.data?.msg || 'User is not a partner';
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setIsConfirming(false);
    }
  };

  // Xử lý khi nhấn nút Hủy
  const handleCancel = () => {
    setIsModalVisible(false); // Chỉ đóng modal, không làm gì thêm
  };

  // Render item cho danh sách role, nổi bật role hiện tại
  const renderRoleItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={[
        modalStyles.roleItem,
        selectedRole === item && modalStyles.selectedRoleItem,
        item === roleIndex && modalStyles.currentRoleItem, // Nổi bật role hiện tại
      ]}
      onPress={() => handleSelectRole(item)}>
      <Text
        style={[
          modalStyles.roleText,
          selectedRole === item && modalStyles.selectedRoleText,
          item === roleIndex && modalStyles.currentRoleText, // Nổi bật chữ role hiện tại
        ]}>
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HeaderHomeScreen navigation={navigation} />

      <View style={{flex: 1, marginTop: 10}}>
        <View style={styles.overlay}>
          <FormProvider {...methods}>
            <CustomeTextInPut
              name="pickUp"
              placeholder={t('PICKUP_SCREEN.CHOOSE_YOUR_DESTINATION')}
              minChars={5}
              fetchApi={async query => {
                try {
                  const response = await getLocations(query);
                  return response.data || [];
                } catch (error) {
                  console.error('Lỗi getLocations pickUp:', error);
                  return [];
                }
              }}
              onItemSelected={item =>
                setPickUpData({
                  description: item.description,
                  place_id: item.place_id,
                })
              }
              onItemCleared={() => {
                setPickUpData({description: '', place_id: ''});
                dispatch(setOriginCoords({latitude: '', longitude: ''}));
              }}
            />

            <CustomeTextInPut
              name="pickEnd"
              placeholder={t('PICKUP_SCREEN.ORDER_BOOKING')}
              minChars={5}
              fetchApi={async query => {
                try {
                  const response = await getLocations(query);
                  return response.data || [];
                } catch (error) {
                  console.error('Lỗi getLocations pickEnd:', error);
                  return [];
                }
              }}
              onItemSelected={item =>
                setPickEndData({
                  description: item.description,
                  place_id: item.place_id,
                })
              }
              onItemCleared={() => {
                setPickEndData({description: '', place_id: ''});
                dispatch(setDestinationCoords({latitude: '', longitude: ''}));
              }}
            />
          </FormProvider>
        </View>

        <PartnerTopTab />
      </View>

      {/* Modal cho role selection */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={handleCancel}>
        <View style={modalStyles.modalOverlay}>
          <View style={modalStyles.modalContainer}>
            <Text style={modalStyles.modalTitle}>Select Your Role</Text>
            <Text style={modalStyles.modalDescription}>
              Choose your role (Current:{' '}
              {roleIndex.charAt(0).toUpperCase() + roleIndex.slice(1)})
            </Text>
            <FlatList
              data={roles}
              keyExtractor={item => item}
              renderItem={renderRoleItem}
              style={modalStyles.roleList}
            />
            <View style={modalStyles.buttonContainer}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.cancelButton]}
                onPress={handleCancel}>
                <Text style={modalStyles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.confirmButton]}
                onPress={handleConfirm}
                disabled={isConfirming || !selectedRole}>
                {isConfirming ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={modalStyles.buttonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;

// Styles cho modal
const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '70%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  roleList: {
    marginVertical: 10,
    maxHeight: 150,
  },
  roleItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  selectedRoleItem: {
    backgroundColor: '#e3f2fd', // Màu nền khi chọn
  },
  currentRoleItem: {
    backgroundColor: '#f0f8ff', // Màu nền nổi bật cho role hiện tại (khác selected)
  },
  roleText: {
    fontSize: 16,
    color: '#000',
  },
  selectedRoleText: {
    color: '#1154FF',
    fontWeight: 'bold',
  },
  currentRoleText: {
    color: '#2c5282', // Màu chữ nổi bật cho role hiện tại (màu xanh đậm hơn)
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
  },
  cancelButton: {
    backgroundColor: '#ff5252',
  },
  confirmButton: {
    backgroundColor: '#1154FF',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
