import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

interface OrderAddRequestBody {
  origin: {
    name: string;
    place_id: string;
    lat: any;
    lng: any;
  };
  destination: {
    name: string;
    place_id: string;
    lat: any;
    lng: any;
  };
  distance: any;
  type: string;
  date_start: any;
  time_start: any;
  trip_type: number;
  car_type: number;
  booking_type: number;
  enable_resell: boolean;
  price: number;
}

interface OrderAddResponse {
  data: {
    booking_type: number;
    car_type: number;
    destination_location: string;
    destination_location_place_id: string;
    distance: any;
    enable_resell: boolean;
    origin_location: string;
    origin_location_place_id: string;
    price: number;
    start_at: string;
    status: string;
    trip_type: number;
    user_id: number;
  };
}

const OrderAddApiEndPoint = {
  order: '/order/add',
};

const useOrderAddApi = (requestBody: OrderAddRequestBody, enabled: boolean) => {
  const {data, isLoading, isError, refetch} = useQuery<OrderAddResponse>({
    queryKey: ['OrderAdd_API', requestBody],
    queryFn: async () => {
      const response = await callApi.post<OrderAddResponse>(
        OrderAddApiEndPoint.order,
        requestBody,
      );
      return response;
    },
    enabled, // false thì nó sẽ ko gọi API cho đến khi mình refetch
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
};
export default useOrderAddApi;
