// import React, {useEffect, useState, useRef} from 'react';
// import {View, StyleSheet} from 'react-native';
// import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
// import PolylineUtil from '@mapbox/polyline';
// import useHomeScreen from '@/hooks/UseHomeScreen/useHomeScreen';
// import _ from 'lodash';

// interface Coord {
//   latitude: number;
//   longitude: number;
// }

// interface CustomeMapTrackingProps {
//   originPlaceId: string;
//   destinationPlaceId: string;
//   googleApiKey: string;
// }

// const CustomeMapTracking: React.FC<CustomeMapTrackingProps> = ({
//   originPlaceId,
//   destinationPlaceId,
//   googleApiKey,
// }) => {
//   const [coords, setCoords] = useState<Coord[]>([]);
//   const [originCoord, setOriginCoord] = useState<Coord | null>(null);
//   const [destCoord, setDestCoord] = useState<Coord | null>(null);

//   const {region} = useHomeScreen();
//   console.log('🚀 ~ region:', region);

//   // Ref cho MapView
//   const mapRef = useRef<MapView | null>(null);

//   useEffect(() => {
//     fetchDirections();
//   }, [originPlaceId, destinationPlaceId]);

//   const fetchDirections = async () => {
//     try {
//       // const url = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${originPlaceId}&destination=place_id:${destinationPlaceId}&key=${googleApiKey}`;
//       const url = `https://maps.gomaps.pro/maps/api/directions/json?destination=${destinationPlaceId}&origin=${originPlaceId}&key=${googleApiKey}`;
//       const response = await fetch(url);
//       console.log('🚀 ~ fetchDirections ~ response:', response);
//       const json = await response.json();

//       if (json.routes?.length) {
//         // Decode polyline
//         const points = json.routes[0].overview_polyline.points;
//         const decoded = PolylineUtil.decode(points); // => [[lat, lng], ...]
//         const routeCoords = decoded.map(([lat, lng]) => ({
//           latitude: lat,
//           longitude: lng,
//         }));
//         setCoords(routeCoords);

//         // Lấy start_location / end_location
//         const leg = json.routes[0].legs[0];
//         if (leg) {
//           setOriginCoord({
//             latitude: leg.start_location.lat,
//             longitude: leg.start_location.lng,
//           });
//           setDestCoord({
//             latitude: leg.end_location.lat,
//             longitude: leg.end_location.lng,
//           });
//         }
//       }
//     } catch (error) {
//       console.log('fetchDirections error:', error);
//     }
//   };

//   // Mỗi lần coords thay đổi, fit map cho vừa đủ toàn bộ tuyến
//   useEffect(() => {
//     if (coords.length > 0 && mapRef.current) {
//       mapRef.current.fitToCoordinates(coords, {
//         edgePadding: {top: 100, right: 50, bottom: 50, left: 50},
//         animated: true,
//       });
//     }
//   }, [coords]);

//   return (
//     <View style={styles.container}>
//       <MapView
//         ref={mapRef}
//         style={styles.map}
//         provider={PROVIDER_GOOGLE}
//         // Nếu vẫn muốn có initialRegion fallback, bạn có thể đặt cứng 1 vùng:
//         // initialRegion={{
//         //   latitude: originCoord?.latitude || region?.latitude,
//         //   longitude: originCoord?.longitude || region?.longitude,
//         //   latitudeDelta: 0.01,
//         //   longitudeDelta: 0.01,
//         // }}>
//         region={{
//           latitude: originCoord?.latitude || region?.latitude,
//           longitude: originCoord?.longitude || region?.longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}>
//         {originCoord && (
//           <Marker coordinate={originCoord} title="Điể m đi" pinColor="#00BFFF" />
//         )}
//         {destCoord && (
//           <Marker coordinate={destCoord} title="Điểm đến" pinColor="#FF0000" />
//         )}
//         {coords.length > 0 && (
//           <Polyline
//             coordinates={coords}
//             strokeColor="#1154FF"
//             strokeWidth={4}
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// export default CustomeMapTracking;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 1,
//   },
// });
import React, {useEffect, useState, useRef, useLayoutEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import PolylineUtil from '@mapbox/polyline';
import useHomeScreen from '@/hooks/UseHomeScreen/useHomeScreen';

interface Coord {
  latitude: number;
  longitude: number;
}

interface CustomeMapTrackingProps {
  originPlaceId: string;
  destinationPlaceId: string;
  googleApiKey: string;
  // Callback nhận origin và destination coordinate
}

const CustomeMapTracking: React.FC<CustomeMapTrackingProps> = ({
  originPlaceId,
  destinationPlaceId,
  googleApiKey,
}) => {
  const [coords, setCoords] = useState<Coord[]>([]);
  const [originCoord, setOriginCoord] = useState<Coord | null>(null);
  const [destCoord, setDestCoord] = useState<Coord | null>(null);

  const [regionStart, setRegionStart] = useState<any>();
  const [regionEnd, setRegionEnd] = useState<any>();

  // Ref cho MapView
  const mapRef = useRef<MapView | null>(null);
  const {region} = useHomeScreen();

  useEffect(() => {
    fetchDirections();
  }, [originPlaceId, destinationPlaceId]);

  useEffect(() => {
    if (region?.latitude && region?.longitude) {
      setRegionStart(region.latitude);
      setRegionEnd(region.longitude);
    }
  }, [region]);

  const fetchDirections = async () => {
    try {
      // const url = `https://maps.googleapis.com/maps/api/directions/json?origin=place_id:${originPlaceId}&destination=place_id:${destinationPlaceId}&key=${googleApiKey}`;
      const url = `https://maps.gomaps.pro/maps/api/directions/json?destination=${destinationPlaceId}&origin=${originPlaceId}&key=${googleApiKey}`;
      const response = await fetch(url);
      const json = await response.json();

      if (json.routes?.length) {
        // Decode polyline
        const points = json.routes[0].overview_polyline.points;
        const decoded = PolylineUtil.decode(points); // => [[lat, lng], ...]
        const routeCoords = decoded.map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }));
        setCoords(routeCoords);

        // Lấy start_location / end_location
        const leg = json.routes[0].legs[0];
        if (leg) {
          setOriginCoord({
            latitude: leg.start_location.lat,
            longitude: leg.start_location.lng,
          });
          setDestCoord({
            latitude: leg.end_location.lat,
            longitude: leg.end_location.lng,
          });
        }
      }
    } catch (error) {
      console.log('fetchDirections error:', error);
    }
  };

  // Mỗi lần coords thay đổi, fit map cho vừa đủ toàn bộ tuyến
  useEffect(() => {
    if (coords.length > 0 && mapRef.current) {
      mapRef.current.fitToCoordinates(coords, {
        edgePadding: {top: 100, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [coords]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        // Nếu vẫn muốn có initialRegion fallback, bạn có thể đặt cứng 1 vùng:
        region={{
          latitude: regionStart,
          longitude: regionEnd,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        initialRegion={{
          latitude: originCoord?.latitude || regionStart,
          longitude: originCoord?.longitude || regionEnd,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {originCoord && (
          <Marker coordinate={originCoord} title="Điểm đi" pinColor="#00BFFF" />
        )}
        {destCoord && (
          <Marker coordinate={destCoord} title="Điểm đến" pinColor="#FF0000" />
        )}
        {coords.length > 0 && (
          <Polyline
            coordinates={coords}
            strokeColor="#1154FF"
            strokeWidth={4}
          />
        )}
      </MapView>
    </View>
  );
};

export default CustomeMapTracking;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
