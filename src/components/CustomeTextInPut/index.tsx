import React, {useState, useCallback, useRef} from 'react';
import {
  View,
  Text as RNText,
  TextInput as RNTextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useController, UseControllerProps} from 'react-hook-form';
import _ from 'lodash';

import CustomeLoading from '../CustomeLoading';
import styles from './styles';

interface ItemType {
  description: string;
  place_id: string;
  // ...các trường khác nếu có
}

interface CustomeTextInPutProps extends UseControllerProps {
  placeholder?: string;
  minChars?: number;
  fetchApi?: (query: string) => Promise<ItemType[]>;

  // Callback "báo" ra ngoài khi user chọn/xoá chọn
  onItemSelected?: (item: ItemType) => void; // khi user chọn 1 item
  onItemCleared?: () => void; // khi user gõ lại => clear chọn
  isActive?: boolean;
}

const CustomeTextInPut: React.FC<CustomeTextInPutProps> = ({
  placeholder,
  minChars = 6,
  fetchApi,
  control,
  name,
  rules,
  onItemSelected,
  onItemCleared,
  isActive = true,
}) => {
  // React Hook Form
  const {
    field: {onChange, onBlur, value},
    fieldState: {error},
  } = useController({
    control,
    name,
    rules,
  });

  // Tạo ref cho TextInput
  const inputRef = useRef<RNTextInput>(null);

  // State
  const [isFocused, setIsFocused] = useState(false);
  const [dataDropdown, setDataDropdown] = useState<ItemType[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Debounce API call
  const debouncedCallApi = useCallback(
    _.debounce(async (query: string) => {
      if (!fetchApi) return;
      try {
        setIsLoading(true);
        const data = await fetchApi(query);
        setDataDropdown(data);
        setShowDropdown(true);
      } catch (err) {
        console.log('debouncedCallApi error', err);
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [],
  );

  // Xử lý khi text thay đổi
  const handleTextChange = (text: string) => {
    onChange(text);

    // Nếu đã chọn item trước đó -> user gõ lại => clear
    if (onItemCleared) {
      onItemCleared();
    }

    // Nếu đủ ký tự => call API
    if (text.trim().length >= minChars) {
      debouncedCallApi(text.trim());
    } else {
      setDataDropdown([]);
      setShowDropdown(false);
    }
  };

  // Khi user chọn 1 item trong dropdown
  const handleSelectItem = (item: ItemType) => {
    // Điền vào TextInput
    onChange(item.description);

    // Đóng dropdown sau khi chọn (nếu muốn vẫn giữ list thì bỏ dòng này)
    setShowDropdown(false);

    // Báo cho parent
    if (onItemSelected) {
      onItemSelected(item);
    }

    // *KHÔNG* blur TextInput, không setIsFocused(false) => giữ bàn phím mở
    // inputRef.current?.blur();    // Bỏ dòng này
    // setIsFocused(false);         // Bỏ dòng này
  };

  // Xoá toàn bộ chuỗi
  const clearText = () => {
    onChange('');
    setShowDropdown(false);
    setDataDropdown([]);
    if (onItemCleared) {
      onItemCleared();
    }
  };

  // Tính borderColor
  let borderColor = '#ccc';
  if (error) {
    borderColor = 'red';
  } else if (isFocused) {
    borderColor = '#1154FF';
  }

  return (
    <View style={styles.container}>
      {/* Loading overlay */}
      {isActive ? <CustomeLoading visible={isLoading} /> : null}

      {/* Input Wrapper */}
      <View style={[styles.inputWrapper, {borderColor}]}>
        {/* TextInput - gắn ref */}
        <RNTextInput
          ref={inputRef}
          style={styles.input}
          onChangeText={handleTextChange}
          onBlur={() => {
            setIsFocused(false);
            onBlur();
          }}
          onFocus={() => {
            setIsFocused(true);
            // Nếu input đã có text và có data => hiển thị dropdown
            if (_.trim(value).length > 0 && dataDropdown.length > 0) {
              setShowDropdown(true);
            }
          }}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#999"
        />

        {/* Nút X xóa text */}
        {_.trim(value).length > 0 ? (
          <TouchableOpacity
            style={styles.clearIconContainer}
            onPress={clearText}>
            <RNText style={styles.clearIconText}>X</RNText>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>

      {/* Hiển thị lỗi nếu có */}
      {error && <RNText style={styles.errorText}>{error.message}</RNText>}

      {/* Dropdown */}
      {showDropdown && dataDropdown.length > 0 && !isLoading && (
        <FlatList
          data={dataDropdown}
          keyExtractor={(item, index) => `${item.place_id}-${index}`}
          style={styles.dropdown}
          // QUAN TRỌNG: để giữ bàn phím khi bấm item
          keyboardShouldPersistTaps="always"
          // Hoặc "handled" => tuỳ nhu cầu
          // keyboardDismissMode="none" // nếu muốn chặn luôn kéo list mà đóng keyboard
          renderItem={({item}) => (
            <TouchableOpacity onPress={() => handleSelectItem(item)}>
              <RNText style={styles.dropdownItem}>{item.description}</RNText>
              <View style={styles.divider} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default CustomeTextInPut;
