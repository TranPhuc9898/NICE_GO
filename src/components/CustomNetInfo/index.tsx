import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  Text,
  StyleSheet,
  AppState,
  AppStateStatus,
  useWindowDimensions,
} from 'react-native';
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import BottomSheetComponent from '../BottomSheet';

type ConnectionStatus = {
  isConnected: boolean | null;
  isInternetReachable: boolean | null;
};

const CustomNetInfo = () => {
  const {height} = useWindowDimensions();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: null,
    isInternetReachable: null,
  });
  const [showSheet, setShowSheet] = useState(false);
  const sheetRef = useRef<BottomSheetModal>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isMounted = useRef(true);
  const hasShownInitialSheet = useRef(false); // Thêm ref này
  const previousStatus = useRef<ConnectionStatus>(connectionStatus); // Thêm ref tracking trạng thái trước đó

  const hasNetworkInfo =
    connectionStatus.isConnected !== null &&
    connectionStatus.isInternetReachable !== null;

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(
      (state: NetInfoState) => {
        if (isMounted.current) {
          setConnectionStatus({
            isConnected: state.isConnected,
            isInternetReachable: state.isInternetReachable,
          });
        }
      },
    );

    const fetchInitialState = async () => {
      const state = await NetInfo.fetch();
      if (isMounted.current) {
        setConnectionStatus({
          isConnected: state.isConnected,
          isInternetReachable: state.isInternetReachable,
        });
      }
    };

    fetchInitialState();

    return () => {
      isMounted.current = false;
      unsubscribeNetInfo();
    };
  }, []);

  // Logic hiển thị sheet mới
  useEffect(() => {
    if (!hasNetworkInfo) return;

    const isOnline =
      connectionStatus.isConnected && connectionStatus.isInternetReachable;

    const wasOnline =
      previousStatus.current.isConnected &&
      previousStatus.current.isInternetReachable;

    // Chỉ show khi có thay đổi trạng thái và không phải lần đầu
    if (isOnline !== wasOnline || !hasShownInitialSheet.current) {
      if (isOnline) {
        // Không hiện sheet khi lần đầu có mạng
        if (!hasShownInitialSheet.current) {
          hasShownInitialSheet.current = true;
          return;
        }

        setShowSheet(true);
        timeoutRef.current = setTimeout(() => setShowSheet(false), 3000);
      } else {
        setShowSheet(true);
      }

      hasShownInitialSheet.current = true;
    }

    previousStatus.current = connectionStatus;

    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [connectionStatus, hasNetworkInfo]);

  useEffect(() => {
    const handleAppStateChange = (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        NetInfo.fetch().then(state => {
          if (isMounted.current) {
            setConnectionStatus({
              isConnected: state.isConnected,
              isInternetReachable: state.isInternetReachable,
            });
          }
        });
      }
    };

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!hasNetworkInfo) return;

    if (showSheet) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [showSheet, hasNetworkInfo]);

  const renderContent = useCallback(
    () => (
      <Text style={styles.contentText}>
        {connectionStatus.isConnected
          ? 'Internet connected 🎉'
          : 'No internet connection 😢'}
      </Text>
    ),
    [connectionStatus.isConnected],
  );

  if (!hasNetworkInfo) return null;

  return (
    <BottomSheetComponent
      ref={sheetRef}
      content={renderContent()}
      enablePanDownToClose={!!connectionStatus.isConnected}
      snapPoints={['8%']}
      style={[
        styles.sheet,
        {
          backgroundColor: connectionStatus.isConnected ? '#4CAF50' : '#757575',
          maxHeight: height * 0.1,
        },
      ]}
      onDismiss={() => setShowSheet(false)}
    />
  );
};

const styles = StyleSheet.create({
  sheet: {
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  contentText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default CustomNetInfo;
