import callApi from '@/constants/callApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useMutation, useQueryClient} from '@tanstack/react-query';

export interface UserUpdatePayload {
  name?: string;
  phone_number?: string;
  email?: string;
  address?: string;
  avatar?: string; // Chỉ gửi filename nếu cần
}

export interface UserUpdateResponse {
  msg: string;
  data: {
    id: number;
    name: string;
    phone_number: string;
    email: string;
    address: string;
    avatar?: string;
  };
}

const UserUpdateApiEndpoint = {
  update: '/user/', // Chỉ cần /user vì baseURL đã là https://car.1dev.icu/api
};

const useUserUpdateApi = () => {
  const queryClient = useQueryClient();

  const {mutate, isPending, isError, error} = useMutation({
    mutationFn: async (payload: UserUpdatePayload) => {
      try {
        // Kiểm tra token trước khi gửi yêu cầu
        const token = await AsyncStorage.getItem('accessToken');
        if (!token) {
          throw new Error('Không có token. Vui lòng đăng nhập lại.');
        }

        const response = await callApi.put<UserUpdateResponse>(
          UserUpdateApiEndpoint.update,
          payload,
        );
        console.log('✅ Update API response:', response);
        return response;
      } catch (error: any) {
        console.error(
          '❌ Update API Error:',
          error.response?.data || error.message,
        );
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['UserMe_API']});
    },
    onError: (error: any) => {
      console.error('❌ Update API Error:', error.message);
    },
  });

  return {mutate, isPending, isError, error};
};

export default useUserUpdateApi;
