import 'react-native-devsettings';
import 'react-native-devsettings/withAsyncStorage';
import React, {useEffect, useState} from 'react';
import {LogBox, Platform, ActivityIndicator, View} from 'react-native';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {AuthProvider} from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
// ────────────────────────────────────────────────────────────────────────────
import {
  checkPermissions,
  createDefaultChannel,
  getFCMToken,
  onMessageListener,
  requestUserPermission,
  setBackgroundMessageHandler,
} from '@/services/NotificationService';
import {PersistGate} from 'redux-persist/integration/react';
import {I18nextProvider} from 'react-i18next';
import i18n, {initI18n} from '@/i18n';
import {CustomNetInfo} from '@/components';
import Toast from 'react-native-toast-message';

// Import NetInfoComponent

const queryClient = new QueryClient();

const App = (): React.JSX.Element => {
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);

  useEffect(() => {
    LogBox.ignoreAllLogs(); // Tắt toàn bộ warning

    // Khởi tạo i18n
    (async () => {
      await initI18n();
      setIsI18nInitialized(true);
    })();

    const initializeNotifications = async () => {
      try {
        // 1. Tạo notification channel cho Android
        if (Platform.OS === 'android') {
          await createDefaultChannel();
        }

        // 2. Kiểm tra và yêu cầu quyền notification
        const hasPermission = await checkPermissions();
        if (!hasPermission) {
          const permissionGranted = await requestUserPermission();
          if (!permissionGranted) {
            // Nếu user từ chối thì dừng.
            return;
          }
        }

        // 3. Lấy FCM Token
        const fcmToken = await getFCMToken();
        if (!fcmToken) {
          // Có thể xử lý tiếp nếu cần
        }

        // 4. Lắng nghe foreground messages
        const unsubscribe = onMessageListener();

        // 5. Xử lý background messages
        setBackgroundMessageHandler();

        // Cleanup foreground listener khi unmount
        return () => {
          unsubscribe();
        };
      } catch (err) {
        console.error('Error in initializeNotifications:', err);
      }
    };

    // initializeNotifications();
  }, []);

  // Nếu i18n chưa init xong -> return loading
  if (!isI18nInitialized) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // Bọc toàn bộ app trong I18nextProvider
  return (
    <I18nextProvider i18n={i18n}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{flex: 1}}>
            <NavigationContainer>
              <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                  <AuthProvider>
                    <BottomSheetModalProvider>
                      <RootNavigator />
                      <Toast />
                    </BottomSheetModalProvider>
                  </AuthProvider>
                </PersistGate>
              </Provider>
            </NavigationContainer>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </SafeAreaProvider>
    </I18nextProvider>
  );
};

export default App;
