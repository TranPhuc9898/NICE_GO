import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

interface VerifyPhoneRequestBody {
  phone: string;
  code: string;
}

interface VerifyPhoneResponse {
  data: {
    msg: string;
    // Tuỳ vào response API thực tế, bạn thêm/bớt field nếu cần
    // e.g. token, user info, etc.
  };
}

// Endpoint
const VerifyPhoneApiEndpoint = {
  verify: '/auth/verify-phone',
};
const useVerifyPhoneApi = (
  requestBody: VerifyPhoneRequestBody,
  enabled: boolean,
) => {
  const {data, isLoading, isError, error, refetch} = useQuery({
    queryKey: ['VerifyPhone_API', requestBody],
    queryFn: async () => {
      // callApi.post có thể throw error nếu status != 200 (tuỳ config axios).
      // Nên dùng try/catch để handle rõ ràng.
      try {
        const response = await callApi.post<VerifyPhoneResponse>(
          VerifyPhoneApiEndpoint.verify,
          requestBody,
        );
        console.log('🚀 ~ queryFn: ~ requestBody:', requestBody);
        // Luôn trả về dữ liệu gốc từ server
        return response; // => { msg: "..."}
      } catch (err) {
        // Nếu server trả về lỗi => ném ra để React Query đưa vào isError
        throw err;
      }
    },
    enabled,
    // Tắt retry nếu không muốn gọi lại API khi lỗi
    retry: false,
  });

  return {data, isLoading, isError, error, refetch};
};
export default useVerifyPhoneApi;
