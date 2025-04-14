import {ICardOrder} from '@/utils/types';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface IOrderState {
  data: ICardOrder[]; // Đảm bảo state có kiểu rõ ràng
}

const initialState: IOrderState = {
  data: [],
};

const orderListSlice = createSlice({
  name: 'oderSlice',
  initialState,
  reducers: {
    setOrderList: (state, action: PayloadAction<any>) => {
      state.data = action.payload.data;
    },
  },
});

export const {setOrderList} = orderListSlice.actions;
export default orderListSlice.reducer;
