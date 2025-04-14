import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en';
import vi from './locales/vi';

// Import các file JSON

// Tạo hàm load language từ AsyncStorage
const LANGUAGE_PERSIST_KEY = 'appLanguage';

const getStoredLanguage = async () => {
  try {
    const lang = await AsyncStorage.getItem(LANGUAGE_PERSIST_KEY);
    return lang || 'en'; // default là 'vi' hoặc 'en'
  } catch (error) {
    return 'en';
  }
};

export const setStoredLanguage = async (lang: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_PERSIST_KEY, lang);
  } catch (error) {
    console.log('Error saving language', error);
  }
};

// Khởi tạo i18n
// (Để chắc chắn mọi thứ chạy, ta thường tạo 1 hàm initI18n, hoặc chạy sẵn tại file này)
export const initI18n = async () => {
  const savedLanguage = await getStoredLanguage(); // lấy ngôn ngữ đang lưu

  return i18n.use(initReactI18next).init({
    compatibilityJSON: 'v4', // Cần cho RN
    lng: savedLanguage, // ngôn ngữ mặc định
    fallbackLng: 'en', // fallback
    resources: {
      en: {translation: en},
      vi: {translation: vi},
    },
    interpolation: {
      escapeValue: false, // not needed for react
    },
  });
};

export default i18n;
