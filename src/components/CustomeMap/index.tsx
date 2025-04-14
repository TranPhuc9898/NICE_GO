// CustomeMap.tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps';

interface CustomeMapProps {
  region: Region;
}

const CustomeMap: React.FC<CustomeMapProps> = ({region}) => {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE} // Nếu bạn không cần Google Maps, bỏ dòng này
        style={styles.map}
        region={region}
        onRegionChangeComplete={() => {}}>
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
          title="Your Location"
          description="You are here"
        />
      </MapView>
    </View>
  );
};

export default CustomeMap;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});
