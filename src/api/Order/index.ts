import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

interface OrderRequestBody {
  origin: {
    province: number;
    district: number;
    ward: number;
  };
  destination: {
    province: number;
    district: number;
    ward: number;
  };
  trip_type: number;
  car_type: number;
}

interface OrderResponse {
  data: {
    info: {
      id: number;
      origin: string;
      destination: string;
      distance: number;
      price: number;
    };
  };
  msg: string;
}

// Tao viết dạng custom hook, pass body vào, nó bắn POST, xài useQuery
const useOrderAPI = (requestBody: OrderRequestBody, enabled: boolean) => {
  // 1. Đặt enabled = false để tắt auto-fetch
  // const {data, isLoading, isError, refetch} = useQuery<OrderResponse>({
  //   queryKey: ['Order_API', requestBody],
  //   queryFn: async () => {
  //     const response = await callApi.post<OrderResponse>(
  //       '/order/get-info',
  //       requestBody,
  //     );
  //     return response;
  //   },
  //   enabled, // false thì nó sẽ ko gọi API cho đến khi mình refetch
  // });

  return {
    // data,
    // isLoading,
    // isError,
    // refetch,
  };
};

export default useOrderAPI;
