import callApi from '@/constants/callApi';

// Định nghĩa interface cho yêu cầu đăng ký người dùng
export interface IRegisterUserRequest {
  phone_number: string;
  otp: string; // Đổi từ phone1 thành otp
  name: string;
  email: string;
  password: string;
  address: string;
}

// Định nghĩa interface cho dữ liệu người dùng trả về sau khi đăng ký
export interface IUser {
  address: string;
  avatar: string | null;
  cover: string | null;
  created_at: string;
  deleted_at: string | null;
  email: string;
  id: number;
  name: string;
  phone_number: string;
  role_index: string;
  updated_at: string;
  verify_driver: boolean;
  verify_phone: boolean;
}

// Định nghĩa interface cho phản hồi từ API sau khi đăng ký
export interface IRegisterUserResponse {
  data: {
    code: number;
    data: IUser;
    msg: string;
    status: string;
  };
}

// Hàm đăng ký người dùng
export const register = async (
  phone_number: string,
  otp: string,
  name: string,
  email: string,
  password: string,
  address: string,
): Promise<IRegisterUserResponse> => {
  try {
    const data: IRegisterUserRequest = {
      phone_number,
      otp,
      name,
      email,
      password,
      address,
    };

    const response = await callApi.post<IRegisterUserResponse>(
      '/auth/register',
      data,
    );

    // Kiểm tra phản hồi thành công
    if (
      response.data &&
      response.data?.status === 'success' &&
      response.data?.code === 200
    ) {
      return response;
    } else {
      throw new Error(response.data?.msg || 'Đăng ký không thành công');
    }
  } catch (error: any) {
    // Kiểm tra lỗi từ API
    if (error.response && error.response.data && error.response.data.msg) {
      throw new Error(error.response.data.msg);
    } else {
      throw error;
    }
  }
};
