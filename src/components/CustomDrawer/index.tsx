import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Modal,
} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {useTranslation} from 'react-i18next';
import useUserMeApi from '@/api/UserMe';
import ImageViewer from 'react-native-image-zoom-viewer';

const CustomDrawer = (props: any) => {
  const {t} = useTranslation();
  const {data, isLoading, isError} = useUserMeApi(true);

  // Lấy dữ liệu người dùng từ API
  const userData = data?.data;
  console.log('🚀 ~ CustomDrawer ~ userData:', userData);

  // Nếu có avatar => sử dụng, không thì dùng mặc định
  const avatarSource = userData?.avatar
    ? {uri: userData.avatar}
    : require('@icons/user.png');

  const hasAvatar = userData?.avatar && userData.avatar !== '';

  // State để điều khiển modal zoom ảnh
  const [isImageViewerVisible, setImageViewerVisible] = useState(false);

  // Danh sách menu items
  const menuItems = [
    {
      key: 'Home',
      label: 'Home',
      icon: require('@icons/home-button.png'),
    },
    {
      key: 'Settings',
      label: 'Settings',
      icon: require('@icons/gear.png'),
    },
    {
      key: 'Profile',
      label: 'Profile',
      icon: require('@icons/user.png'),
    },
  ];

  const handleLogout = () => {
    // Xử lý logout ở đây
    console.log('Logging out...');
  };

  // Trong quá trình load hay xảy ra lỗi, bạn có thể hiển thị UI tương ứng
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error loading user data</Text>
      </View>
    );
  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      {/* HEADER - Hiển thị avatar và tên */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={() => {
            if (hasAvatar) setImageViewerVisible(true); // Chỉ mở zoom khi có avatar
          }}>
          <Image
            source={avatarSource}
            style={hasAvatar ? styles.avatar : styles.avatar2}
          />
        </TouchableOpacity>
        <Text style={styles.userName}>
          {userData?.name ? userData.name : 'User Name'}
        </Text>
      </View>

      {/* MENU ITEM LIST */}
      <View style={{flex: 1}}>
        {menuItems.map((item, index) => {
          const isFocused = props.state?.index === index;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.menuItem, isFocused && styles.activeItem]}
              onPress={() => props.navigation.navigate(item.key)}>
              <Image
                source={item.icon}
                style={[styles.icon, isFocused && styles.activeIcon]}
              />
              <Text style={[styles.menuText, isFocused && styles.activeText]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Modal để zoom ảnh */}
      {hasAvatar && (
        <Modal
          visible={isImageViewerVisible}
          transparent={true}
          onRequestClose={() => setImageViewerVisible(false)}>
          <ImageViewer
            imageUrls={[{url: userData.avatar}]} // Đưa URL avatar vào mảng
            onCancel={() => setImageViewerVisible(false)}
            enableSwipeDown={true}
            saveToLocalByLongPress={true} // Cho phép lưu ảnh khi nhấn giữ
            renderIndicator={() => null}
          />
        </Modal>
      )}
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Khi có avatar data
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // Khi không có avatar, hiển thị nhỏ hơn (70% của avatarWrapper)
  avatar2: {
    width: '70%',
    height: '70%',
    resizeMode: 'cover',
  },
  userName: {
    color: '#000',
    fontSize: 17,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 8,
    marginTop: 4,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 15,
    tintColor: '#333',
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  activeItem: {
    backgroundColor: '#f0f0f0',
  },
  activeText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  activeIcon: {
    tintColor: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
