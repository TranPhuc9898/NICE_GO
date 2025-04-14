import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

interface Order {
  booking_type: string;
  car_type: string;
  destination: string;
  distance: number;
  duration: string;
  id: number;
  origin: string;
  price: number;
  start_at: string;
  status: string;
  trip_type: string;
  type_owner: string;
}

interface OrderMeResponse {
  data: Order[];
  msg: string;
}

const useOrderMeAcceptApi = (status: string = 'accepted', enabled = true) => {
  const {data, isLoading, isError, refetch} = useQuery<OrderMeResponse>({
    // Key để React Query nhận diện và cache
    queryKey: ['OrderMe_API', status],
    // Hàm gọi API
    queryFn: async () => {
      // Tạo endpoint kèm query param
      const endpoint = `/order/me?status=${status}`;
      const response = await callApi.get<OrderMeResponse>(endpoint);
      return response;
    },
    // enabled = false => không gọi API ngay, phải gọi refetch() mới chạy
    enabled,
    staleTime: 60 * 1000, // 1 phút coi data là "tươi"
    refetchOnWindowFocus: false, // Tắt refetch khi focus
    refetchOnMount: true, // Chỉ refetch khi component remount NẾU data đã stale
    refetchOnReconnect: false, // Tự động refetch khi có kết nối mạng lại
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export default useOrderMeAcceptApi;
