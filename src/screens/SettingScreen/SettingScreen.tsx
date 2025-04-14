import React, {useRef, useState, useMemo} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

import {setUserRole} from '@/redux/slice/UserSlice/UserSlice';
import {RootState} from '@/redux/store';
import {BottomSheetComponent} from '@/components';
import useLogoutAPI from '@/api/Auth/LogOut';

// Thư viện i18n
import i18n from '@/i18n';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const roles = ['user', 'driver', 'partner'];

// Mảng ngôn ngữ
const languages = [
  {label: 'English', code: 'en'},
  {label: 'Tiếng Việt', code: 'vi'},
];

const SettingScreen = () => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const roleIndex = useSelector((state: RootState) => state.user.role_index);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [isVisible, setIsVisible] = useState(false);

  // State + ref cho BottomSheet Language
  const bottomSheetLangRef = useRef<BottomSheetModal>(null);
  const [isVisibleLang, setIsVisibleLang] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const {logout} = useLogoutAPI(); // Sử dụng mutateAsync trong logout

  // Dùng useFocusEffect để đóng BottomSheet khi màn hình mất focus
  useFocusEffect(
    React.useCallback(() => {
      return () => {
        bottomSheetRef.current?.dismiss();
        bottomSheetLangRef.current?.dismiss();
      };
    }, []),
  );

  // Mở/đóng BottomSheet Role
  const openBottomSheet = () => {
    setIsVisible(true);
    bottomSheetRef.current?.present();
  };
  const closeBottomSheet = () => {
    setIsVisible(false);
    bottomSheetRef.current?.dismiss();
  };

  // Mở/đóng BottomSheet Language
  const openBottomSheetLang = () => {
    setIsVisibleLang(true);
    bottomSheetLangRef.current?.present();
  };
  const closeBottomSheetLang = () => {
    setIsVisibleLang(false);
    bottomSheetLangRef.current?.dismiss();
  };

  // Chọn Role
  const selectRole = (role: string) => {
    closeBottomSheet();
    dispatch(setUserRole(role));
  };

  // Chọn Language
  const selectLanguage = (langCode: string) => {
    closeBottomSheetLang();
    i18n.changeLanguage(langCode);
  };

  // Render item Role
  const renderItem = ({item}: {item: string}) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => selectRole(item)}>
      <Text
        style={[
          styles.optionText,
          roleIndex === item && styles.selectedOptionText,
        ]}>
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  // Render item Language
  const renderLanguageItem = ({
    item,
  }: {
    item: {label: string; code: string};
  }) => (
    <TouchableOpacity
      style={styles.optionContainer}
      onPress={() => selectLanguage(item.code)}>
      <Text
        style={[
          styles.optionText,
          i18n.language === item.code && styles.selectedOptionText,
        ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  // content cho BottomSheet Role
  const content = useMemo(
    () => (
      <FlatList
        data={roles}
        keyExtractor={item => item}
        renderItem={renderItem}
      />
    ),
    [roleIndex],
  );

  // content cho BottomSheet Language
  const languageContent = useMemo(
    () => (
      <FlatList
        data={languages}
        keyExtractor={item => item.code}
        renderItem={renderLanguageItem}
      />
    ),
    [i18n.language],
  );

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

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (isVisible) {
          closeBottomSheet();
        }
        if (isVisibleLang) {
          closeBottomSheetLang();
        } else {
          Keyboard.dismiss();
        }
      }}>
      <View style={styles.container}>
        {/* Card chọn Role */}
        <TouchableOpacity style={styles.card} onPress={openBottomSheet}>
          <Text style={styles.cardTitle}>{t('SETTING_SCREEN.ROLE_TITLE')}</Text>
          <Text style={styles.cardValue}>
            {roleIndex.charAt(0).toUpperCase() + roleIndex.slice(1)}
          </Text>
        </TouchableOpacity>

        {/* Card chọn Language */}
        <TouchableOpacity style={styles.card} onPress={openBottomSheetLang}>
          <Text style={styles.cardTitle}>
            {t('SETTING_SCREEN.LANGUAGE_TITLE')}
          </Text>
          <Text style={styles.cardValue}>
            {i18n.language === 'en' ? 'English' : 'Tiếng Việt'}
          </Text>
        </TouchableOpacity>

        {/* Card Logout */}
        <TouchableOpacity
          style={styles.logoutCard}
          onPress={handleLogout}
          disabled={isLoading}>
          <Text style={styles.logoutText}>
            {isLoading
              ? t('SETTING_SCREEN.LOGGING_OUT')
              : t('SETTING_SCREEN.LOGOUT')}
          </Text>
        </TouchableOpacity>

        {/* BottomSheet cho Role */}
        <BottomSheetComponent ref={bottomSheetRef} content={content} />
        {/* BottomSheet cho Language */}
        <BottomSheetComponent
          ref={bottomSheetLangRef}
          content={languageContent}
        />

        {/* Modal loading hiển thị ActivityIndicator khi logout */}
        <Modal transparent={true} animationType="fade" visible={isLoading}>
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#1154FF" />
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    color: '#555',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1154FF',
  },
  optionContainer: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
  },
  selectedOptionText: {
    color: '#1154FF',
    fontWeight: 'bold',
  },
  logoutCard: {
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
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
