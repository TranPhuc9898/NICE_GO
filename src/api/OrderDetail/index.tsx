import {useQuery} from '@tanstack/react-query';
import callApi from '@/constants/callApi';

// Định nghĩa endpoint
const OrderDetailApiEndpoint = {
  order: (id: number) => `/order/${id}`,
};

// Request body gửi lên API
interface OrderDetailRequestBody {
  id: number;
}

// Response API trả về
export interface OrderDetailResponse {
  data: {
    booking_type: string;
    car_type: string;
    created_at: string;
    destination: string;
    distance: number;
    driver_info: any; // hoặc kiểu tương ứng
    duration: string; // ví dụ: "1:3:52"
    id: number;
    origin: string;
    owner_info: {
      name: string;
      phone: string;
    };
    price: number;
    seat_available: number;
    seats: number;
    start_at: string;
    status: string;
    trip_type: string;
    type_owner: string;
    updated_at: string;
  };
  msg: string;
}
// Tạo custom hook
const useOrderDetailApi = (
  requestBody: OrderDetailRequestBody,
  enabled: boolean,
) => {
  // Sử dụng react-query
  const {data, isLoading, isError, refetch} = useQuery<OrderDetailResponse>({
    queryKey: ['OrderDetail_API', requestBody],
    queryFn: async () => {
      // Gọi POST với endpoint `/order/:id`, body truyền { id: number }
      const response = await callApi.get<OrderDetailResponse>(
        OrderDetailApiEndpoint.order(requestBody.id),
      );
      return response;
    },
    enabled: !!requestBody, // enabled = false => sẽ không tự động gọi API cho đến khi refetch
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};

export default useOrderDetailApi;
