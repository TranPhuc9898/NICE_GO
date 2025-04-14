// // storage.ts
// import {MMKV} from 'react-native-mmkv';

// // Khởi tạo một instance của MMKV
// const storage = new MMKV();

// // Định nghĩa các key để sử dụng trong ứng dụng
// export const STORAGE_KEYS = {
//   FIRST_DATA: 'FIRST_DATA',
//   SECOND_DATA: 'SECOND_DATA',
// };

// // Hàm lưu trữ dữ liệu
// export const saveData = (key: string, value: string) => {
//   storage.set(key, value);
// };

// // Hàm lấy dữ liệu
// export const getData = (key: string): string | undefined => {
//   return storage.getString(key);
// };

// // Hàm xóa dữ liệu
// export const removeData = (key: string) => {
//   storage.delete(key);
// };
