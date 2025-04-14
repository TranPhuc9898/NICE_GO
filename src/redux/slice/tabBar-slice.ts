// tabBarSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface TabBarState {
  translateY: number;
}

const initialState: TabBarState = {
  translateY: 0, // Giả sử 0 là trạng thái hiển thị hoàn toàn
};

export const tabBarSlice = createSlice({
  name: 'tabBar',
  initialState,
  reducers: {
    setTabBarTranslateY: (state: any, action: PayloadAction<number>) => {
      state.translateY = action.payload;
    },
  },
});

export const {setTabBarTranslateY} = tabBarSlice.actions;

export default tabBarSlice.reducer;
