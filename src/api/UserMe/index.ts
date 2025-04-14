import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

export interface UserMeResponse {
  data: {
    id: number;
    name: string;
    avatar?: string;
    // Thêm các trường khác nếu cần
  };
}

const UserMeApiEndpoint = {
  me: '/user/me',
};

const useUserMeApi = (enabled: boolean = true) => {
  const {data, isLoading, isError, refetch} = useQuery<UserMeResponse>({
    queryKey: ['UserMe_API'],
    queryFn: async () => {
      try {
        const response = await callApi.get<UserMeResponse>(
          UserMeApiEndpoint.me,
        );
        console.log('✅ API response:', response);
        return response;
      } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
      }
    },
    enabled,
    staleTime: 0, // luôn fetch lại khi component mount
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  return {data, isLoading, isError, refetch};
};

export default useUserMeApi;
