import callApi from '@/constants/callApi';
import {useQuery} from '@tanstack/react-query';

interface LocationDetails {
  latitude: string;
  longitude: string;
}

interface LocationDetailsResponse {
  data: LocationDetails;
  msg: string;
}

interface LocationDetailsRequest {
  place_id: string;
  //   query: string;
}

const useGetLocationDetails = (
  requestBody: LocationDetailsRequest,
  enabled: boolean,
) => {
  const {data, isLoading, isError, refetch} = useQuery<LocationDetailsResponse>(
    {
      queryKey: ['LocationDetails_API', requestBody],
      queryFn: async () => {
        const response = await callApi.get<LocationDetailsResponse>(
          `/location/details/${requestBody.place_id}`,
          //   {query: requestBody.query},
        );
        return response;
      },
      enabled,
    },
  );

  return {data, isLoading, isError, refetch};
};

export default useGetLocationDetails;
