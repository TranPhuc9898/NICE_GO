import callApi from '@/constants/callApi';

interface OrderInfoRequest {
  destinations: string;
  origins: string;
  type: string; // Always "place_id"
}

interface OrderInfoData {
  distance: string; // Example: "15 km"
  duration: string; // Example: "20 mins"
  price: number; // Example: 50000
}

interface OrderInfoResponse {
  data: OrderInfoData;
  msg: string;
}

export const getOrderInfo = async (
  origins: string,
  destinations: string,
): Promise<OrderInfoResponse> => {
  try {
    const data: OrderInfoRequest = {
      destinations,
      origins,
      type: 'place_id',
    };

    const response = await callApi.post<OrderInfoResponse>(
      '/order/get-info',
      data,
    );

    if (response && response.data && response.msg === 'success') {
      return response;
    } else {
      throw new Error('Dữ liệu không hợp lệ từ phản hồi API');
    }
  } catch (error: any) {
    console.error('🚀 ~ getOrderInfo error:', error.response || error.message);
    throw error;
  }
};
