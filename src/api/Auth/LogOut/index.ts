import {useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import callApi from '@/constants/callApi';
import {useMutation} from '@tanstack/react-query';
import {AuthContext} from '@/context/AuthContext';

// Tạo custom hook để logout
const useLogoutAPI = () => {
  const {signOut} = useContext(AuthContext); // Lấy signOut từ AuthContext

  const mutation = useMutation({
    mutationKey: ['Logout_API'],
    mutationFn: async () => {
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) {
        throw new Error('No token found');
      }

      // Gọi API logout
      const response = await callApi.get('/user/logout', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Có thể return response.data nếu cần xử lý thêm
      return response.data;
    },
    onSuccess: () => {
      // Xóa token và chuyển sang màn hình đăng nhập (hoặc reset state)
      signOut();
    },
  });

  // Dùng mutateAsync để có thể await trong component
  const {mutateAsync, isError, isSuccess} = mutation;

  return {
    logout: mutateAsync,
    isError,
    isSuccess,
  };
};

export default useLogoutAPI;
