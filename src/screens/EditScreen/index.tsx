import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Platform,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUserMeApi from '@/api/UserMe';
import useUploadImageApi from '@/api/UploadBase64';
import {CustomeLoading} from '@/components';
import useUserUpdateApi from '@/api/UploadMe';

const EditScreen = () => {
  const navigation = useNavigation();
  const {data, isLoading: isUserLoading} = useUserMeApi(true);
  const {mutate: uploadImage, isPending: isUploading} = useUploadImageApi();
  const {
    mutate: updateUser,
    isPending: isUpdating,
    isError,
    error,
  } = useUserUpdateApi();

  // State management
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [avatar, setAvatar] = useState(null); // Lưu full URL từ API
  const [avatarFilename, setAvatarFilename] = useState(null); // Lưu filename để gửi khi update
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (data?.data) {
      const user = data.data;
      const newInitial = {
        name: user.name || '',
        phone_number: user.phone_number || '',
        email: user.email || '',
        address: user.address || '',
        avatar: user.avatar || null,
      };
      setFullName(newInitial.name);
      setPhoneNumber(newInitial.phone_number);
      setEmail(newInitial.email);
      setAddress(newInitial.address);
      setAvatar(newInitial.avatar);
      // Giả sử avatar ban đầu là URL đầy đủ, không lưu filename từ đây
      setAvatarFilename(null); // Filename chỉ được set khi upload ảnh mới
      setInitialData(newInitial);
    }
  }, [data?.data]);

  // Check changes
  const hasChanges = useMemo(
    () =>
      fullName !== initialData.name ||
      phoneNumber !== initialData.phone_number ||
      email !== initialData.email ||
      address !== initialData.address ||
      avatar !== initialData.avatar,
    [fullName, phoneNumber, email, address, avatar, initialData],
  );

  // Image upload handler
  const handleChoosePhoto = useCallback(async () => {
    try {
      // Permission handling
      if (Platform.OS === 'android') {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
        if (status !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Required', 'Please allow access to photos');
          return;
        }
      } else {
        const photoPermission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (photoPermission !== RESULTS.GRANTED) {
          const requestResult = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
          if (requestResult !== RESULTS.GRANTED) {
            Alert.alert('Permission Required', 'Please allow access to photos');
            return;
          }
        }
      }

      // Image picker
      launchImageLibrary(
        {
          mediaType: 'photo',
          includeBase64: true,
          quality: 0.8,
          maxWidth: 500,
          maxHeight: 500,
        },
        response => {
          if (
            response.didCancel ||
            response.errorCode ||
            !response.assets?.[0]?.base64
          ) {
            if (!response.didCancel)
              Alert.alert('Error', 'Failed to select image');
            return;
          }

          const file = response.assets[0];
          uploadImage(
            {filename: `avatar_${Date.now()}.jpg`, base64: file.base64},
            {
              onSuccess: res => {
                if (res.status === 'success') {
                  setAvatar(res.url); // Lưu URL đầy đủ để hiển thị
                  setAvatarFilename(res.filename); // Lưu filename để gửi khi update
                  Alert.alert(
                    'Success',
                    'Image uploaded! Tap "Save Changes" to confirm.',
                  );
                }
              },
              onError: err => {
                Alert.alert(
                  'Error',
                  `Upload failed: ${err.message || 'Unknown error'}`,
                );
              },
            },
          );
        },
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to access photo library');
    }
  }, [uploadImage]);

  // Save changes handler
  const handleSave = useCallback(() => {
    if (!hasChanges) {
      Alert.alert('Info', 'No changes to save');
      return;
    }

    const payload = {};
    if (fullName !== initialData.name) payload.name = fullName;
    if (phoneNumber !== initialData.phone_number)
      payload.phone_number = phoneNumber;
    if (email !== initialData.email) payload.email = email;
    if (address !== initialData.address) payload.address = address;
    if (avatar !== initialData.avatar && avatarFilename)
      payload.avatar = avatarFilename; // Chỉ gửi filename

    updateUser(payload, {
      onSuccess: response => {
        setInitialData(prev => ({...prev, ...payload, avatar})); // Cập nhật initialData, giữ avatar là URL
        Alert.alert('Success', 'Profile updated!', [
          {text: 'OK', onPress: () => navigation.goBack()},
        ]);
      },
      onError: err => {
        Alert.alert('Error', err.message || 'Update failed');
      },
    });
  }, [
    hasChanges,
    initialData,
    fullName,
    phoneNumber,
    email,
    address,
    avatar,
    avatarFilename,
    navigation,
    updateUser,
  ]);

  if (isUserLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      extraHeight={200}>
      {/* Avatar Section */}
      <View style={styles.avatarWrapper}>
        {isUploading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <Image
            source={avatar ? {uri: avatar} : require('@icons/user.png')}
            style={styles.avatar}
          />
        )}
        <TouchableOpacity
          style={styles.plusIconContainer}
          onPress={handleChoosePhoto}
          disabled={isUploading || isUpdating}>
          <Text style={styles.plusIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.fieldContainer}>
        {[
          {
            label: 'Full name',
            value: fullName,
            setter: setFullName,
            key: 'name',
          },
          {
            label: 'Phone number',
            value: phoneNumber,
            setter: setPhoneNumber,
            key: 'phone',
            keyboardType: 'phone-pad',
          },
          {
            label: 'Email',
            value: email,
            setter: setEmail,
            key: 'email',
            keyboardType: 'email-address',
          },
          {
            label: 'Address',
            value: address,
            setter: setAddress,
            key: 'address',
          },
        ].map(field => (
          <View key={field.key} style={styles.detailItem}>
            <Text style={styles.detailLabel}>{field.label}</Text>
            <View style={styles.detailBox}>
              <TextInput
                style={styles.detailInput}
                value={field.value}
                onChangeText={field.setter}
                placeholder={`Enter ${field.label.toLowerCase()}`}
                keyboardType={field.keyboardType || 'default'}
                editable={!isUpdating && !isUploading}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Save Button */}
      {hasChanges && (
        <TouchableOpacity
          style={[styles.saveButton, isUpdating && styles.disabledButton]}
          onPress={handleSave}
          disabled={isUpdating || isUploading}>
          <Text style={styles.saveButtonText}>
            {isUpdating ? 'Saving...' : 'Save Changes'}
          </Text>
        </TouchableOpacity>
      )}

      <CustomeLoading
        visible={isUpdating}
        overlayOpacity={0.5}
        spinnerColor="#fff"
        backgroundColor="#333"
      />
    </KeyboardAwareScrollView>
  );
};

// Styles (giữ nguyên)
const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  scrollContainer: {paddingBottom: 100},
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
    position: 'relative',
  },
  avatar: {width: '100%', height: '100%', resizeMode: 'cover'},
  plusIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#007bff',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusIcon: {color: 'white', fontSize: 20},
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {backgroundColor: '#gray', opacity: 0.6},
  saveButtonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  fieldContainer: {marginTop: 20},
  detailItem: {marginBottom: 20},
  detailLabel: {
    fontSize: 15,
    color: '#000',
    fontWeight: '500',
    marginBottom: 8,
  },
  detailBox: {
    backgroundColor: '#F6F8FB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  detailInput: {fontSize: 16, color: '#000'},
});

export default EditScreen;
