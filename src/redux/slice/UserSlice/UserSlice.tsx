import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  role_index: '',
};

const userSlice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {
    setUserRole: (state, action) => {
      state.role_index = action.payload;
    },
  },
});

export const {setUserRole} = userSlice.actions;
export default userSlice.reducer;
