import React, {useState} from 'react';
import {
  TextInput as RNTextInput,
  Text,
  View,
  StyleSheet,
  KeyboardTypeOptions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Controller, useFormContext} from 'react-hook-form';

// STYLES
import styles from './styles.ts';

interface TextInputProps {
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  type?: 'phone' | 'password' | 'text' | 'email' | 'name' | 'address'; // Thêm 'text' và 'email' vào loại
  showCountryCode?: boolean; // Props mới
}

const TextInPut: React.FC<TextInputProps> = ({
  name,
  placeholder,
  secureTextEntry = false,
  type,
  showCountryCode = false, // Giá trị mặc định là false
}) => {
  const {control, trigger} = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  const getKeyboardType = (type?: string): KeyboardTypeOptions => {
    switch (type) {
      case 'phone':
        return 'phone-pad';
      case 'email':
        return 'email-address';
      default:
        return 'default';
    }
  };

  const getLabelText = (type?: string): string => {
    switch (type) {
      case 'phone':
        return 'Phone Number';
      case 'password':
        return 'Password';
      case 'email':
        return 'Email';
      case 'name':
        return 'Name';
      case 'address':
        return 'Address';
      case 'text':
        return '';

      default:
        return '';
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: `${placeholder} is required`,
        ...(type === 'phone' && {
          pattern: {
            value: /^\d{10}$/,
            message: 'Phone number must consist of exactly 10 digits',
          },
        }),
        ...(type === 'password' && {
          minLength: {
            value: 6,
            message: 'Password must be at least 6 characters',
          },
        }),
        ...(type === 'text' && {
          maxLength: {
            value: 50,
            message: `${placeholder} no more than 50 characters`,
          },
        }),
        ...(type === 'email' && {
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email',
          },
        }),
      }}
      render={({field: {onChange, onBlur, value}, fieldState: {error}}) => {
        let borderColor = '#ccc';

        if (error) {
          borderColor = 'red';
        } else if (isFocused) {
          borderColor = '#8a2be2'; // Màu tím khi focus
        }

        const labelText = getLabelText(type);

        return (
          <View style={[styles.container]}>
            {labelText !== '' && <Text style={styles.label}>{labelText}</Text>}

            <View style={[styles.inputWrapper, {borderColor}]}>
              {showCountryCode && (
                <>
                  {/* Mã quốc gia và lá cờ */}
                  <TouchableOpacity style={styles.countryCodeWrapper}>
                    <View>
                      <Image
                        style={styles.flagContainer}
                        source={require('../../assets/image/vn.png')}
                      />
                    </View>
                    <Text style={styles.countryCode}>+84</Text>
                  </TouchableOpacity>

                  {/* Vạch thẳng đứng */}
                  <View style={styles.divider} />
                </>
              )}

              <RNTextInput
                style={[styles.input]}
                onBlur={() => {
                  setIsFocused(false);
                  onBlur();
                }}
                onFocus={() => {
                  setIsFocused(true);
                  trigger(name);
                }}
                onChangeText={onChange}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#999"
                secureTextEntry={secureTextEntry}
                keyboardType={getKeyboardType(type)}
              />
            </View>

            {error && <Text style={styles.errorText}>{error.message}</Text>}
          </View>
        );
      }}
    />
  );
};

export default TextInPut;
