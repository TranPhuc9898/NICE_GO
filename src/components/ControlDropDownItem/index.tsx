// ControlDropDownItem.tsx
import React, {useCallback, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import BottomSheetComponent from '../BottomSheet';

interface Item {
  name: string;
  id?: number;
}

interface ControlDropDownItemProps {
  label: string;
  selectedValue: string | null;
  data: Item[];
  onSelect: (item: Item) => void;
  error?: boolean;
  errorMessage?: string;
}

const ControlDropDownItem: React.FC<ControlDropDownItemProps> = ({
  label,
  selectedValue,
  data,
  onSelect,
  error = false,
  errorMessage = '',
}) => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = useCallback(() => {
    if (data.length > 0) {
      bottomSheetRef.current?.present();
    }
  }, [data]);

  const handleSelect = useCallback(
    (item: Item) => {
      onSelect(item);
      bottomSheetRef.current?.dismiss();
    },
    [onSelect],
  );

  const renderItem = ({item}: {item: Item}) => (
    <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
      <Text style={styles.itemText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={openBottomSheet}
        style={[
          styles.selector,
          selectedValue ? styles.selectorSelected : styles.selectorDefault,
          error && styles.selectorError,
        ]}>
        <View style={styles.row}>
          {/* Khi selectedValue có giá trị => màu #1154FF, ngược lại => placeholder #898989 */}
          <Text
            style={
              selectedValue ? styles.selectedText : styles.placeholderText
            }>
            {selectedValue
              ? selectedValue
              : `${label.replace('', '').replace(':', '')}`}
          </Text>
          <Image
            source={require('../../assets/icons/down.png')}
            style={styles.iconDown}
          />
        </View>
      </TouchableOpacity>

      {error && errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <BottomSheetComponent
        ref={bottomSheetRef}
        content={
          <View>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={data}
              keyExtractor={(item, index) =>
                item.id ? item.id.toString() : `${item.name}-${index}`
              }
              renderItem={renderItem}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Không có dữ liệu.</Text>
              }
            />
          </View>
        }
      />
    </View>
  );
};

export default ControlDropDownItem;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  selector: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  // Khi chưa có selectedValue => viền "mặc định" (có thể đổi nếu muốn)
  selectorDefault: {
    borderColor: '#000',
  },
  // Khi đã chọn => viền xanh y chang ControlDateTimePicker
  selectorSelected: {
    borderColor: '#1154FF',
  },
  selectorError: {
    borderColor: 'red',
  },
  // Text đã chọn => màu xanh
  selectedText: {
    color: '#1154FF',
  },
  // Text placeholder => màu xám
  placeholderText: {
    color: '#898989',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  item: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginLeft: 20,
    fontSize: 12,
  },
  // Layout cho text + icon
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconDown: {
    width: 13,
    height: 13,
    resizeMode: 'contain',
    marginLeft: 8,
    tintColor: '#2f2f2f',
  },
});
