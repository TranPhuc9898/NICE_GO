import {configureStore, combineReducers} from '@reduxjs/toolkit';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import tabBarReducer from '../slice/tabBar-slice';
import PickUpReducer from '../slice/PickUpSlice/PickUpSlice';
import orderListReducer from '../slice/OrderListSlice/OrderListSlice';
import userListReducer from '../slice/UserSlice/UserSlice';
import coordinateReducer from '../slice/CoordinateSlice/CoordinateSlice';

// Cấu hình redux-persist
const persistConfig = {
  key: 'root', // Key để lưu trữ
  storage: AsyncStorage, // Sử dụng AsyncStorage
  whitelist: ['user'], // Chỉ lưu trạng thái của 'user'. Bạn có thể thêm các reducer khác nếu muốn
};

// Kết hợp reducers
const rootReducer = combineReducers({
  tabBar: tabBarReducer,
  pickUp: PickUpReducer,
  orderList: orderListReducer,
  user: userListReducer,
  coordinate: coordinateReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Cấu hình store với persistedReducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REGISTER'],
        ignoredPaths: ['someLargeData'], // cắt bớt mảng/obj to
      },
    }),
});

const persistor = persistStore(store); // Tạo persistor

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export {store, persistor};
