import React, {useCallback, useRef, useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View, Platform} from 'react-native';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import BottomSheetComponent from '../BottomSheet';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {format as formatDateFns} from 'date-fns';
import {useTranslation} from 'react-i18next';

interface ControlDateTimePickerProps {
  label: string;
  onSelect: (date: Date) => void;
  mode?: 'date' | 'time';
  format?: string;
  locale?: string;
  size?: 'Mini' | 'Medium' | 'Large';
  error?: boolean;
  errorMessage?: string;
  initialValue?: Date;
}

const ControlDateTimePicker: React.FC<ControlDateTimePickerProps> = ({
  label,
  onSelect,
  mode = 'date',
  format,
  locale = 'en-US',
  size = 'Medium',
  error = false,
  errorMessage = '',
  initialValue,
}) => {
  const {t} = useTranslation();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [date, setDate] = useState<Date>(initialValue ?? new Date());
  const [validationError, setValidationError] = useState<string | null>(null);
  const IS_IOS = Platform.OS === 'ios';

  // Định nghĩa format hiển thị
  const dateFormat = format || (mode === 'date' ? 'dd/MM/yyyy' : 'HH:mm');
  // Placeholder hiển thị
  const placeholder = formatDateFns(new Date(), dateFormat);

  // Mở BottomSheet
  const openBottomSheet = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  // Xác nhận chọn
  const handleConfirm = useCallback(() => {
    if (!date) {
      setValidationError('*Trường này không được để trống');
      return;
    }

    // Kiểm tra quá khứ
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (date < today) {
      setValidationError('*Không được chọn ngày trong quá khứ');
      return;
    }

    // Hợp lệ
    setValidationError(null);
    onSelect(date);
    bottomSheetRef.current?.dismiss();
  }, [date, onSelect]);

  // Lắng nghe giá trị DateTimePicker
  const handleChange = useCallback(
    (event: DateTimePickerEvent, selectedDate?: Date) => {
      if (event.type === 'dismissed') {
        // Người dùng bấm hủy trên Android
        bottomSheetRef.current?.dismiss();
        return;
      }

      if (selectedDate) {
        // Nếu muốn chặn quá khứ ngay khi chọn:
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );
        if (mode === 'date' && selectedDate < today) {
          Alert.alert('Lỗi', 'Không được chọn ngày trong quá khứ.');
          return;
        }

        // Cập nhật state
        setDate(selectedDate);

        // Trên Android, nếu muốn auto đóng & chọn luôn sau khi pick:
        if (Platform.OS === 'android') {
          onSelect(selectedDate);
          bottomSheetRef.current?.dismiss();
        }
      }
    },
    [mode, onSelect],
  );
  // Chọn kiểu hiển thị date/time cho iOS
  const displayMode = () => {
    if (IS_IOS && mode === 'date') {
      return 'inline';
    }
    if (IS_IOS && mode === 'time') {
      return 'spinner';
    }
    return 'default';
  };

  // Tính xem date đã chọn có phải quá khứ không
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isInThePast = date && date < today;

  // Xác định màu chữ hiển thị
  const textStyle = !date
    ? styles.placeholderText // Chưa chọn => xám
    : isInThePast
    ? styles.errorSelectedText // Quá khứ => đỏ
    : styles.selectedText; // Hợp lệ => xanh

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity
        onPress={openBottomSheet}
        style={[
          styles.selector,
          styles[size],
          validationError
            ? styles.selectorError
            : date
            ? styles.selectorSelected
            : null,
        ]}>
        <Text style={textStyle}>
          {date ? formatDateFns(date, dateFormat) : placeholder}
        </Text>
      </TouchableOpacity>

      {validationError && (
        <Text style={styles.errorText}>{validationError}</Text>
      )}

      <BottomSheetComponent
        enablePanDownToClose={false}
        ref={bottomSheetRef}
        content={
          <View style={styles.sheetContent}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <DateTimePicker
              value={date || new Date()}
              mode={mode}
              display={displayMode()}
              onChange={handleChange}
              locale={locale}
              themeVariant="light"
              minimumDate={mode === 'date' ? today : undefined}
              // style={styles.datePicker}
            />
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

export default ControlDateTimePicker;

const styles = StyleSheet.create({
  container: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  label: {
    fontSize: 14,
    paddingBottom: 5,
    color: '#666',
    fontWeight: 'bold',
  },
  selector: {
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  Mini: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 12,
    width: '100%',
  },
  Medium: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: '100%',
    fontSize: 14,
  },
  Large: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    fontSize: 16,
    width: '100%',
  },
  // Khi có giá trị date => border xanh
  selectorSelected: {
    borderColor: '#1154FF',
  },
  // Khi xác nhận sai => border đỏ
  selectorError: {
    borderColor: 'red',
  },

  // Text màu xanh (chọn ngày hợp lệ)
  selectedText: {
    color: '#1154FF',
  },
  // Text placeholder
  placeholderText: {
    color: '#898989',
  },
  // Text ngày quá khứ => đỏ
  errorSelectedText: {
    color: 'red',
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
    fontSize: 10,
  },
});
