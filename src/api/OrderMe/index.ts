import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

interface OrderMeResponse {
  data: {
    booking_type: string;
    car_type: string;
    destination: string;
    distance: number;
    id: number;
    origin: string;
    price: number;
    start_at: string;
    status: string;
    trip_type: string;
    type_owner: string;
  }[];
}

const OrderMeApiEndPoint = {
  me: '/order/me',
};

const useOrderMeApi = (enabled: boolean) => {
  const {data, isLoading, isError, refetch} = useQuery<OrderMeResponse>({
    queryKey: ['OrderMe_API'],
    queryFn: async () => {
      // Gọi GET vì bạn muốn lấy danh sách order
      try {
        const response = await callApi.get<OrderMeResponse>(
          OrderMeApiEndPoint.me,
        );
        console.log('✅ API response:', response);
        return response;
      } catch (error) {
        console.error('❌ API Error:', error);
        throw error;
      }
    },
    enabled: true,
    staleTime: 0, // Luôn fetch lại khi component mount
    refetchOnMount: 'always',
    refetchOnWindowFocus: true, // Thêm dòng này
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export default useOrderMeApi;
