import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

interface OrderAcceptResponse {
  data: any; // Data trả về để trống theo yêu cầu
}

const OrderAcceptApiEndPoint = {
  orderAccept: (id: string | number) => `/order/accept/${id}`,
};

const useOrderAcceptApi = (id: string | number, enabled: boolean) => {
  const {data, isLoading, isError} = useQuery<OrderAcceptResponse>({
    queryKey: ['OrderAccept_API', id],
    queryFn: async () => {
      const response = await callApi.put<OrderAcceptResponse>(
        OrderAcceptApiEndPoint.orderAccept(id),
        {}, // Payload để trống
      );
      return response;
    },
    enabled, // Nếu false, sẽ không gọi API cho đến khi gọi refetch
  });

  return {
    data,
    isLoading,
    isError,
  };
};

export default useOrderAcceptApi;
