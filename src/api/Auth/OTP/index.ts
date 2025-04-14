import callApi from '@/constants/callApi';

interface OTPResponse {
  msg: string;
}

interface OTPRequest {
  phone: string;
}

export const OTPApi = async (phone: string): Promise<OTPResponse> => {
  try {
    const data: OTPRequest = {phone};
    const response = await callApi.post<OTPResponse>(
      '/auth/create-otp-phone',
      data,
    );
    if (response && response.msg) {
      return response;
    } else {
      throw new Error('OTP không hợp lệ');
    }
  } catch (error: any) {
    console.error('🚀 ~ OTPApi error:', error.response || error.message);
    throw error; // Ném lỗi để hàm gọi biết có lỗi xảy ra
  }
};

// 0935068946
