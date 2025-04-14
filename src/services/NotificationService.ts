import messaging from '@react-native-firebase/messaging';
import notifee, {AuthorizationStatus} from '@notifee/react-native';
import {Platform} from 'react-native';

// 1. Kiểm tra quyền notification
export const checkPermissions = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().hasPermission();
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      // console.log('Notification permissions are already granted.');
      return true;
    } else {
      // console.warn('Notification permissions are not granted.');
      return false;
    }
  } catch (err) {
    // console.error('Error checking notification permissions:', err);
    return false;
  }
};

// 2. Yêu cầu quyền notification
export const requestUserPermission = async (): Promise<boolean> => {
  try {
    const hasPermission = await checkPermissions();
    if (hasPermission) return true;

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === AuthorizationStatus.AUTHORIZED ||
      authStatus === AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permissions granted.');
      return true;
    } else {
      console.warn('Notification permissions denied.');
      return false;
    }
  } catch (err) {
    console.error('Error requesting notification permission:', err);
    return false;
  }
};

// 3. Lấy FCM Token
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Đăng ký device trước khi lấy token
    await messaging().registerDeviceForRemoteMessages();
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      console.log('FCM Token fetched:', fcmToken);
      return fcmToken;
    } else {
      console.warn('No FCM Token found.');
      return null;
    }
  } catch (err) {
    console.error('Error fetching FCM token:', err);
    return null;
  }
};

// 4. Lắng nghe message ở foreground
export const onMessageListener = () => {
  return messaging().onMessage(async remoteMessage => {
    console.log('Foreground message received:', remoteMessage);

    try {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'No title',
        body: remoteMessage.notification?.body || 'No body',
        android: {
          channelId: 'default',
        },
      });
    } catch (err) {
      console.error('Error displaying notification in foreground:', err);
    }
  });
};

// 5. Xử lý background messages
export const setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Background message received:', remoteMessage);

    try {
      await notifee.displayNotification({
        title: remoteMessage.notification?.title || 'No title',
        body: remoteMessage.notification?.body || 'No body',
        android: {
          channelId: 'default',
        },
      });
    } catch (err) {
      console.error('Error displaying background notification:', err);
    }
  });
};

// 6. Hiển thị local notification tuỳ chỉnh
export const displayLocalNotification = async (title: string, body: string) => {
  try {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: 'default',
      },
    });
    console.log('Local notification displayed.');
  } catch (err) {
    console.error('Error displaying local notification:', err);
  }
};

// 7. Tạo channel cho Android
export const createDefaultChannel = async () => {
  if (Platform.OS === 'android') {
    try {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Notification Channel',
        importance: 4, // HIGH importance
      });
      console.log('Default notification channel created -> ID:', channelId);
    } catch (err) {
      console.error('Error creating notification channel:', err);
    }
  }
};

// 8. Khởi tạo notifications (combine all steps)
export const initializeNotifications = async () => {
  try {
    await createDefaultChannel();
    const permissionGranted = await requestUserPermission();

    if (permissionGranted) {
      const fcmToken = await getFCMToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
      }
    }

    onMessageListener();
    setBackgroundMessageHandler();
  } catch (err) {
    console.error('Error initializing notifications:', err);
  }
};
