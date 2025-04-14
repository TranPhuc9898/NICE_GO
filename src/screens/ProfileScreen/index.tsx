import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal as RNModal,
  Alert,
} from 'react-native';
import Animated from 'react-native-reanimated';
import ImageViewer from 'react-native-image-zoom-viewer';
import useUserMeApi from '@/api/UserMe';
import useTabBarAnimation from '@/navigation/tabBarNavigation/useTabBarAnimation';
import useLogoutAPI from '@/api/Auth/LogOut';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';

const ProfileScreen = () => {
  const {scrollHandler} = useTabBarAnimation();
  const {data, isLoading, isError} = useUserMeApi(true);
  const {logout} = useLogoutAPI();
  const {t} = useTranslation();

  // State để điều khiển modal hiển thị ảnh
  const [isImageVisible, setIsImageVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isLoadingLogOut, setIsLoading] = useState(false);

  // Logout handler
  const handleLogout = () => {
    Alert.alert(
      t('SETTING_SCREEN.CONFIRM_LOGOUT_TITLE'),
      t('SETTING_SCREEN.CONFIRM_LOGOUT_MESSAGE'),
      [
        {
          text: t('SETTING_SCREEN.CONFIRM_LOGOUT_CANCEL'),
          style: 'cancel',
        },
        {
          text: t('SETTING_SCREEN.CONFIRM_LOGOUT_OK'),
          onPress: async () => {
            setIsLoading(true);
            try {
              // Sử dụng await cho mutateAsync để đảm bảo API gọi xong mới xử lý tiếp
              await logout();
              // Reset hasShownRoleModal về false khi logout
              await AsyncStorage.setItem('hasShownRoleModal', 'false');
            } catch (error) {
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
      {cancelable: true},
    );
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text>Error loading user data</Text>
      </View>
    );
  }

  const user = data.data;

  // Hàm xử lý khi nhấn vào avatar
  const handleImagePress = () => {
    setImageUrl(user.avatar || ''); // Nếu không có avatar thì để trống
    setIsImageVisible(true);
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}>
        {/* Header: Avatar + Tên user */}
        <TouchableOpacity
          style={styles.avatarWrapper}
          onPress={handleImagePress}>
          <Image
            source={
              user.avatar ? {uri: user.avatar} : require('@icons/user.png')
            }
            style={styles.avatar}
          />
        </TouchableOpacity>

        <Text style={styles.userName}>{user.name}</Text>

        {/* BẮT ĐẦU PHẦN USER DETAIL */}
        {/* Full name */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Full name</Text>
          <View style={styles.detailBox}>
            <Text style={styles.detailValue}>{user.name}</Text>
          </View>
        </View>

        {/* Phone number + icon edit */}
        <View style={styles.detailItem}>
          <View style={styles.labelWithIcon}>
            <Text style={styles.detailLabel}>Phone number</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('Edit phone number');
              }}>
              {/* <Image
                source={require('@icons/edit.png')}
                style={styles.editIcon}
              /> */}
            </TouchableOpacity>
          </View>
          <View style={styles.detailBox}>
            <Text style={styles.detailValue}>{user.phone_number}</Text>
          </View>
        </View>

        {/* Email */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Email</Text>
          <View style={styles.detailBox}>
            <Text style={styles.detailValue}>{user.email ?? ''}</Text>
          </View>
        </View>

        {/* Address */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Address</Text>
          <View style={styles.detailBox}>
            <Text style={styles.detailValue}>{user.address ?? ''}</Text>
          </View>
        </View>

        {/* Role */}
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Role</Text>
          <View style={styles.detailBox}>
            <Text style={styles.detailValue}>{user.role_index}</Text>
          </View>
        </View>

        {/* Card Logout */}
        <TouchableOpacity
          style={styles.logoutCard}
          onPress={handleLogout}
          disabled={isLoadingLogOut}>
          <Text style={styles.logoutText}>
            {isLoadingLogOut
              ? t('SETTING_SCREEN.LOGGING_OUT')
              : t('SETTING_SCREEN.LOGOUT')}
          </Text>
        </TouchableOpacity>
      </Animated.ScrollView>

      {/* Modal hiển thị ảnh phóng to */}
      <RNModal
        visible={isImageVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsImageVisible(false)}>
        <ImageViewer
          imageUrls={[{url: imageUrl}]} // Danh sách ảnh (ở đây chỉ có 1 ảnh)
          enableSwipeDown={true} // Cho phép vuốt xuống để đóng
          onSwipeDown={() => setIsImageVisible(false)} // Đóng modal khi vuốt xuống
          onCancel={() => setIsImageVisible(false)} // Đóng modal khi nhấn nút back
          renderIndicator={() => null} // Ẩn indicator (nếu không muốn hiển thị số ảnh)
        />
      </RNModal>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 20,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  detailItem: {
    marginBottom: 20,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    marginBottom: 8,
  },
  editIcon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  detailBox: {
    backgroundColor: '#F6F8FB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
  },
  logoutCard: {
    marginBottom: 10,
    backgroundColor: '#ff5252',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#ff1744',
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});
