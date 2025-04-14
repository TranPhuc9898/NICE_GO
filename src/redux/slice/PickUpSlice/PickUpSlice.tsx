import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface IPickUpDataItem {
  selectedCity: any;
}

export interface PickUpState {
  data: IPickUpDataItem | null;
}

const initialState: PickUpState = {
  data: null,
};

const pickUpSlice = createSlice({
  name: 'pickUp',
  initialState,
  reducers: {
    setPickUpData: (state, action) => {
      state.data = action.payload;
    },
    setPickUpDataItem: (state, action: PayloadAction<IPickUpDataItem>) => {
      state.data = action.payload;
    },
  },
});

export const {setPickUpData, setPickUpDataItem} = pickUpSlice.actions;
export default pickUpSlice.reducer;
