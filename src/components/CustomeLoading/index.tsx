import {spacing} from '@/constants';
import React from 'react';
import {
  Modal,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
  Dimensions,
} from 'react-native';

interface CustomeLoadingProps {
  visible: boolean; // Bắt buộc, để bật/tắt loading
  message?: string; // Tùy chọn, text hiển thị bên dưới spinner
  overlayOpacity?: number; // Độ mờ của lớp overlay
  spinnerColor?: string; // Màu sắc spinner
  backgroundColor?: string; // Màu nền của khối loading
}

const CustomeLoading: React.FC<CustomeLoadingProps> = ({
  visible,
  message,
  overlayOpacity = 0.5,
  spinnerColor = '#fff',
  backgroundColor = '#333',
}) => {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent>
      <View
        style={[
          styles.overlay,
          {backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`},
        ]}>
        <View style={[styles.loadingBox, {backgroundColor}]}>
          <ActivityIndicator size="large" color={spinnerColor} />
          {message && <Text style={styles.message}>{message}</Text>}
        </View>
      </View>
    </Modal>
  );
};

export default CustomeLoading;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    width: spacing.SPACING_50 * 2,
    height: spacing.SPACING_50 * 2,
    paddingVertical: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Bóng đổ cho Android
  },
  message: {
    marginTop: 10,
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
