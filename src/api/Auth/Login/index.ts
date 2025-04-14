import callApi from '@/constants/callApi';

interface User {
  address: string;
  created_at: string;
  deleted_at: string | null;
  email: string;
  id: number;
  is_driver: boolean;
  is_partner: boolean;
  name: string;
  phone_number: string;
  role: string;
  updated_at: string;
  verify_driver: boolean;
  verify_phone: boolean;
}

interface LoginResponse {
  access_token: string;
  code: number;
  msg: string;
  status: string;
  user: User;
}

interface LoginRequest {
  phone: string;
  password: string;
}

export const login = async (
  phone: string,
  password: string,
): Promise<LoginResponse> => {
  try {
    const data: LoginRequest = {phone, password};
    const response = await callApi.post<LoginResponse>('/auth/login', data);
    if (response && response.access_token) {
      return response;
    } else {
      throw new Error('access_token không tồn tại trong phản hồi API');
    }
  } catch (error: any) {
    console.error('🚀 ~ login error:', error.response || error.message);
    throw error;
  }
};
