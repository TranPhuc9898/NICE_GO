// src/services/networkState.ts
import NetInfo, {NetInfoState} from '@react-native-community/netinfo';
import {EventEmitter} from 'events';

type NetworkState = {
  isConnected: boolean;
  isInternetReachable: boolean;
};

let networkState: NetworkState = {
  isConnected: false,
  isInternetReachable: false,
};

const emitter = new EventEmitter();

// Khởi tạo network listener
const unsubscribeNetInfo = NetInfo.addEventListener((state: NetInfoState) => {
  const newState = {
    isConnected: !!state.isConnected,
    isInternetReachable: !!state.isInternetReachable,
  };

  if (
    newState.isConnected !== networkState.isConnected ||
    newState.isInternetReachable !== networkState.isInternetReachable
  ) {
    networkState = newState;
    emitter.emit('change', networkState);
  }
});

// Fetch trạng thái ban đầu
const initializeNetworkState = async () => {
  const state = await NetInfo.fetch();
  networkState = {
    isConnected: !!state.isConnected,
    isInternetReachable: !!state.isInternetReachable,
  };
};

initializeNetworkState();

export const NetworkService = {
  get currentState() {
    return networkState;
  },
  subscribe(callback: (state: NetworkState) => void) {
    emitter.on('change', callback);
    return () => emitter.off('change', callback);
  },
  cleanup() {
    unsubscribeNetInfo();
  },
};
