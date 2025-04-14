import React from 'react';
import {View, ActivityIndicator, StyleSheet, Modal} from 'react-native';

interface LoadingOverlayProps {
  visible: boolean; // Hiển thị hoặc ẩn overlay
}

const CustomeLoading: React.FC<LoadingOverlayProps> = ({visible}) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      statusBarTranslucent={true}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#1154FF" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Làm mờ nền
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomeLoading;
