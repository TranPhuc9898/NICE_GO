// import {useEffect, useState, useRef} from 'react';
// import {
//   check,
//   request,
//   PERMISSIONS,
//   RESULTS,
//   openSettings,
// } from 'react-native-permissions';
// import Geolocation from '@react-native-community/geolocation';
// import {useDispatch} from 'react-redux';
// import {setOrderList} from '@/redux/slice/OrderListSlice/OrderListSlice';
// import useOrderListAPI from '@/api/OrderList';
// import {Alert, Platform, AppState, AppStateStatus} from 'react-native';
// import {Region} from 'react-native-maps';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const useHomeScreen = () => {
//   const dispatch = useDispatch();
//   const [locationPermissionGranted, setLocationPermissionGranted] =
//     useState<boolean>(false);
//   const [region, setRegion] = useState<Region | null>(null);
//   const appState = useRef<AppStateStatus>(AppState.currentState);
//   const alertShownRef = useRef<boolean>(false);
//   // Thêm ref để theo dõi trạng thái permission trước đó
//   const previousPermissionRef = useRef<string>('');

//   const dataRequest = {
//     userType: 'partner',
//     status: 0,
//   };

//   const {data, isLoading, isError} = useOrderListAPI(
//     dataRequest.userType,
//     dataRequest.status,
//   );

//   useEffect(() => {
//     if (data) {
//       dispatch(setOrderList(data));
//     }
//   }, [data, dispatch]);

//   useEffect(() => {
//     const checkAndRequestLocationPermission = async () => {
//       try {
//         const permissionToCheck =
//           Platform.OS === 'ios'
//             ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
//             : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

//         const result = await check(permissionToCheck);
//         console.log('Permission check result: ', result);

//         // Nếu permission thay đổi thành BLOCKED, reset trạng thái đã hiện alert
//         if (
//           previousPermissionRef.current !== result &&
//           result === RESULTS.BLOCKED
//         ) {
//           await AsyncStorage.removeItem('hasShownLocationAlert');
//           alertShownRef.current = false;
//         }

//         // Cập nhật trạng thái permission hiện tại
//         previousPermissionRef.current = result;

//         switch (result) {
//           case RESULTS.GRANTED:
//             setLocationPermissionGranted(true);
//             getCurrentUserLocation();
//             break;
//           case RESULTS.DENIED:
//             const requestResult = await request(permissionToCheck);
//             if (requestResult === RESULTS.GRANTED) {
//               setLocationPermissionGranted(true);
//               getCurrentUserLocation();
//             } else {
//               setLocationPermissionGranted(false);
//               showGoToSettingsAlert();
//             }
//             break;
//           case RESULTS.BLOCKED:
//           case RESULTS.LIMITED:
//             setLocationPermissionGranted(false);
//             showGoToSettingsAlert();
//             break;
//           default:
//             setLocationPermissionGranted(false);
//             break;
//         }
//       } catch (error) {
//         console.error('Error checking location permission:', error);
//         setLocationPermissionGranted(false);
//       }
//     };

//     const getCurrentUserLocation = () => {
//       Geolocation.getCurrentPosition(
//         position => {
//           const {latitude, longitude} = position.coords;
//           console.log('Current Position:', latitude, longitude);
//           setRegion({
//             latitude,
//             longitude,
//             latitudeDelta: 0.01,
//             longitudeDelta: 0.01,
//           });
//         },
//         error => {
//           console.error('Error fetching location:', error);
//           Alert.alert(
//             'Error',
//             'Could not fetch location. Please check your GPS settings or permissions!',
//           );
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 15000,
//           maximumAge: 10000,
//         },
//       );
//     };

//     const showGoToSettingsAlert = async () => {
//       const hasShownAlert = await AsyncStorage.getItem('hasShownLocationAlert');

//       if (!alertShownRef.current && !hasShownAlert) {
//         alertShownRef.current = true;

//         Alert.alert(
//           'Location Permission',
//           'You have denied location permission. Please enable it in Settings to use this feature.',
//           [
//             {
//               text: 'Go to Settings',
//               onPress: async () => {
//                 try {
//                   await AsyncStorage.setItem('hasShownLocationAlert', 'true');
//                   await openSettings();
//                 } catch (error) {
//                   console.warn('Cannot open settings:', error);
//                 } finally {
//                   alertShownRef.current = false;
//                 }
//               },
//             },
//             {
//               text: 'Cancel',
//               style: 'cancel',
//               onPress: async () => {
//                 await AsyncStorage.setItem('hasShownLocationAlert', 'true');
//                 alertShownRef.current = false;
//               },
//             },
//           ],
//         );
//       }
//     };

