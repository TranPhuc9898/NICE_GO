import axios, {AxiosInstance, AxiosResponse} from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://car.1dev.icu/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  maxRedirects: 5,
  validateStatus: status => status >= 200 && status < 300,
});

// Request interceptor để thêm token
axiosInstance.interceptors.request.use(
  async config => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Đã thêm token vào header:', token); // Thêm log để kiểm tra
      } else {
        console.warn('Không tìm thấy token trong AsyncStorage'); // Cảnh báo nếu không có token
      }
    } catch (error) {
      console.error('Lỗi lấy token từ AsyncStorage:', error);
    }
    return config;
  },
  error => {
    console.error('Request Interceptor Error:', error);
    return Promise.reject(error);
  },
);

// Response interceptor để log response và xử lý lỗi
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log('Response URL:', response.config.url);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

interface CallApi {
  get: <T>(url: string, params?: any) => Promise<T>;
  post: <T>(url: string, data?: any) => Promise<T>;
  put: <T>(url: string, data?: any) => Promise<T>;
}

const callApi: CallApi = {
  get: async <T>(url: string, params: any = {}): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.get(url, {params});
      return response.data;
    } catch (error: any) {
      console.error(
        `GET ${url} failed:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  post: async <T>(url: string, data: any = {}): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.post(url, data);
      return response.data;
    } catch (error: any) {
      console.error(
        `POST ${url} failed:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  },
  put: async <T>(url: string, data: any = {}): Promise<T> => {
    try {
      const response: AxiosResponse<T> = await axiosInstance.put(url, data);
      return response.data;
    } catch (error: any) {
      console.error(
        `PUT ${url} failed:`,
        error.response?.data || error.message,
      );
      throw error;
    }
  },
};

export default callApi;
