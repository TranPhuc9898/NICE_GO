// src/components/CustomHeader.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

interface CustomHeaderProps {
  title: string;
  rightIconSource?: any;
  onRightIconPress?: () => void;
  isShowLeftIcon?: boolean;
  isShowRightIcon?: boolean; // Props mới để bật/tắt icon bên phải
}

const CustomHeader: React.FC<CustomHeaderProps> = ({
  title,
  rightIconSource,
  onRightIconPress,
  isShowLeftIcon = true,
  isShowRightIcon = false,
}) => {
  const navigation = useNavigation();

  // Đảm bảo đường dẫn ảnh Back đúng
  const backIcon = require('../../assets/icons/back.png');

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.container}>
        {/** Left Icon: Nếu isShowLeftIcon là true thì hiển thị nút Back, ngược lại để placeholder */}
        {isShowLeftIcon ? (
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.iconContainer}>
            <Image source={backIcon} style={styles.icon} />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        {/** Tiêu đề ở giữa */}
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/** Right Icon: Hiển thị nếu isShowRightIcon là true và có truyền rightIconSource */}
        {isShowRightIcon && rightIconSource ? (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconContainer}>
            <Image source={rightIconSource} style={styles.icon} />
          </TouchableOpacity>
        ) : (
          // Placeholder để giữ vị trí khi không có icon bên phải
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff', // Màu nền của header
    paddingBottom: 20,
  },
  container: {
    flexDirection: 'row', // Sắp xếp các phần theo hàng ngang
    alignItems: 'center', // Căn giữa theo chiều dọc
    justifyContent: 'space-between', // Phân bố không gian đều giữa các phần
    paddingHorizontal: 16, // Khoảng cách bên trái và phải
    paddingVertical: Platform.OS === 'ios' ? 12 : 8, // Khoảng cách trên và dưới, điều chỉnh cho iOS và Android
  },
  iconContainer: {
    width: 40, // Chiều rộng ô vuông
    height: 40, // Chiều cao ô vuông
    backgroundColor: '#e0e0e0', // Màu nền của ô vuông
    borderRadius: 8, // Góc bo tròn
    alignItems: 'center', // Căn giữa icon theo chiều ngang
    justifyContent: 'center', // Căn giữa icon theo chiều dọc
  },
  icon: {
    width: 24, // Chiều rộng icon
    height: 24, // Chiều cao icon
    tintColor: 'black', // Sử dụng tintColor để thay đổi màu sắc icon
  },
  title: {
    fontSize: 18, // Kích thước chữ
    fontWeight: 'bold', // Độ đậm của chữ
    textAlign: 'center', // Căn giữa chữ
    flex: 1, // Giúp title chiếm không gian còn lại giữa hai icon
    marginHorizontal: 16, // Khoảng cách giữa title và các icon
  },
  iconPlaceholder: {
    width: 40, // Giữ vị trí của icon khi không hiển thị
  },
});

export default CustomHeader;
