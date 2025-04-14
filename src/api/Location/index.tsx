import callApi from '@/constants/callApi';

interface Location {
  description: string;
  place_id: string;
}

interface LocationResponse {
  data: Location[];
  msg: string;
}

interface LocationRequest {
  query: string;
}

export const getLocations = async (
  query: string,
): Promise<LocationResponse> => {
  try {
    const data: LocationRequest = {query};
    const response = await callApi.post<LocationResponse>(
      '/location/autocomplete',
      data,
    );
    console.log('🚀 ~ response:', response);
    if (response && response.data && response.msg === 'success') {
      return response;
    } else {
      throw new Error('Dữ liệu không hợp lệ từ phản hồi API');
    }
  } catch (error: any) {
    console.error('🚀 ~ getLocations error:', error.response || error.message);
    throw error;
  }
};
