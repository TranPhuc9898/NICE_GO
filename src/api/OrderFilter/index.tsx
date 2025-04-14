// // useOrderFilter.tsx
// import {useQuery, UseQueryResult} from '@tanstack/react-query';
// import callApi from '@/constants/callApi';

// // Định nghĩa kiểu cho body request
// export interface OrderFilterBody {
//   origin: {
//     lat: string;
//     lng: string;
//   };
//   destination: {
//     lat: string;
//     lng: string;
//   };
//   range: number;
// }

// // Định nghĩa kiểu cho từng phần tử dữ liệu trả về
// export interface FilteredOrderData {
//   booking_type: string;
//   car_type: string;
//   destination: string;
//   distance: number;
//   id: number;
//   origin: string;
//   price: number;
//   start_at: string;
//   status: string;
//   trip_type: string;
//   type_owner: string;
// }

// // Định nghĩa kiểu cho response trả về
// export interface OrderFilterResponse {
//   data: FilteredOrderData[];
// }

// /**
//  * Custom hook gọi POST /order/filter/:user_type
//  * @param userType Giá trị :user_type sẽ truyền lên url
//  * @param body Tham số body (origin, destination, range)
//  * @returns Mảng dữ liệu FilteredOrderData trả về từ server
//  */
// const useOrderFilter = (
//   userType: string,
//   body: OrderFilterBody,
// ): UseQueryResult<FilteredOrderData[], Error> => {
//   return useQuery<FilteredOrderData[], Error>({
//     queryKey: ['Order_Filter_API', userType, body],
//     queryFn: async () => {
//       const response = await callApi.post<OrderFilterResponse>(
//         `/order/filter/${userType}`,
//         body,
//       );
//       // Ở API này response.data là object có property data là mảng
//       // Mình return response.data.data để match kiểu FilteredOrderData[]
//       return response.data?.data;
//     },
//     // Chỉ gọi nếu có userType (hoặc bạn tự điều chỉnh logic)
//     enabled: !!userType,
//     // Tuỳ chọn các option khác nếu cần
//     // refetchOnWindowFocus: false,
//     // staleTime: 5000,
//   });
// };

// export default useOrderFilter;

// useOrderFilter.ts
import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

interface OrderFilterBody {
  origin: {
    lat: string;
    lng: string;
  };
  destination: {
    lat: string;
    lng: string;
  };
  range: number;
}

interface FilteredOrderData {
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
}

interface OrderFilterResponse {
  data: FilteredOrderData[];
}

const useOrderFilter = (
  userType: string,
  requestBody: OrderFilterBody,
  enabled: boolean,
) => {
  const {data, isLoading, isError, refetch, isFetching} =
    useQuery<OrderFilterResponse>({
      queryKey: ['OrderFilter_API', userType, requestBody],
      queryFn: async () => {
        // POST /order/filter/:userType
        const response = await callApi.post<OrderFilterResponse>(
          `/order/filter/${userType}`,
          requestBody,
        );
        return response;
      },
      enabled, // Cho phép tắt/bật query tuỳ nhu cầu
    });

  return {
    data, // response từ server
    isLoading, // trạng thái đang gọi API
    isError, // có lỗi hay không
    refetch, // hàm gọi lại API
    isFetching,
  };
};

export default useOrderFilter;
