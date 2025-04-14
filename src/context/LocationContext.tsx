// import React, {createContext, useState, useEffect, useContext} from 'react';
// import Geolocation from 'react-native-geolocation-service';
// import {PermissionsAndroid, Platform, Alert} from 'react-native';

// interface LocationContextProps {
//   location: string | null;
//   fetchLocation: () => void;
// }

// const LocationContext = createContext<LocationContextProps>({
//   location: null,
//   fetchLocation: () => {},
// });

// export const LocationProvider: React.FC<{children: React.ReactNode}> = ({
//   children,
// }) => {
//   const [location, setLocation] = useState<string | null>(null);

//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true; // iOS tự quản lý
//   };

//   const fetchLocation = async () => {
//     const hasPermission = await requestLocationPermission();
//     if (hasPermission) {
//       Geolocation.getCurrentPosition(
//         position => {
//           const {latitude, longitude} = position.coords;
//           setLocation(
//             `Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`,
//           );
//         },
//         error => {
//           console.error('Error fetching location:', error);
//           setLocation('Không lấy được vị trí');
//         },
//         {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//       );
//     } else {
//       Alert.alert(
//         'Permission Denied',
//         'Bạn cần cấp quyền vị trí để sử dụng tính năng này.',
//       );
//     }
//   };

//   useEffect(() => {
//     fetchLocation();
//   }, []);

//   return (
//     <LocationContext.Provider value={{location, fetchLocation}}>
//       {children}
//     </LocationContext.Provider>
//   );
// };

// export const useLocation = () => useContext(LocationContext);
