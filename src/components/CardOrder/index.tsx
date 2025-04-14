// CardWaiting.tsx
import {spacing} from '@/constants';
import {ICardOrder} from '@/utils/types';
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface ICardWaitingProps {
  data?: ICardOrder | any;
  onPress?: () => void;
}

const CardOrder: React.FC<ICardWaitingProps> = ({data, onPress}) => {
  const {property, from_location, to_location, price, status} = data;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.topSection}>
        <Text style={styles.statusText}>Status: {status.toUpperCase()}</Text>
      </View>
      <View style={styles.infoSection}>
        <Text style={styles.locationText}>
          {from_location} → {to_location}
        </Text>
        <Text style={styles.priceText}>Giá: {price} đ</Text>
      </View>
      <View style={styles.customerSection}>
        <Text style={styles.customerName}>Tên: {property.name}</Text>
        <Text style={styles.customerPhone}>SĐT: {property.phone}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardOrder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2, // Android drop shadow
  },
  topSection: {
    marginBottom: 6,
  },
  statusText: {
    color: '#FFB300', // màu vàng cam, tuỳ ý
    fontWeight: 'bold',
    fontSize: spacing.SPACING_15,
  },
  infoSection: {
    marginBottom: 6,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  priceText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  customerSection: {
    marginTop: 6,
  },
  customerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  customerPhone: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