//     const handleAppStateChange = (nextAppState: AppStateStatus) => {
//       if (
//         appState.current.match(/inactive|background/) &&
//         nextAppState === 'active'
//       ) {
//         console.log('App has come to the foreground!');
//         checkAndRequestLocationPermission();
//       }
//       appState.current = nextAppState;
//     };

//     checkAndRequestLocationPermission();

//     const subscription = AppState.addEventListener(
//       'change',
//       handleAppStateChange,
//     );

//     return () => {
//       subscription.remove();
//     };
//   }, []);

//   return {
//     data,
//     isLoading,
//     isError,
//     locationPermissionGranted,
//     region,
//     setLocationPermissionGranted,
//   };
// };

// export default useHomeScreen;
import {useEffect, useState} from 'react';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import {useDispatch} from 'react-redux';
import {setOrderList} from '@/redux/slice/OrderListSlice/OrderListSlice';
import {Alert, Platform, AppState} from 'react-native';
import {Region} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Constants
const PERMISSION_KEY = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const STORAGE_KEYS = {
  previousPermission: '@location_previous_permission',
  isShowingAlert: '@location_is_showing_alert',
};

const useHomeScreen = () => {
  const dispatch = useDispatch();
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [region, setRegion] = useState<Region | any>(null);

  const dataRequest = {
    userType: 'partner',
    status: 0,
  };

  const getCurrentUserLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setRegion({
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      },
      error => {
        console.error('Error fetching location:', error);
        // Alert.alert(
        //   'Error',
        //   'Could not fetch location. Please check your GPS settings or permissions!',
        // );
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const resetAlertState = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.isShowingAlert);
    } catch (error) {
      console.error('Error resetting alert state:', error);
    }
  };

  const showGoToSettingsAlert = async () => {
    try {
      // Kiểm tra xem alert có đang hiện không
      const isShowingAlert = await AsyncStorage.getItem(
        STORAGE_KEYS.isShowingAlert,
      );
      if (isShowingAlert === 'true') return;

      // Đánh dấu là alert đang hiện
      await AsyncStorage.setItem(STORAGE_KEYS.isShowingAlert, 'true');

      Alert.alert(
        'Location Permission',
        'You have denied location permission. Please enable it in Settings to use this feature.',
        [
          {
            text: 'Go to Settings',
            onPress: async () => {
              try {
                await openSettings();
              } catch (error) {
                console.warn('Cannot open settings:', error);
              } finally {
                // Reset trạng thái alert khi đóng settings
                await resetAlertState();
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: async () => {
              // Reset trạng thái alert khi cancel
              await resetAlertState();
            },
          },
        ],
      );
    } catch (error) {
      console.error('Error showing alert:', error);
    }
  };

  const checkAndRequestLocationPermission = async () => {
    try {
      const permissionToCheck =
        Platform.OS === 'ios' ? PERMISSION_KEY.ios : PERMISSION_KEY.android;

      const result = await check(permissionToCheck);

      // Lấy permission trước đó từ storage
      const previousPermission = await AsyncStorage.getItem(
        STORAGE_KEYS.previousPermission,
      );

      // Nếu permission thay đổi thành BLOCKED, reset alert state
      if (previousPermission !== result && result === RESULTS.BLOCKED) {
        await resetAlertState();
      }

      // Lưu permission hiện tại
      await AsyncStorage.setItem(STORAGE_KEYS.previousPermission, result);

      switch (result) {
        case RESULTS.GRANTED:
          setLocationPermissionGranted(true);
          getCurrentUserLocation();
          break;
        case RESULTS.DENIED:
          const requestResult = await request(permissionToCheck);
          if (requestResult === RESULTS.GRANTED) {
            setLocationPermissionGranted(true);
            getCurrentUserLocation();
          } else {
            setLocationPermissionGranted(false);
            showGoToSettingsAlert();
          }
          break;
        case RESULTS.BLOCKED:
        case RESULTS.LIMITED:
          setLocationPermissionGranted(false);
          showGoToSettingsAlert();
          break;
        default:
          setLocationPermissionGranted(false);
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      setLocationPermissionGranted(false);
    }
  };

  // Effect cho data
  // useEffect(() => {
  //   if (data) {
  //     dispatch(setOrderList(data));
  //   }
  // }, [data, dispatch]);

  // Effect cho permission check và app state
  useEffect(() => {
    // Check permission lần đầu
    checkAndRequestLocationPermission();

    // Handle app state changes
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        checkAndRequestLocationPermission();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    // data,
    // isLoading,
    // isError,
    locationPermissionGranted,
    region,
    setLocationPermissionGranted,
  };
};

export default useHomeScreen;
