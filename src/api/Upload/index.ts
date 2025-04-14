import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

export interface UploadImageResponse {
  data: {
    id: number;
    url: string;
    // Thêm các trường khác nếu cần
  };
}

const MediaApiEndpoint = {
  uploadImage: '/media/image',
};

const useUploadImageApi = (file: File | null, enabled: boolean = true) => {
  const {data, isLoading, isError, refetch} = useQuery<UploadImageResponse>({
    queryKey: ['UploadImage_API', file?.name], // Dùng tên file làm key để tránh trùng lặp
    queryFn: async () => {
      try {
        // Tạo FormData để gửi file
        const formData = new FormData();
        if (file) {
          formData.append('file', file);
        }

        const response = await callApi.post<UploadImageResponse>(
          MediaApiEndpoint.uploadImage,
          formData,
        );
        console.log('✅ Upload Image API response:', response);
        return response;
      } catch (error) {
        console.error('❌ Upload Image API Error:', error);
        throw error;
      }
    },
    enabled: enabled && !!file, // Chỉ chạy khi có file và enabled = true
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
  });

  return {data, isLoading, isError, refetch};
};

export default useUploadImageApi;
