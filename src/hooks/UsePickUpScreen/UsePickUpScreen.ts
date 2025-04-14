import Setting_API from '@/api/Setting';
import {setPickUpData} from '@/redux/slice/PickUpSlice/PickUpSlice';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

const usePickUp = () => {
  const {data, isLoading, isError} = Setting_API();

  const dispatch = useDispatch();
  useEffect(() => {
    if (data) {
      dispatch(setPickUpData(data));
    }
  }, [data, isLoading, isError, dispatch]);

  return {
    data,
    isLoading,
    isError,
  };
};
export default usePickUp;
