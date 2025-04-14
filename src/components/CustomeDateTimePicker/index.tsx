import React, {useCallback, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Alert,
} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import BottomSheetComponent from '../BottomSheet';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {format as formatDateFns} from 'date-fns';
import {useTranslation} from 'react-i18next';

type DateErrorType = 'NONE' | 'EMPTY' | 'PAST';

interface ControlDateTimePickerProps {
  label: string;
  onSelect: (date: Date) => void;
  dateErrorType?: DateErrorType;
  mode?: 'date' | 'time';
  format?: string;
  locale?: string;
  width?: any;
}

const CustomeDateTimePicker: React.FC<ControlDateTimePickerProps> = ({
  label,
  onSelect,
  dateErrorType = 'NONE',
  mode = 'date',
  format,
  locale = 'en-US',
  width,
}) => {
  const {t} = useTranslation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [date, setDate] = useState<Date | null>(new Date());

  const IS_IOS = Platform.OS === 'ios';
  const dateFormat = format || (mode === 'date' ? 'dd/MM/yyyy' : 'HH:mm');
  const placeholder = formatDateFns(new Date(), dateFormat);

  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleConfirm = useCallback(() => {
    if (date) onSelect(date);
    bottomSheetRef.current?.dismiss();
  }, [date, onSelect]);

  const handleChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === 'dismissed') {
        bottomSheetRef.current?.dismiss();
        return;
      }

      const currentDate = selectedDate || date;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (currentDate) {
        // Chỉ kiểm tra nếu ngày được chọn nhỏ hơn today (không bao gồm today)
        if (mode === 'date') {
          const selectedDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
          );

          if (selectedDay < today) {
            Alert.alert('Lỗi', 'Không được chọn ngày trong quá khứ.');
            return;
          }
        }

        setDate(currentDate);
        if (Platform.OS === 'android') {
          onSelect(currentDate);
          bottomSheetRef.current?.dismiss();
        }
      }
    },
    [date, mode, onSelect],
  );

  const displayMode = useCallback(() => {
    if (IS_IOS && mode === 'date') return 'inline';
    if (IS_IOS && mode === 'time') return 'spinner';
    return 'default';
  }, [IS_IOS, mode]);

  const renderDateErrorMessage = () => {
    switch (dateErrorType) {
      case 'EMPTY':
        return (
          <Text style={styles.errorText}>*Trường này không được để trống</Text>
        );
      case 'PAST':
        return (
          <Text style={styles.errorText}>
            *Không được chọn ngày trong quá khứ
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <View style={[styles.container, width]}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        onPress={openBottomSheet}
        style={[
          styles.selector,
          date ? styles.selectorSelected : styles.selectorDefault,
          dateErrorType !== 'NONE' && styles.selectorError,
        ]}>
        <Text style={date ? styles.selectedText : styles.placeholderText}>
          {date ? formatDateFns(date, dateFormat) : placeholder}
        </Text>
      </TouchableOpacity>

      {renderDateErrorMessage()}

      <BottomSheetComponent
        ref={bottomSheetRef}
        content={
          <View style={styles.sheetContent}>
            <Text style={styles.sheetTitle}>{label}</Text>
            {IS_IOS ? (
              <DateTimePicker
                textColor="#000"
                value={date || new Date()}
                mode={mode}
                display={displayMode()}
                onChange={handleChange}
                locale={locale}
                themeVariant="light"
                style={styles.datePicker}
              />
            ) : (
              <DateTimePicker
                value={date || new Date()}
                mode={mode}
                display="spinner"
                onChange={handleChange}
                locale={locale}
                themeVariant="light"
              />
            )}
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>
                {t('RESULT_SCREEN.CONFIRM')}
              </Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

export default CustomeDateTimePicker;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
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
    paddingHorizontal: 40,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  selectorDefault: {
    borderColor: '#000',
  },
  selectorSelected: {
    borderColor: '#1154FF',
  },
  selectorError: {
    borderColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedText: {
    color: '#000',
  },
  placeholderText: {
    color: '#888',
  },
  sheetContent: {
    padding: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  datePicker: {
    width: '100%',
  },
  confirmButton: {
    marginTop: 20,
    backgroundColor: '#1154FF',
    paddingVertical: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
    marginLeft: 20,
    fontSize: 12,
  },
});
