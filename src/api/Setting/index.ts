import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

// Root của phản hồi API
interface ApiSettingResponse {
  data: Data;
  msg: string;
}

// Dữ liệu chính trong phản hồi
interface Data {
  booking_type: BookType[];
  car_type: CarType[];
  last_update: number;
  limit_page: string;
  locations: Locations;
  payment_methods: PaymentMethod[];
  trip_type: TripType[];
}

// Loại xe
interface CarType {
  id: number;
  name: string;
}

interface BookType {
  id: number;
  name: string;
}

// Các địa điểm (bắt đầu và kết thúc)
interface Locations {
  start: Location[];
  end: Location[];
}

// Một địa điểm cụ thể
interface Location {
  id: number;
  name: string;
  districts: District[];
}

// Quận/Huyện trong một địa điểm
interface District {
  name: string;
  wards: Ward[];
}

// Phường/Xã trong một quận/huyện
interface Ward {
  name: string;
}

// Phương thức thanh toán
interface PaymentMethod {
  id: number;
  name: string;
}

// Loại chuyến đi
interface TripType {
  id: number;
  name: string;
}

const Setting_API = () => {
  // con cặc mày thêm generic kiểu `ApiSettingResponse` vào đây
  const {data, isLoading, isError} = useQuery<ApiSettingResponse>({
    queryKey: ['Setting_API'],
    queryFn: async () => {
      const response = await callApi.get<ApiSettingResponse>('/setting/', {});
      return response;
    },
  });
  return {data, isLoading, isError};
};

export default Setting_API;
