import callApi from '@/constants/callApi';
import {useMutation, UseMutationResult} from '@tanstack/react-query';

interface UploadImageRequest {
  filename: string;
  base64: string;
}

interface UploadImageResponse {
  success: boolean;
  message?: string;
  data?: {
    url?: string;
    id?: string;
  };
}

const MediaApiEndPoint = {
  uploadImage: '/media/imagebase64',
};

const useUploadImageApi = (): UseMutationResult<
  UploadImageResponse,
  Error,
  UploadImageRequest
> => {
  return useMutation({
    mutationFn: async (payload: UploadImageRequest) => {
      try {
        const response = await callApi.post<UploadImageResponse>(
          MediaApiEndPoint.uploadImage,
          payload,
        );
        console.log('✅ Upload Image API response:', response);
        return response;
      } catch (error) {
        console.error('❌ Upload Image API Error:', error);
        throw error;
      }
    },
  });
};

// Ví dụ sử dụng trong component
/*
const ExampleComponent = () => {
  const { mutate, isPending, isError, data } = useUploadImageApi();

  const handleUpload = () => {
    const payload = {
      filename: "abc.jpg",
      base64: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    };

    mutate(payload, {
      onSuccess: (response) => {
        console.log('Upload success:', response);
      },
      onError: (error) => {
        console.log('Upload failed:', error);
      }
    });
  };

  return (
    <button onClick={handleUpload} disabled={isPending}>
      {isPending ? 'Uploading...' : 'Upload Image'}
    </button>
  );
};
*/

export default useUploadImageApi;
